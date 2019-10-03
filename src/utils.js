const { YAR_ERR } = require('./const')

function triggerError(throwException, code, format) {
  if (throwException) {
    let ce
    switch (code) {
      case YAR_ERR.PACKAGER:
        ce = 'yar_client_packager_exception_ce'
        break
      case YAR_ERR.PROTOCOL:
        ce = 'yar_client_protocol_exception_ce'
      case YAR_ERR.TRANSPORT:
        ce = 'yar_client_transport_exception_ce'
      case YAR_ERR.REQUEST:
      case YAR_ERR.EXCEPTION:
        ce = 'yar_client_exception_ce'
      default:
        ce = 'yar_client_exception_ce'
        break
    }
    throw new Error(ce, message, code)
  } else {
    console.warn(`[${code}] ${message}`)
  }
}

function Magic(target) {
  const __get = target.__get
  const __set = target.__get
  const __call = target.__call

  const proxy = new Proxy(target, {
    get(target, key) {
      if (key in target) return target[key]

      __get && __get.call(target, key)
      if (__call) return function() {
        return __call.apply(target, [key, ...arguments])
      }
    },
    set(target, key, value) {
      if (key in target) {
        target[key] = value
        return
      }

      __set && __set.call(target, key, value)
    }
  })

  return proxy
}

const toString = Object.prototype.toString

function isType(name) {
  return function (obj) {
    return toString.call(obj) === '[object ' + name + ']'
  }
}

exports.isNumber = isType('Number')
exports.isFuntion = isType('Function')
exports.isString = isType('String')
exports.isBoolean = isType('Boolean')
exports.Magic = Magic
exports.triggerError = triggerError
