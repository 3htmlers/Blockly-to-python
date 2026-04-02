const express = require('express');
const os = require('os');
const path = require('path');
const { PORT_DEFAULT, IP_DEFAULT } = require('./config');

const app = express();
const PORT = process.env.PORT || PORT_DEFAULT;
const envHost = process.env.IP;
const detectedHost = getLocalIPAddress();
const bindHost = envHost || IP_DEFAULT;
const logHost = envHost || detectedHost || 'localhost';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, bindHost, () => {
  console.log(`Blockly-to-Python server running at http://${logHost}:${PORT}`);
  if (bindHost === IP_DEFAULT && logHost !== 'localhost') {
    console.log('Also available via http://localhost:' + PORT);
  }
});

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  if (!interfaces) {
    return null;
  }

  for (const interfaceInfo of Object.values(interfaces)) {
    for (const iface of interfaceInfo) {
      const family = typeof iface.family === 'string' ? iface.family : iface.family === 4 ? 'IPv4' : iface.family === 6 ? 'IPv6' : iface.family;
      if (family === 'IPv4' && !iface.internal && iface.address) {
        return iface.address;
      }
    }
  }

  return null;
}
