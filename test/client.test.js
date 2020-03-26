const { YarClient } = require('../dist');

const client = new YarClient('http://127.0.0.1:3000');

client.call('hello', { name: 'Chris' }).then(res => {
  console.log(`reponse:${res}`);
});
