const { JSONPackager } = require('./json.packager')
const { PhpPackager } = require('./php.packager')
const { MsgpackPackager } = require('./msgpack.packager')

class Packager {
  constructor() {
    this.packagers = [new JSONPackager(), new PhpPackager(), new MsgpackPackager()]
  }

  get(type) {
    const packager = this.packagers.find(_ => _.name === type)

    if (!packager) console.warn('unsupported packager')

    return packager
  }
}

exports.Packager = new Packager()
