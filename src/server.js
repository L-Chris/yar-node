const http = require('http')
const protocol = require('./protocol')

class YarServer {
  constructor(port, methods) {
    this.port = port
    this.methods = methods

    this.init()
  }

  init() {
    const server = http.createServer((req, res) => {
      let buf = Buffer.alloc(0)

      req.on('data', chunk => {
        buf = Buffer.concat([buf, chunk])
      })

      req.on('end', () => {
        if (!buf || !buf.length) return
        const reqData = protocol.unpack(buf)
        const data = this.methods[reqData.payload.m](reqData.payload.p)
        const payload = {
          i: Math.floor(Math.random() * 10e6),
          r: data
        }

        const packet = protocol.pack(payload.i, undefined, undefined, payload)

        res.write(packet)
        res.end()
      })
    })

    this.server = server

    this.server.on('listening', () => {
      console.log(`listening on http://127.0.0.1:${this.port}`)
    })

    this.server.listen(this.port)
  }
}

exports.YarServer = YarServer
