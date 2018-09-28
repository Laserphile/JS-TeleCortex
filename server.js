import chalk from 'chalk';
import setUpConnection from './serial';
import log from './logging';

const tags = {
  open: (string) => chalk`{cyan.bold [Open]:} {green ${string}}`,
  close: (string) => chalk`{cyan.bold [Close]:} {red ${string}}`,
  data: (string) => chalk`{cyan.bold [Data]:} {magenta ${string}}`,
  error: (string) => chalk`{red.bold [Error]:} ${string}`,
};

const handlers = {
  open: () => log(tags.open('Port opened')),
  close: () => log(tags.close('Port closed')),
  data: (data) => log(tags.data(data.toString())),
  error: (err) => log(tags.error(err.message)),
};

const sleep = (millis) => new Promise(resolve => setTimeout(resolve, millis));

const test = async () => {
  const portPath = '/dev/tty.usbmodem4058620';
  const options = { autoOpen: false, baudRate: 9600 };

  let port;
  try {
    port = await setUpConnection(portPath, options, handlers);
  }
  catch (e) {
    log(tags.error(e));
  }

  if (port === undefined) return log(tags.error('Failed to setup connection'));

  await port.writeAsync('Writing a message\n');
  await port.writeAsync('Writing a message\n');

  const oneMinute = 1000 * 60;
  const halfHour = oneMinute * 30;
  setTimeout(() => port.close(), halfHour);

  while(port.isOpen) {
    await sleep(oneMinute);
    await port.writeAsync('Idling\n');
  }
};

test();