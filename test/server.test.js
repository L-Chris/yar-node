const { YarServer } = require('../src')

const server = new YarServer(3000, {
  hello(params) {
    return `Hello world! ${params.name}`
  }
})
