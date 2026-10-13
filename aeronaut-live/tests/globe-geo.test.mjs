import test from 'node:test';
import assert from 'node:assert/strict';
import { toCartesian, tangentEast, tangentNorth, headingVector, textureUv, wrapLongitude } from '../globe-geo.mjs';

const dot=(a,b)=>a.reduce((sum,x,i)=>sum+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function near(a,b,label){assert.ok(Math.abs(a-b)<1e-9,label+': '+a+' != '+b);}
function sphereUv([x,y,z]) {
  let phi=Math.atan2(z,-x);
  if(phi<0)phi+=2*Math.PI;
  return [phi/(2*Math.PI),.5+Math.asin(y)/Math.PI];
}
const locations={
  'Cape Town':[-33.925,18.424],Johannesburg:[-26.204,28.047],
  London:[51.507,-.128],'New York':[40.713,-74.006],
  Dubai:[25.205,55.271],Tokyo:[35.676,139.65],
  Singapore:[1.352,103.82],Sydney:[-33.869,151.209],
  Greenwich:[0,0],'Date Line':[0,179.99]
};
for(const [name,[lat,lon]] of Object.entries(locations)) {
  test(name+' projects on the correct Earth-texture coordinates',()=>{
    const p=toCartesian(lat,lon),[u,v]=sphereUv(p),[expectedU,expectedV]=textureUv(lat,lon);
    near(dot(p,p),1,'radius');near(u,expectedU,'longitude texture U');near(v,expectedV,'latitude texture V');
    near(dot(p,toCartesian(lat,lon,1.028)),1.028,'aircraft position aligned with Earth');
  });
  test(name+' has correct headings and local tangent orientation',()=>{
    const up=toCartesian(lat,lon),east=tangentEast(lon),north=tangentNorth(lat,lon);
    near(dot(up,east),0,'east tangent');near(dot(up,north),0,'north tangent');
    near(dot(east,north),0,'orthogonal');near(dot(cross(east,north),up),1,'right handed');
    near(dot(headingVector(lat,lon,0),north),1,'heading north');
    near(dot(headingVector(lat,lon,90),east),1,'heading east');
  });
}
test('Cape Town remains on the correct east longitude hemisphere',()=>{
  const p=toCartesian(-33.925,18.424);
  assert.ok(p[0]>0);assert.ok(p[2]<0);
});
test('international date line wrapping',()=>{
  near(wrapLongitude(181),-179,'east wrap');
  near(wrapLongitude(-181),179,'west wrap');
  assert.ok(dot(toCartesian(10,179.9),toCartesian(10,-179.9))>.99999);
});
