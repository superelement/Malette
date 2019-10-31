let ev = {};
const listeners = []; // {element,event,callback}

export const Publish = function (topic, args) {
  const subs = ev[topic] || [];
  return subs.map(x => x.apply(this, args || []));
};

export const Subscribe = (topic, cb) => {
  if (!ev[topic]) ev[topic] = [];
  ev[topic].push(cb);
  return [topic, cb];
};

export const Fetch = json =>
  typeof json === 'string' ?
    fetch(json).then(res => res.json())
  : Promise.resolve(json);

export const Node = template => json =>
  json.map(x => {
    const range = document.createRange();
    range.selectNode(document.body);
    const $n = range.createContextualFragment(template(x).trim());
    $n.data = x;
    return $n;
  });

export const Bind = selector => event => callback => xs =>
  xs.forEach(x =>
    [...x.querySelectorAll(selector)]
    .forEach(y => {
      y.addEventListener(event, callback.bind(x));
      listeners.push({element: y, event, callback});
    })
  ) ? xs:xs;

export const RegisterListener = (element, event, callback) => {
  element.addEventListener(event, callback);
  listeners.push({element, event, callback});
};

export const Draw = element => nodes =>
  nodes.forEach(x => element.appendChild(x));

export const CleanUp = () => {
  ev = {};
  listeners.forEach(({element, event, callback}) => {
    element.removeEventListener(event, callback);
  });
};
