import * as http from 'http';

class HttpTransport implements YarTransport {
  connection: http.ClientRequest;
  constructor() {
    this.init();
  }

  init(options = {}) {
    this.connection = http.request(options);
  }
}

export {
  HttpTransport,
};
