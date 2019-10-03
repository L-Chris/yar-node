const http = require('http')
const { Packager } = require('./packagers/packager')
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
        // const reqHeader = protocol.parse(buf)
        const packagerName = buf.toString('utf-8', 82, 90).trim().replace(/\0/g, '')
        const packager = new Packager(packagerName)

        const reqBody = buf.slice(90)
        const reqPayload = packager.unpack(reqBody)

        const result = this.methods[reqPayload.m](reqPayload.p)
        const payload = {
          i: Math.floor(Math.random() * 10e6),
          s: 0,
          r: result,
          o: '',
          e: ''
        }

        const packagerNameBuf = buf.slice(82, 90)
        const body = Buffer.from(packager.pack(payload))
        const packetLength = 82 + packagerNameBuf.length + body.length
        const header = protocol.render(payload.i, undefined, undefined, packetLength)

        const packet = Buffer.concat([header, packagerNameBuf, body], packetLength)
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
