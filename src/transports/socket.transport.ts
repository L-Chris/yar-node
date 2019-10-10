class SocketTransport implements YarTransport {
  connection: any;
  constructor() {
    this.init();
  }

  init() {
    this.connection = {};
  }
}

export {
  SocketTransport,
};
