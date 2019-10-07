const { YarServer } = require('../src')

const server = new YarServer({
  hello(params) {
    return `Hello world! ${params.name}`
  }
})

server.handle()
