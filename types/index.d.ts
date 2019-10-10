interface YarPackager {
  type: string;
  pack(payload: object): string;
  unpack(packet: Buffer): object;
}

interface YarTransport {
  connection: any;
  init: () => void;
}

interface Packet {
  packetId: number;
  packetType: 'request' | 'response';
  req: any;
  res?: any;
}

interface YarRequest {
  id: number;
  packager: string;
  methodName: string;
  args: any;
  timeout: number;
  token?: string;
  provider?: string;
}

interface YarResponse {
  token?: string;
  provider?: string;
  packager: string;
  status?: number;
  data: any;
}

interface RequestBody {
  i: number;
  m: string;
  p: any;
}

interface ReponseBody {
  i: number;
  s: number;
  r: object;
  o: string;
  e: string;
}

interface YarPacket {
  id: number;
  protocolVersion?: number;
  magicNumber?: number;
  reserved?: number;
  token?: string;
  provider?: string;
  packager: string;
  body: any;
  bodyLength?: number;
}

interface YarRequestPacket extends YarPacket {
  body: RequestBody;
}

interface YarResponsePacket extends YarPacket {
  body: ReponseBody;
}


