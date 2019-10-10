declare module 'php-serialize' {
  export function serialize(obj: object): any;
  export function unserialize(buf: Buffer): any;
}
