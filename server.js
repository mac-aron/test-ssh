// Import required modules
const fs  = require('fs');
const path = require('path');
const server = require('http').createServer(onRequest);
const io = require('socket.io')(server);

// Preload static files to be served later
const staticFiles = {};
let basePath = path.join(require.resolve('xterm'), '..');
staticFiles['/xterm.css'] = fs.readFileSync(path.join(basePath, '../css/xterm.css'));
staticFiles['/xterm.js'] = fs.readFileSync(path.join(basePath, 'xterm.js'));
basePath = path.join(require.resolve('xterm-addon-fit'), '..');
staticFiles['/xterm-addon-fit.js'] = fs.readFileSync(path.join(basePath, 'xterm-addon-fit.js'));
staticFiles['/'] = fs.readFileSync('index.html');

// onRequest: Handles incoming requests and serves preloaded static files
function onRequest(req, res) {
  let file;
  // Respond with the requested file if it exists and method is GET
  if (req.method === 'GET' && (file = staticFiles[req.url])) {
    res.writeHead(200, {
      'Content-Type': 'text/'
        + (/css$/.test(req.url)
        ? 'css'
        : (/js$/.test(req.url) ? 'javascript' : 'html'))
    });
    return res.end(file);
  }
  // Respond with a 404 error if the requested file doesn't exist
  res.writeHead(404);
  res.end();
}

// Import SSH2 client module
const SSHClient = require('ssh2').Client;

// Define configuration for the SSH client
const configuration = {
    host: "ec2-13-53-193-244.eu-north-1.compute.amazonaws.com",
    username: "ubuntu",
    privateKey: fs.readFileSync("./lab_key.pem")
  };

// Listen for new connections
io.on('connection', function(socket) {
  // Create new SSH client for each new connection
  const conn = new SSHClient();
  
  // Set up event handlers for the SSH client
  conn.on('ready', function() {
    socket.emit('data', '\r\n*** SSH CONNECTION ESTABLISHED ***\r\n\n');
    conn.shell(function(err, stream) {
      if (err)
        return socket.emit('data', '\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');
      socket.on('data', function(data) {
        stream.write(data);
      });
      stream.on('data', function(d) {
        socket.emit('data', d.toString('binary'));
      }).on('close', function() {
        conn.end();
      });
    });
  }).on('close', function() {
    socket.emit('data', '\r\n*** SSH CONNECTION CLOSED ***\r\n');
  }).on('error', function(err) {
    socket.emit('data', '\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n');
  }).connect(configuration);
});

// Define server port
let port = 8000;

// Log the listening port
console.log('Listening on port', port)

// Start the server
server.listen(port);
