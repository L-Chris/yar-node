const http = require('http')
const { Packager } = require('./packagers/packager')
const protocol = require('./protocol')
const { HEADER_LEN, PACKAGER_NAME_LEN } = require('./const')

class YarServer {
  constructor(port, methods, options) {
    this.port = port
    this.methods = methods
    this.options = options
    this.init()
  }

  init() {
    const server = http.createServer((req, res) => {
      let reqHeader

      req.on('readable', () => {
        if (!reqHeader) {
          reqHeader = req.read(82)
        }
        if (!reqHeader) return
        const parsedReqHeader = protocol.parse(reqHeader)

        const reqBody = req.read(parsedReqHeader.bodyLength)

        if (!reqBody) return

        const HEADER_AND_PACKAGER_NAME_LEN = HEADER_LEN + PACKAGER_NAME_LEN

        const packagerNameBuf = reqBody.slice(0, PACKAGER_NAME_LEN)
        const packagerName = packagerNameBuf.toString('utf-8').trim().replace(/\0/g, '')
        const packager = Packager.get(packagerName)

        const reqPayload = packager.unpack(reqBody.slice(PACKAGER_NAME_LEN, reqBody.length))

        const result = this.methods[reqPayload.m](reqPayload.p)
        const payload = {
          i: Math.floor(Math.random() * 10e6),
          s: 0,
          r: result,
          o: '',
          e: ''
        }

        const body = Buffer.from(packager.pack(payload))
        const packetLength = HEADER_AND_PACKAGER_NAME_LEN + body.length
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
