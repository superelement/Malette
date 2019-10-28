import './main.scss';
import 'whatwg-fetch';

// import { Publish } from './xs';
// import Clipboard from 'clipboard';

import ColorList from './components/colors';
import Swatch from './components/swatch';
import { Subscribe } from './xs';
// import Download from './components/download';
// import Toast from './components/toast';
// import Favicon from './components/favicon';

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw.js');
// }

window.malette = window.malette || {};
window.malette.init = ((id = 'color-picker', colorsPerRow = 4, colorChangedHandler, skipCrossIcon) => {
  // const $body = document.body;
  // const $head = document.head;
  const $target = document.getElementById(id);

  if ($target) {


    if (!skipCrossIcon) {
      /**
       * Add icons
       */
      const svgs = document.createElement('svg');
      svgs.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svgs.setAttribute('id', 'malette-icons');
      // cross icon
      svgs.innerHTML = '<polygon id="cross" points="10 0.311667602 9.68882237 0 5 4.68851057 0.31148943 0 0 0.311667602 4.68851057 5.00013363 0 9.6886442 0.31148943 10.0004454 5 5.31131126 9.68882237 10.0004454 10 9.6886442 5.31148943 5.00013363"></polygon>';
      $target.appendChild(svgs);
    }

    const $container = document.createElement('div');
    $container.classList.add('malette-cont');
    $target.appendChild($container);
    
    // $head.appendChild(Favicon());
    $container.appendChild(ColorList(colorsPerRow));
    $container.appendChild(Swatch());
    // $body.appendChild(Download());
    // $body.appendChild(Toast());

    if (colorChangedHandler) {
      let colors = [];
      Subscribe('color/selected', (clr) => {
        colors.push(clr);
        colorChangedHandler(colors, clr);
      });

      Subscribe('color/deselected', (hex) => {
        const clr = colors.find(c => c.hex === hex);
        colors = colors.filter(c => c.hex !== hex);
        colorChangedHandler(colors, clr);
      });
    }
  }
  // const clipboard = new Clipboard('hex-', {
  //   text: (trigger) => trigger.textContent,
  // });

  // clipboard.on('success', e =>
  //   Publish('hex/copied', [e.text])
  // );
});

