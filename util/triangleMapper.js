import { flattenDeep } from 'lodash/array';
import { round } from 'lodash/math';

const calcShift = (maxLeds, currentLeds) => (maxLeds - currentLeds) / 2;

const calcXCoordinate = (rowNum, array, index) => rowNum + calcShift(array[0], array[index]);

const calcYCoordinate = (index) => index;

const calcCoordinate = (rowNum, array, index) => [calcXCoordinate(rowNum, array, index), calcYCoordinate(index)];

const createRowArray = (ledsPerRow, index, array) => Array.from( { length: ledsPerRow }, (_, rowNum) => calcCoordinate(rowNum, array, index));

const isEven = (number) => number % 2 === 0;

const ledNum = (rowIndex, row, index, initialVal) => (isEven(rowIndex) ? row.length - index -1 : index) + initialVal;

const rowWithNumbering = (rowIndex, initialVal) => (coordinate, index, row) => [coordinate, ledNum(rowIndex, row, index, initialVal)];

const numberLedArray = () => {
  let count = 1;
  return (row, rowIndex) => {
    const newRow = row.map(rowWithNumbering(rowIndex, count));
    count += row.length;
    return newRow;
  };
};

const normalize = (val, min, max) => round((val - min) / (max - min), 4);

const normalizeRowArray = () => {
  let flatArray;
  let min;
  let max;
  return (row, _, array) => {
    if(flatArray === undefined) {
      flatArray = flattenDeep(array);
      min = Math.min(...flatArray);
      max = Math.max(...flatArray);
    }
    return row.map((coordinates) => [normalize(coordinates[0], min, max), normalize(coordinates[1], min, max)])
  };
};

const triangleMapper = (layout) => layout.reverse().map(createRowArray).map(normalizeRowArray()).reverse().map(numberLedArray());

export default triangleMapper;