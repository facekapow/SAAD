const { createServer } = require('http');
const { createReadStream } = require('fs');
const { join } = require('path');

const port = 80;
const indexHTML = join(__dirname, 'web', 'index.html');
const indexCSS = join(__dirname, 'web', 'index.css');
const indexJS = join(__dirname, 'js-out', 'index.js');
const requireJS = join(__dirname, 'deps', 'requirejs', 'require.js');

const server = createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html' || req.url === '/callback') {
    res.statusCode = 200;
    createReadStream(indexHTML).pipe(res);
  } else if (req.url === '/index.css') {
    res.statusCode = 200;
    createReadStream(indexCSS).pipe(res);
  } else if (req.url === '/index.js') {
    res.statusCode = 200;
    createReadStream(indexJS).pipe(res);
  } else if (req.url === '/require.js') {
    res.statusCode = 200;
    createReadStream(requireJS).pipe(res);
  } else {
    res.statusCode = 404;
    res.end('Not found.');
  }
});

server.listen(port, () => {
  console.log('Listening on port ' + port);
});
