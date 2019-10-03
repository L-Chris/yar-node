const { Packager } = require('./packagers/packager')

class YarRequest {
  constructor(id, method, params = {}, options = {}) {
    this.id = id
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
