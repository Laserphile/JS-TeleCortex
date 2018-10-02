import fs from 'fs'
import triangleMapper from '../util/triangleMapper';

const distanceBetweenLed = 62.5;

const aTriangleLayout = [
  1,
  1,
  3,
  3,
  5,
  7,
  9,
  9,
  11,
  13,
  13,
  15,
  17,
  17,
  19,
  21,
  21,
  23,
  25,
  27
];

const bTriangleLayout = [
  1,
  1,
  3,
  5,
  5,
  9,
  9,
  11,
  13,
  13,
  15,
  15,
  17,
  17,
  19,
  21,
  21,
  22,
  25,
  25,
  27,
  27
];

const output = {
  aTriangle : triangleMapper(aTriangleLayout, distanceBetweenLed),
  bTriangle : triangleMapper(bTriangleLayout, distanceBetweenLed),
};
fs.writeFileSync('./triangles.json', JSON.stringify(output) , 'utf-8');