const http = require('http')
const { URL } = require('url')

const urlOptions = new URL('http://localhost:3000')

const options = {
  protocol: urlOptions.protocol,
  host: urlOptions.hostname,
  port: urlOptions.port,
  path: urlOptions.pathname,
  headers: {
    'Content-Type': 'application/octet-stream',
    'Transfer-Encoding': 'chunked',
    'Connection': 'keep-alive'
  }
}

console.log(urlOptions)

http.get(options, res => {
  res.on('data', chunk => {
    const buf = Buffer.from(chunk)
    console.log(buf.toString())
  })
  res.on('end', () => {
    console.log('end')
  })
})
