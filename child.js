process.on('message', msg => {
  console.log('[Child]', msg);
  process.send(msg + 1);
});