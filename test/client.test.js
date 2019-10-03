const { YarClient } = require('../src')

const client = new YarClient('http://127.0.0.1:3000')

client.call('hello', { name: 'Chris' }, res => {
  console.log(`reponse:${res}`)
})
