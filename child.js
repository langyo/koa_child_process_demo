process.on('message', payload => {
  console.log('[Child]', payload);
  process.send(`123321`);
});