import util from 'util';
import { magenta, cyan, red } from 'chalk';
import SerialPort from 'serialport';
import Readline from '@serialport/parser-readline';
import log from './logging'

const assignEventHandlers = (parser) => {
  parser.on('open', () => log(cyan('[Open] Port opened')));
  parser.on('data', (data) => log(cyan('[Data]'), magenta(data.toString('ascii'))));
  parser.on('close', () => log(cyan('[Close] Port closed')));
  parser.on('error', (err) => log(red(`[Error] ${err.message}`)));
};

const createCallbackHandler = (reject, resolve, resolveVal) => (err) => {
  if (err) return reject(err);
  resolve(resolveVal);
};

const setUpConnection = (portPath, options) => {
  const port = new SerialPort(portPath, options);
  const parser = port.pipe(new Readline({ delimiter: '\n' }));
  assignEventHandlers(parser);

  port.write[util.promisify.custom] = (msg) => new Promise((resolve, reject) => port.write(msg, createCallbackHandler(reject, resolve, msg)));
  port.writeAsync = util.promisify(port.write);

  port.open[util.promisify.custom] = () => new Promise((resolve, reject) => port.open(createCallbackHandler(reject, resolve, port)));
  port.openAsync = util.promisify(port.open);

  port.close[util.promisify.custom] = () => new Promise((resolve, reject) => port.close(createCallbackHandler(reject, resolve, port), null));
  port.closeAsync = util.promisify(port.close);

  port.drain[util.promisify.custom] = () => new Promise((resolve, reject) => port.drain(createCallbackHandler(reject, resolve, port)));
  port.drainAsync = util.promisify(port.drain);

  port.flush[util.promisify.custom] = () => new Promise((resolve, reject) => port.flush(createCallbackHandler(reject, resolve, port)));
  port.flushAsync = util.promisify(port.flush);

  return port.openAsync();
};

export default setUpConnection;
