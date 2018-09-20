import { red } from 'chalk';
import setUpConnection from './serial';
import log from './logging';

const test = async () => {
  const portPath = '/dev/tty.usbmodem4058621';
  const options = { autoOpen: false, baudRate: 9600 };

  let port;
  try {
    port = await setUpConnection(portPath, options);
  }
  catch (e) {
    log(red(`Error: ${e}`))
  }

  if(port === undefined) return log(red(`Error: Failed to setup connection`));

  await port.writeAsync('writing a message\n');
  await port.writeAsync('writing a message\n');
};

test();