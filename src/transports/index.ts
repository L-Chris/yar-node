import { HttpTransport } from './http.transport';
import { SocketTransport } from './socket.transport';

const httpTransport = new HttpTransport();
const socketTransport = new SocketTransport();

function getTransport(protocol: string) {
  switch (protocol) {
    case 'http:':
      return httpTransport;
    case 'tcp:':
    case 'unix:':
      return socketTransport;
    default:
      throw new Error('unsupported transport');
  }
}

export {
  getTransport,
};
