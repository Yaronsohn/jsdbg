
const jsdbg = require('../index')

async function sleep(msec) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

/*
 * TimeTracker Tests
 */
async function testTimeTracker() {
  const tracker = new jsdbg.TimeTracker({ suspended: 1 });
  const start = Date.now();

  tracker.resume();
  await sleep(1000);
  tracker.suspend();
  await sleep(1000);
  tracker.suspend();
  await sleep(1000);
  tracker.resume();
  tracker.resume();

  const netTime = tracker.netTime();
  if (netTime < 1000 || netTime >= 1300)
    throw new Error('test failed!');

  console.log(`Net time is: ${tracker} msec`);
}

testTimeTracker();
