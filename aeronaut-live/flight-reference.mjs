// Airport identifiers and approximate aerodrome reference coordinates.
// These are locators for pin placement, not arrival/departure schedules.
export const AIRPORTS = [
  {city:"Johannesburg",name:"O. R. Tambo International",icao:"FAOR",iata:"JNB",lat:-26.1392,lon:28.2460},
  {city:"Johannesburg",name:"Lanseria International",icao:"FALA",iata:"HLA",lat:-25.9385,lon:27.9250},
  {city:"Cape Town",name:"Cape Town International",icao:"FACT",iata:"CPT",lat:-33.9715,lon:18.6021},
  {city:"Durban",name:"King Shaka International",icao:"FALE",iata:"DUR",lat:-29.6144,lon:31.1197},
  {city:"Gqeberha",name:"Chief Dawid Stuurman International",icao:"FAPE",iata:"PLZ",lat:-33.9856,lon:25.6173},
  {city:"George",name:"George Airport",icao:"FAGG",iata:"GRJ",lat:-34.0056,lon:22.3789},
  {city:"Bloemfontein",name:"Bram Fischer International",icao:"FABL",iata:"BFN",lat:-29.0927,lon:26.3024},
  {city:"London",name:"Heathrow",icao:"EGLL",iata:"LHR",lat:51.4700,lon:-0.4543},
  {city:"London",name:"Gatwick",icao:"EGKK",iata:"LGW",lat:51.1537,lon:-0.1821},
  {city:"London",name:"London City",icao:"EGLC",iata:"LCY",lat:51.5053,lon:0.0553},
  {city:"Paris",name:"Charles de Gaulle",icao:"LFPG",iata:"CDG",lat:49.0097,lon:2.5479},
  {city:"Paris",name:"Orly",icao:"LFPO",iata:"ORY",lat:48.7262,lon:2.3652},
  {city:"Amsterdam",name:"Schiphol",icao:"EHAM",iata:"AMS",lat:52.3086,lon:4.7639},
  {city:"Frankfurt",name:"Frankfurt Airport",icao:"EDDF",iata:"FRA",lat:50.0379,lon:8.5622},
  {city:"New York",name:"John F. Kennedy International",icao:"KJFK",iata:"JFK",lat:40.6413,lon:-73.7781},
  {city:"New York",name:"LaGuardia",icao:"KLGA",iata:"LGA",lat:40.7769,lon:-73.8740},
  {city:"New York",name:"Newark Liberty International",icao:"KEWR",iata:"EWR",lat:40.6895,lon:-74.1745},
  {city:"Los Angeles",name:"Los Angeles International",icao:"KLAX",iata:"LAX",lat:33.9416,lon:-118.4085},
  {city:"Toronto",name:"Toronto Pearson",icao:"CYYZ",iata:"YYZ",lat:43.6777,lon:-79.6248},
  {city:"São Paulo",name:"Guarulhos International",icao:"SBGR",iata:"GRU",lat:-23.4356,lon:-46.4731},
  {city:"Buenos Aires",name:"Ministro Pistarini International",icao:"SAEZ",iata:"EZE",lat:-34.8222,lon:-58.5358},
  {city:"Dubai",name:"Dubai International",icao:"OMDB",iata:"DXB",lat:25.2532,lon:55.3657},
  {city:"Dubai",name:"Al Maktoum International",icao:"OMDW",iata:"DWC",lat:24.8964,lon:55.1614},
  {city:"Nairobi",name:"Jomo Kenyatta International",icao:"HKJK",iata:"NBO",lat:-1.3192,lon:36.9278},
  {city:"Cairo",name:"Cairo International",icao:"HECA",iata:"CAI",lat:30.1219,lon:31.4056},
  {city:"Lagos",name:"Murtala Muhammed International",icao:"DNMM",iata:"LOS",lat:6.5774,lon:3.3212},
  {city:"Mumbai",name:"Chhatrapati Shivaji Maharaj International",icao:"VABB",iata:"BOM",lat:19.0896,lon:72.8656},
  {city:"Delhi",name:"Indira Gandhi International",icao:"VIDP",iata:"DEL",lat:28.5562,lon:77.1000},
  {city:"Tokyo",name:"Haneda",icao:"RJTT",iata:"HND",lat:35.5494,lon:139.7798},
  {city:"Tokyo",name:"Narita",icao:"RJAA",iata:"NRT",lat:35.7720,lon:140.3929},
  {city:"Seoul",name:"Incheon International",icao:"RKSI",iata:"ICN",lat:37.4602,lon:126.4407},
  {city:"Hong Kong",name:"Hong Kong International",icao:"VHHH",iata:"HKG",lat:22.3080,lon:113.9185},
  {city:"Singapore",name:"Changi",icao:"WSSS",iata:"SIN",lat:1.3644,lon:103.9915},
  {city:"Bangkok",name:"Suvarnabhumi",icao:"VTBS",iata:"BKK",lat:13.6900,lon:100.7501},
  {city:"Sydney",name:"Sydney Kingsford Smith",icao:"YSSY",iata:"SYD",lat:-33.9399,lon:151.1753},
  {city:"Melbourne",name:"Melbourne Airport",icao:"YMML",iata:"MEL",lat:-37.6733,lon:144.8433},
  {city:"Auckland",name:"Auckland Airport",icao:"NZAA",iata:"AKL",lat:-37.0082,lon:174.7850},
  {city:"Doha",name:"Hamad International",icao:"OTHH",iata:"DOH",lat:25.2731,lon:51.6081}
];
export const airportsForCity = city => AIRPORTS.filter(a=>a.city.toLocaleLowerCase("en")===String(city||"").toLocaleLowerCase("en"));
export const findAirport = code => AIRPORTS.find(a => a.icao === String(code||"").toUpperCase() || a.iata === String(code||"").toUpperCase()) || null;
const str = x => typeof x === "string" ? x.trim() : "";
export function normalizeFlightRoute(payload){
  const route = payload?.response?.flightroute;
  if(!route || typeof route !== "object" || !route.origin || !route.destination) return null;
  function airport(a){
    if(!a || !Number.isFinite(Number(a.latitude)) || !Number.isFinite(Number(a.longitude))) return null;
    const lat=Number(a.latitude),lon=Number(a.longitude);
    if(Math.abs(lat)>90 || Math.abs(lon)>180) return null;
    return {name:str(a.name),city:str(a.municipality),country:str(a.country_name),
      iata:str(a.iata_code).toUpperCase(),icao:str(a.icao_code).toUpperCase(),lat,lon};
  }
  const origin=airport(route.origin),destination=airport(route.destination);
  if(!origin||!destination) return null;
  const airline=route.airline || {};
  return {callsign:str(route.callsign).toUpperCase(),callsignIcao:str(route.callsign_icao).toUpperCase(),
    flightNumber:str(route.callsign_iata).toUpperCase(),airline:str(airline.name),
    airlineIata:str(airline.iata).toUpperCase(),airlineIcao:str(airline.icao).toUpperCase(),
    origin,destination,source:"ADSBDB",verifiedSchedule:false};
}
export function classifyRoute(route, airport) {
  if(!route||!airport)return "nearby";
  if(String(route.destination?.icao||"").toUpperCase()===airport.icao)return "arrival";
  if(String(route.origin?.icao||"").toUpperCase()===airport.icao)return "departure";
  return "nearby";
}
export function greatCirclePoints(a,b,steps=64){
  if(!a||!b)return [];
  const r=Math.PI/180;
  const unit=p=>[Math.cos(p.lat*r)*Math.cos(p.lon*r),Math.cos(p.lat*r)*Math.sin(p.lon*r),Math.sin(p.lat*r)];
  const v=unit(a),w=unit(b);
  const dot=Math.max(-1,Math.min(1,v.reduce((t,x,i)=>t+x*w[i],0)));
  const theta=Math.acos(dot);
  const out=[];
  for(let i=0;i<=steps;i++){
    const t=i/steps;
    const aWeight=theta<1e-7?1-t:Math.sin((1-t)*theta)/Math.sin(theta);
    const bWeight=theta<1e-7?t:Math.sin(t*theta)/Math.sin(theta);
    const x=v[0]*aWeight+w[0]*bWeight,y=v[1]*aWeight+w[1]*bWeight,z=v[2]*aWeight+w[2]*bWeight;
    const len=Math.hypot(x,y,z);
    out.push({lat:Math.asin(z/len)/r,lon:Math.atan2(y,x)/r});
  }
  return out;
}

export function normalizeAircraftIdentity(payload){
 const a=payload?.response?.aircraft;
 if(!a||typeof a!=='object')return null;
 const take=(v)=>typeof v==='string'?v.trim().slice(0,120):'';
 return {
   registration:take(a.registration),type:take(a.type),icaoType:take(a.icao_type),
   manufacturer:take(a.manufacturer),operator:take(a.registered_owner),
   operatorCountry:take(a.registered_owner_country_name),
   icao:take(a.mode_s).toLowerCase(),source:'ADSBDB',
   // Aircraft ownership and operator can differ from a flight's marketed airline.
   isFlightOperatorVerified:false
 };
}
