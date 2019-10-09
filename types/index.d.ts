interface PackagerInterface {
  name: string;
  pack(payload: Object): string;
  unpack(packet: Buffer): Object;
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
}

interface YarResponse {
  packager: string;
  data: any;
}

interface RequestPayload {
  i: number;
  m: string;
  p: any;
}

interface ReponsePayload {
  i: number;
  s: number;
  r: Object;
  o: string;
  e: string;
}

interface YarPacket {
  id: number;
  protocolVersion?: string;
  magicNumber?: number;
  reserved?: string;
  token?: string;
  provider?: string;
  packager: string;
  body: RequestPayload | ReponsePayload;
  bodyLength?: number;
}
