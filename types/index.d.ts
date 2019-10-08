interface PackagerInterface {
  name: String;
  pack(payload: Object);
  unpack(packet: Buffer);
}
