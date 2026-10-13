import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const htmlFile = fileURLToPath(new URL('./index.html', import.meta.url));
const port = Number(process.env.PORT || 10000);
const cache = new Map();
const status = { global: null, regional: null };
const TTL = { global: 1200000, regional: 50000 };
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'X-Content-Type-Options': 'nosniff' };
function json(res, code, data) {
  const cachePolicy = code === 200 && Array.isArray(data?.aircraft) && !data.stale ? (data.scope === 'worldwide' || data.scope === 'sampled' ? 'public, s-maxage=1200, stale-while-revalidate=300' : data.scope === 'single' ? 'public, s-maxage=35, stale-while-revalidate=10' : 'public, s-maxage=50, stale-while-revalidate=20') : 'no-store';
  res.writeHead(code, { ...cors, 'Cache-Control': cachePolicy, 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}
async function fetchJson(url) {
  let r;
  try { r = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': 'AeronautObservatory/1.0 (non-commercial flight tracking demo)' }, signal: AbortSignal.timeout(9000) }); }
  catch(e){ const reason=e?.cause?.code || e?.name || 'connection error'; throw new Error('Network connection failed ('+String(reason).slice(0,48)+')'); }
  if (!r.ok) { const e = new Error('Upstream HTTP ' + r.status); e.code = r.status; throw e; }
  return r.json();
}
function normalizeGlobal(data) {
  if (!Array.isArray(data.states)) throw new Error('OpenSky returned no states array');
  const now = Number(data.time) || Date.now()/1000;
  return data.states.map(a => {
    if (!Number.isFinite(a[5]) || !Number.isFinite(a[6])) return null;
    const age = now - Number(a[4]);
    if (!Number.isFinite(age) || age > 180 || age < -60) return null;
    return { id: String(a[0]), call: String(a[1] || '').trim(), reg: '', type: '', lat:a[6], lon:a[5], alt: Number.isFinite(a[7]) ? Math.round(a[7]*3.28084) : null, speed: Number.isFinite(a[9]) ? Math.round(a[9]*1.94384) : null, heading: Number.isFinite(a[10]) ? Math.round(a[10]) : null, ground: !!a[8], age:Math.max(0,Math.round(age)), country:String(a[2]||'') };
  }).filter(Boolean);
}
function normalizeRegional(data) {
  if (!Array.isArray(data.ac)) throw new Error('No aircraft array in response');
  return data.ac.map(a => {
    if (!Number.isFinite(a.lat) || !Number.isFinite(a.lon) || !a.hex) return null;
    const age = Number.isFinite(a.seen_pos) ? a.seen_pos : Number(a.seen);
    if (!Number.isFinite(age) || age > 90 || age < 0) return null;
    return { id: String(a.hex), call: String(a.flight||'').trim(), reg:String(a.r||''), type:String(a.t||''), lat:a.lat, lon:a.lon, alt: typeof a.alt_baro === 'number' ? Math.round(a.alt_baro) : typeof a.alt_geom === 'number' ? Math.round(a.alt_geom) : null, speed:Number.isFinite(a.gs)?Math.round(a.gs):null, heading:Number.isFinite(a.track)?Math.round(a.track):null, ground:a.alt_baro==='ground', age:Math.round(age), country:'' };
  }).filter(Boolean);
}
function record(group, success, source, count, error) {
  status[group] = { success, source, count, checkedAt:new Date().toISOString(), error:error||null };
}
async function cached(key, group, producer) {
  const now = Date.now(), item = cache.get(key);
  if (item && now-item.at<TTL[group] && item.data) return item.data;
  if (item?.pending) return item.pending;
  const pending = (async () => {
    try {
      const data=await producer();
      cache.set(key,{ data, at:Date.now() });
      record(group,true,data.source,data.aircraft.length,null);
      return data;
    } catch (e) {
      record(group,false,null,item?.data?.aircraft?.length||0,e.message);
      if (item?.data && now-item.at<3600000) {
        return { ...item.data, stale:true, warning:'Upstream unavailable: '+e.message };
      }
      throw e;
    }
  })();
  cache.set(key,{...item,pending});
  try { return await pending; }
  finally { const current=cache.get(key); if(current?.pending===pending){if(item?.data)cache.set(key,item);else cache.delete(key);} }
}
// Deliberate geographic samples, not blanket worldwide ADS-B coverage.
// Public region API radius is limited to 250 nautical miles; samples are visibly identified.
const GLOBAL_SAMPLE_CENTERS=[
  ['New York',40.713,-74.006],['Los Angeles',34.052,-118.244],
  ['London',51.507,-0.128],['São Paulo',-23.55,-46.633],
  ['Johannesburg',-26.204,28.047],['Dubai',25.205,55.271],
  ['Singapore',1.352,103.820],['Tokyo',35.676,139.650],
  ['Sydney',-33.869,151.209]
];
async function globalFeed() {
  return cached('global','global',async()=>{
    let openSkyError=null;
    try {
      const raw=await fetchJson('https://opensky-network.org/api/states/all');
      return { source:'OpenSky Network',scope:'worldwide',retrievedAt:new Date().toISOString(),refreshSeconds:1200,stale:false,aircraft:normalizeGlobal(raw) };
    } catch(e) { openSkyError=e; }
    // Cloud-hosted OpenSky requests can fail. Recover with real, but geographically
    // incomplete, observations. Never misrepresent the sample as a full-world feed.
    const results=await Promise.allSettled(GLOBAL_SAMPLE_CENTERS.map(async([city,lat,lon])=>({city, snapshot:await regionalFeed(lat,lon)})));
    const good=results.filter(r=>r.status==='fulfilled').map(r=>r.value);
    if(!good.length) {
      throw new Error('OpenSky unavailable ('+(openSkyError?.message||'network failure')+'); all regional fallback sources unavailable');
    }
    const deduped=new Map();
    for(const {snapshot} of good) {
      for(const aircraft of snapshot.aircraft) {
        const prior=deduped.get(aircraft.id);
        if(!prior || aircraft.age<prior.age) deduped.set(aircraft.id,aircraft);
      }
    }
    return {
      source:'ADSB.lol / Airplanes.live regional samples',scope:'sampled',
      sampledRegions:good.map(x=>x.city), sampledRegionCount:good.length,
      totalSampleRegions:GLOBAL_SAMPLE_CENTERS.length,
      warning:'PARTIAL COVERAGE: Observations are sampled around '+good.length+' selected cities only, not across the entire world. OpenSky global feed could not be reached.',
      retrievedAt:new Date().toISOString(),refreshSeconds:1200,stale:false,aircraft:[...deduped.values()]
    };
  });
}
async function regionalFeed(lat,lon) {
  const la=Math.round(lat*4)/4, lo=Math.round(lon*4)/4;
  const key='reg:'+la+':'+lo;
  return cached(key,'regional',async()=>{
    const providers=[
      ['ADSB.lol','https://api.adsb.lol/v2/point/'+la+'/'+lo+'/250'],
      ['Airplanes.live','https://api.airplanes.live/v2/point/'+la+'/'+lo+'/250']
    ];
    let problem;
    for (const [source,url] of providers) {
      try {
        const raw=await fetchJson(url);
        return { source,scope:'regional',center:{lat:la,lon:lo},radiusNm:250,retrievedAt:new Date().toISOString(),refreshSeconds:50,stale:false,aircraft:normalizeRegional(raw) };
      } catch(e){problem=e;}
    }
    throw new Error('Both regional providers failed. '+(problem?.message||'Unknown upstream error'));
  });
}
// The selected-plane endpoint uses the same real ADS-B sources as regional tracking.
// It returns one current observation, not an invented route or historical track.
// Open-Meteo geocoding supports worldwide city-name lookup without an API key.
// Only use returned coordinates; city discovery never fabricates flight observations.
async function findCities(query) {
  const endpoint='https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(query)+'&count=10&language=en&format=json';
  const data=await fetchJson(endpoint);
  return {results:(Array.isArray(data.results)?data.results:[]).filter(c=>Number.isFinite(c.latitude)&&Number.isFinite(c.longitude))
    .map(c=>({name:String(c.name||''),country:String(c.country||''),region:String(c.admin1||''),latitude:c.latitude,longitude:c.longitude})),
    source:'Open-Meteo Geocoding'};
}
async function trackedAircraft(icao) {
  return cached('icao:'+icao,'regional',async()=>{
    const endpoints=[
      ['ADSB.lol','https://api.adsb.lol/v2/icao/'+icao],
      ['Airplanes.live','https://api.airplanes.live/v2/hex/'+icao]
    ];
    let error;
    for(const [provider,endpoint] of endpoints){
      try {
        const raw=await fetchJson(endpoint);
        const aircraft=normalizeRegional(raw).filter(a=>a.id.toLowerCase()===icao.toLowerCase());
        if(!aircraft.length){error=new Error(provider+' returned no fresh location');continue}
        return {source:provider,scope:'single',retrievedAt:new Date().toISOString(),refreshSeconds:35,stale:false,aircraft};
      }catch(e){error=e}
    }
    throw new Error('Aircraft location unavailable ('+(error?.message||'no report')+')');
  });
}
export async function handle(req,res){
  const url = new URL(req.url||'/', 'http://localhost');
  if(req.method==='OPTIONS')return json(res,204,{});
  if(req.method!=='GET')return json(res,405,{error:'Method not allowed'});
  try {
    if(url.pathname==='/api/health') return json(res,200,{status:'ok',time:new Date().toISOString(),note:'Server running; consult /api/status for aviation feeds'});
    if(url.pathname==='/api/status') return json(res,200,status);
    if(url.pathname==='/api/global') return json(res,200,await globalFeed());
    if(url.pathname==='/api/cities'){const q=String(url.searchParams.get('q')||'').trim();if(q.length<2||q.length>100)return json(res,400,{error:'City search requires 2–100 characters'});return json(res,200,await findCities(q));}
    if(url.pathname==='/api/track'){
      const icao=String(url.searchParams.get('icao')||'').trim().toLowerCase();
      if(!/^[a-f0-9]{6}$/.test(icao))return json(res,400,{error:'Specify a six-digit ICAO hex identifier'});
      return json(res,200,await trackedAircraft(icao));
    }
    if(url.pathname==='/api/aircraft'){
      const lat=Number(url.searchParams.get('lat')),lon=Number(url.searchParams.get('lon'));
      if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat<-85||lat>85||lon<-180||lon>180)return json(res,400,{error:'Invalid latitude/longitude'});
      return json(res,200,await regionalFeed(lat,lon));
    }
    if(url.pathname==='/'||url.pathname==='/index.html'){
      const file=await readFile(htmlFile);
      res.writeHead(200,{ 'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff' });
      return res.end(file);
    }
    return json(res,404,{error:'Not found'});
  } catch(e) {
    return json(res,502,{error:'Aircraft provider unavailable',detail:e.message,checkedAt:new Date().toISOString()});
  }
}
if (!process.env.VERCEL) http.createServer(handle).listen(port,'0.0.0.0',()=>console.log('Aeronaut listening on '+port));
