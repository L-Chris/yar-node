const http = require('http')
const { URL } = require('url')

const request = (address, data, callback, header = {}) => {
  const urlOptions = new URL(address)

  const options = {
    hostname: urlOptions.hostname,
    port: urlOptions.port,
    path: urlOptions.pathname,
    protocol: urlOptions.protocol,
    method: 'POST'
  }

  options['headers'] = {
    'Content-Type': 'application/octet-stream'
  }

  if (options.protocol !== 'http:') throw new Error('UnSupported protocol error')

  // const buf = Buffer.alloc(1000)

  http.request(options, res => {
    res.on('data', chunk => {
      console.log(typeof chunk)
    })

    res.on('end', () => {
      console.log('end')
    })
  })
}

module.exports = {
  request
}
