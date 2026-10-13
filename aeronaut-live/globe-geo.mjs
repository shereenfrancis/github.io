// Coordinate convention for an unrotated Three.js SphereGeometry.
// Its +X meridian has texture U=0.5 (Greenwich on a standard Earth atlas).
// Eastern longitudes point toward -Z. All aircraft and the camera use this.
const radians = degrees => degrees * Math.PI / 180;
export const wrapLongitude = longitude => ((longitude + 180) % 360 + 360) % 360 - 180;
export function toCartesian(latitude, longitude, radius = 1) {
  const lat = radians(latitude), lon = radians(longitude);
  const horizontal = radius * Math.cos(lat);
  return [horizontal * Math.cos(lon), radius * Math.sin(lat), -horizontal * Math.sin(lon)];
}
export function tangentEast(longitude) {
  const lon = radians(longitude);
  return [-Math.sin(lon), 0, -Math.cos(lon)];
}
export function tangentNorth(latitude, longitude) {
  const lat = radians(latitude), lon = radians(longitude);
  return [-Math.sin(lat) * Math.cos(lon), Math.cos(lat), Math.sin(lat) * Math.sin(lon)];
}
export function headingVector(latitude, longitude, degrees = 0) {
  const north = tangentNorth(latitude, longitude);
  const east = tangentEast(longitude);
  const heading = radians(degrees);
  return north.map((n, i) => n * Math.cos(heading) + east[i] * Math.sin(heading));
}
export function textureUv(latitude, longitude) {
  return [(wrapLongitude(longitude) + 180) / 360, (latitude + 90) / 180];
}
