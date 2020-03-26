import { JSONPackager } from './json.packager';
import { PhpPackager } from './php.packager';

const packagers = [
  new JSONPackager(),
  new PhpPackager()
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
