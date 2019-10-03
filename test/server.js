const http = require('http')

const server = http.createServer((req, res) => {
  req.on('data', chunk => {
    console.log(chunk)
  })

  req.on('end', () => {
    res.end('Hello')
  })
})

server.listen(3000)
