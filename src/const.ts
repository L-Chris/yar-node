const HEADER_LEN = 82;
const PACKAGER_NAME_LEN = 8;
const PHP_YAR_VERSION = '0.0.8';

const YAR_CLIENT_PROTOCOL = {
  TCP: 'tcp:',
  UNIX: 'unix:',
  HTTP: 'http:',
}

const YAR_PACKAGER = {
  PHP: 'php',
  JSON: 'json',
  MSGPACK: 'msgpack'
}

export {
  HEADER_LEN,
  PACKAGER_NAME_LEN,
  YAR_CLIENT_PROTOCOL,
  YAR_PACKAGER,
  PHP_YAR_VERSION
};
