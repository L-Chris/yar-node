const { Packager } = require('./packagers/packager')

class YarRequest {
  constructor(method, params = {}, options = {}) {
    this.id = Math.floor(Math.random() * 10e6)
    this.method = method

    this.parameters = params
    this.options = options
  }

  static pack(request) {
    const packagerName = request.options.packager
    const req = {
      i: request.id,
      m: request.method,
      p: request.parameters
    }

    const payload = Packager.pack(packagerName, req)

    return payload
  }

  static unpack() {}
}

exports.YarRequest = YarRequest
