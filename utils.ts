export function randomHSL(
  minSat = 50,
  maxSat = 100,
  minLum = 50,
  maxLum = 100
) {
  const hue = Math.floor(Math.random() * 360);
  const sat = Math.floor(Math.random() * (maxSat - minSat) + minSat);
  const lum = Math.floor(Math.random() * (maxLum - minLum) + minLum);

  return {
    hue,
    sat,
    lum,
  };
}
