const { URL } = require('url')
const { Transport } = require('./transports/transport')
const { isString, isBoolean, Magic } = require('./utils')
const { YAR_CLIENT_PROTOCOL } = require('./const')

class Client {
  constructor(uri, options = {}) {
    this._uri = uri
    this._options = options
    this._method = ''

    const uriOptions = new URL(uri)

    switch (uriOptions.protocol) {
      case 'http:':
      case 'https:':
        this._protocol = YAR_CLIENT_PROTOCOL.HTTP
      case 'tcp:':
        this._protocol = YAR_CLIENT_PROTOCOL.TCP
        break
      case 'unix:':
        this._protocol = YAR_CLIENT_PROTOCOL.UNIX
        break
      default:
        console.warn(`unsupported protocol ${uriOptions.protocol}`)
    }
  }

  __call(method, params) {
    if (!method) return

    if (![YAR_CLIENT_PROTOCOL.HTTP, YAR_CLIENT_PROTOCOL.TCP, YAR_CLIENT_PROTOCOL.UNIX].includes(this._protocol)) {
      console.warn(`unsupported protocol ${this._protocol}`)
      return
    }

    let transport

    if (this._protocol === YAR_CLIENT_PROTOCOL.HTTP) {
      transport = new Transport('curl')
    } else if ([YAR_CLIENT_PROTOCOL.TCP, YAR_CLIENT_PROTOCOL.UNIX].includes(this._protocol)) {
      transport = new Transport('sock')
    } else {
      throw new Error('unsupported Trasnport')
    }

    transport.send()
    transport.exec()

    return false
  }

  setOpt(type, value) {
    switch (type) {
      case 'packager':
        if (!isString(value)) throw new Error('expects a string packager name')
        if (!['json', 'php', 'msgpack'].includes(value)) throw new Error('unsupported packager')
        this._options[type] = value
        break
      case 'persistent':
        if (!isBoolean(value)) throw new Error('expects a boolean persistent flag')
        this._options[type] = value
        break
      case 'headers':
        if (this._protocol !== YAR_CLIENT_PROTOCOL.HTTP) throw new Error('header only works with HTTP protocol')
        this._options[type] = value
        break
      case 'timeout':
      case 'connectTimeout':
        if (!Number.isInteger(value)) throw new Error('expects a long integer timeout value')
        this._options[type] = value
      default:
    }
  }
}

class YarClient {
  constructor(uri, options = {}) {
    const target = new Client(uri, options)

    return Magic(target)
  }
}

exports.YarClient = YarClient
