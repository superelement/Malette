import { Fetch, Node, Bind, Draw, Publish } from '../../xs';
import './style.scss';

// {
//   "base": "Red",
//   "shade": "50",
//   "hex": "fde0dc",
//   "text": "dark-text"
// }

const action = {
  picked() {
    // if (e.target.nodeName !== 'HEX-') {
    Publish('color/picked', [this.data]);
      // ga('send', 'event', 'color', 'picked', `${this.data.base.replace(' ','-')}-${this.data.shade}`);
    // }
  },
  hovered() { Publish('color/hovered', [this.data]); },
};

export default (colorsPerRow) => {
  const $colors = document.createElement('colors-');

  Fetch('colors.json')
  .then(Node(({base, shade, hex, text}) => `
    <color- ${text} style='background-color:#${hex}; max-width: ${100 / colorsPerRow}%'>
      <div>
        <name->${base.replace(' ','-')}-${shade}</name->
        <hex->#${hex}</hex->
      <div>
    </color->
  `))
  .then(Bind('color-')('click')(action.picked))
  .then(Bind('color-')('mouseenter')(action.hovered))
  .then(Draw($colors));

  return $colors;
};
