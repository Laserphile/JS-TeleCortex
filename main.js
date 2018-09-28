import log from './util/logging';
import { halfHour } from './util/time';
import Server from './server';
import serverConfig from './config/server'

const test = async () => {
  const server = new Server(serverConfig);

  const port = await server.openPort();
  if (port === undefined) return log(tags.error('Failed to setup connection'));

  await port.writeAsync('Writing a message\n');
  await port.writeAsync('Writing a message\n');

  setTimeout(() => port.close(), halfHour);
  await server.idle(port);
};

test();