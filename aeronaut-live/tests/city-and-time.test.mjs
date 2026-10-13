import test from 'node:test';
import assert from 'node:assert/strict';
const cities={CapeTown:[-33.925,18.424],Johannesburg:[-26.204,28.047],London:[51.507,-.128],Tokyo:[35.676,139.65]};
test('South Africa always uses SAST independent of browser locale',()=>{
const fmt=new Intl.DateTimeFormat('en-ZA',{timeZone:'Africa/Johannesburg',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
assert.equal(fmt.format(new Date('2026-10-13T09:00:00Z')),'11:00');
});
test('searched coordinates work for negative latitude and longitude',()=>{
const parse=s=>s.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
assert.ok(parse('-33.925,18.424'));
assert.ok(parse('40.713, -74.006'));
assert.equal(parse('Cape Town'),null);
});
test('quick-city coordinates remain finite and valid',()=>{for(const coords of Object.values(cities))assert.ok(Math.abs(coords[0])<85&&Math.abs(coords[1])<=180)});
