import { JSONPackager } from './json.packager';
import { PhpPackager } from './php.packager';
// import { MsgpackPackager } from './msgpack.packager';

const packagers = [
  new JSONPackager(),
  new PhpPackager(),
  // new MsgpackPackager()
];

function getPackager(type: string) {
  const packager = packagers.find(_ => _.type === type);

  if (!packager) {
    throw new Error('unsupported packager');
  }

  return packager;
}

export {
  getPackager,
};
