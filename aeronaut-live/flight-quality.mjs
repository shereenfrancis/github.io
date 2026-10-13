/**
 * Provenance-conscious flight-status and trajectory normalization.
 * The functions in this module never synthesize status, airports or positions.
 */
export function normalizeFlightBoard(payload, airportIata, direction) {
  const rows=Array.isArray(payload?.data)?payload.data:[];
  const code=String(airportIata||'').toUpperCase();
  const key=direction==='departure'?'departure':'arrival';
  const out=[];
  for(const f of rows){
    if(!f||typeof f!=='object')continue;
    const origin=f.departure||{},destination=f.arrival||{},flight=f.flight||{},airline=f.airline||{},leg=f[key]||{};
    if(String(leg.iata||'').toUpperCase()!==code)continue;
    const text=value=>typeof value==='string'?value.trim().slice(0,150):'';
    const status=text(f.flight_status);
    const iata=text(flight.iata).toUpperCase(),icao=text(flight.icao).toUpperCase();
    if(!iata&&!icao)continue;
    const stamp=value=>typeof value==='string'&&!Number.isNaN(Date.parse(value))?value:'';
    out.push({
      id:[text(f.flight_date),iata||icao,code,key].join(':'),
      flightNumber:iata||icao,flightIcao:icao,flightDate:text(f.flight_date),
      airline:text(airline.name)||'Airline not supplied',status:status||'Not supplied',
      origin:{iata:text(origin.iata).toUpperCase(),name:text(origin.airport)},
      destination:{iata:text(destination.iata).toUpperCase(),name:text(destination.airport)},
      scheduled:stamp(leg.scheduled),estimated:stamp(leg.estimated),actual:stamp(leg.actual),
      terminal:text(leg.terminal),gate:text(leg.gate),delayMinutes:Number.isFinite(Number(leg.delay))?Number(leg.delay):null,
      source:'Aviationstack',verifiedSchedule:true,liveStatusProvided:!!status
    });
  }
  return out.slice(0,100);
}
export function normalizeOpenSkyTrack(payload,icao) {
  if(!Array.isArray(payload?.path))return [];
  if(String(payload.icao24||'').toLowerCase()!==String(icao||'').toLowerCase())return [];
  const result=[];
  for(const a of payload.path){
    if(!Array.isArray(a))continue;
    const [seconds,lat,lon,altitude,heading,ground]=a;
    if(!Number.isFinite(seconds)||!Number.isFinite(lat)||!Number.isFinite(lon))continue;
    if(Math.abs(lat)>90||Math.abs(lon)>180)continue;
    result.push({time:seconds*1000,lat,lon,altitudeFt:Number.isFinite(altitude)?Math.round(altitude*3.28084):null,
      heading:Number.isFinite(heading)?heading:null,ground:!!ground});
  }
  result.sort((a,b)=>a.time-b.time);
  const unique=[];
  for(const p of result){if(unique.length&&p.time<=unique[unique.length-1].time)continue;unique.push(p)}
  return unique.slice(-500);
}
export function validateIcao(value){return /^[a-f0-9]{6}$/i.test(String(value||''))}
export function sameFlightReference(row, aircraft, route){
  if(!row||!aircraft)return false;
  const clean=value=>String(value||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  const candidates=[aircraft.call,route?.flightNumber,route?.callsignIcao].map(clean).filter(Boolean);
  const matches=[row.flightNumber,row.flightIcao].map(clean).filter(Boolean);
  return candidates.some(c=>matches.includes(c));
}
