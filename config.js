var config = {
  port: 8071,
  connection: 'close', // keep-alive better for speed, but wrose for code reloading
};
for (i in config) {
  exports[i] = config[i];
}
