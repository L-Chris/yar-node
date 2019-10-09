const noop = () => {
  return;
};

const MAX_PACKET_ID = Math.pow(2, 30);

let id = 0;

const nextId = () => {
  id += 1;
  if (id >= MAX_PACKET_ID) {
    id = 1;
  }
  return id;
};

export {
  noop,
  id,
  nextId,
};
