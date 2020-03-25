const net = require('net')

const client = net.Socket();

client.connect(8000, '127.0.0.1', function() {
  console.log('connect')

  client.write('message from client')
})

client.on('data', data => {
  console.log(data.toString())
})

client.on('end', function() {
  console.log('data end')
})
