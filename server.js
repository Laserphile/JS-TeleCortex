import chalk from 'chalk';
import { defaultsDeep, pick } from 'lodash/object';

import setUpConnection from './serial';
import log from './util/logging';
import {oneMinute} from './util/time';

const tags = {
  open: (string) => chalk`{cyan.bold [Open]:} {green ${string}}`,
  close: (string) => chalk`{cyan.bold [Close]:} {red ${string}}`,
  data: (string) => chalk`{cyan.bold [Data]:} {magenta ${string}}`,
  error: (string) => chalk`{red.bold [Error]:} ${string}`,
  info: (string) => chalk`{yellow.bold [Info]:} {cyan ${string}}`,
};

const sleep = (millis) => new Promise(resolve => setTimeout(resolve, millis));
``
class Server {
  static defaultConfig = {
    portPath: '',
    setUpConnection: setUpConnection,
    connectionOptions: {
      autoOpen: false,
      baudRate: 9600,
    },
    handlers: {
      open: () => log(tags.open('Port opened')),
      close: () => log(tags.close('Port closed')),
      data: (data) => log(tags.data(data.toString())),
      error: (err) => log(tags.error(err.message)),
    }
  };

  constructor(config) {
    const acceptedConfig = pick(config, ['portPath', 'connectionOptions']);
    this.config = {};
    Object.assign(this.config, acceptedConfig);
    defaultsDeep(this.config, Server.defaultConfig);
  }

  async openPort() {
    let retryCount = 10;
    let port;
    while (port === undefined && retryCount > 0) {
      try {
        port = await this.connect();
      }
      catch (e) {
        log(tags.error(e));
        retryCount--;
        log(tags.info('Failed to open port retrying in 1 minute'));
        await sleep(oneMinute);
      }
    }
    return port;
  }

  async connect() {
    const { portPath, connectionOptions, handlers } = this.config;
    this.port = await setUpConnection(portPath, connectionOptions, handlers);
    return this.port;
  }

  async idle() {
    if (this.port === undefined ) throw 'Cannot idle; port is not open';
    while (this.port.isOpen) {
      await sleep(oneMinute);
      await port.writeAsync('Idling\n');
    }
  }
}

export default Server;