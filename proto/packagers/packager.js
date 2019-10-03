const { JSONPackager } = require('./json.packager')
const { PhpPackager } = require('./php.packager')
const { MsgpackPackager } = require('./msgpack.packager')

class Packager {
  constructor(type) {
    switch (type) {
      case 'json':
        return new JSONPackager()
      case 'msgpack':
        return new MsgpackPackager()
      case 'php':
        return new PhpPackager()
      default:
        throw new Error('unsupported packger type')
    }
  }

  static pack(type, req) {
    const packager = new Packager(type)

    const packet = packager.pack(req)

    return packet
  }
}

exports.Packager = Packager
