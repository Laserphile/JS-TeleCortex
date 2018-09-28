import util from 'util';
import SerialPort from 'serialport';
import Readline from '@serialport/parser-readline';
import { omit, pick } from 'lodash/object'

const assignEventHandlers = (parser, handlers) => {
  Object.keys(handlers).forEach(
    (key) => {
      parser.on( key, handlers[key])
    }
  );
};

const createCallbackHandler = (reject, resolve, resolveVal) => (err) => {
  if (err) return reject(err);
  resolve(resolveVal);
};

const setUpConnection = (portPath, options, handlers) => {
  const port = new SerialPort(portPath, options);
  const parser = port.pipe(new Readline({ delimiter: '\n' }));
  assignEventHandlers(port, pick(handlers, ['open', 'close', 'error']));
  assignEventHandlers(parser, omit(handlers, ['open', 'close', 'error']));

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
