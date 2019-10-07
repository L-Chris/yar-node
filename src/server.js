const http = require('http')
const { ProtocolDecoder } = require('./decoder')
const { ProtocolEncoder } = require('./encoder')

class YarServer {
  constructor(methods) {
    this.methods = methods
    this.port = 3000
  }

  handle() {
    const server = http.createServer((req, res) => {
      const protocolEncoder = new ProtocolEncoder()
      const protocolDecoder = new ProtocolDecoder()

      req.pipe(protocolDecoder)

      protocolEncoder.pipe(res)

      protocolDecoder.on('request', obj => {
        const {
          m: methodName,
          p: args
        } = obj.body

        const data = this.methods[methodName](args)
        protocolEncoder.writeResponse(obj, {
          packager: obj.packagerName,
          data
        })

        res.end()
      })
    })

    server.on('listening', () => {
      console.log(`listening on http://127.0.0.1:${this.port}`)
    })

    server.listen(this.port)

    this.server = server
  }
}

exports.YarServer = YarServer
