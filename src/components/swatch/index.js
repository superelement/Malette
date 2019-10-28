import { Subscribe, Fetch, Node, Draw, Publish } from '../../xs';
import './style.scss';

export default () => {
  const $swatch = document.createElement('swatch-');
  const maxColorCount = 2;
  const useSVG = !!document.getElementById('malette-icons');
  let touchDownX;

  const removeColor = e => {
    $swatch.removeChild(e.target);
    e.target.removeEventListener('animationend', removeColor);
  };

  $swatch.addEventListener('click', (e) => {
    if (e.target.classList.contains('cross-btn') || e.target.closest('.cross-btn')) {
      const root = e.target.closest('color-');
      const hexValue = root.querySelector('hex-').textContent.trim().replace('#', '');
      root.classList.add('remove');
      root.addEventListener('animationend', removeColor);
      Publish('color/deselected', [hexValue]);
    }
  });

  $swatch.addEventListener('touchstart', (e) => {
    touchDownX = e.touches[0].clientX;
  });

  $swatch.addEventListener('touchmove', (e) => {
    const movement = Math.abs(touchDownX - e.touches[0].clientX);
    if(movement > 30) {
      if(touchDownX > e.touches[0].clientX) $swatch.classList.add('open');
      if(touchDownX < e.touches[0].clientX) $swatch.classList.remove('open');
    }
  });

  $swatch.addEventListener('mouseenter', () => {
    $swatch.classList.add('open');
  });

  $swatch.addEventListener('mouseleave', (e) => {
    const $elem = e.toElement || e.relatedTarget;
    if($elem && $elem.nodeName !== 'DOWNLOAD-') {
      $swatch.classList.remove('open');
    }
  });

  Subscribe('color/hovered', (color) => {
    if ($swatch.children.length == 0) {
      $swatch.style.backgroundColor = `#${color.hex}`;
    }
  });

  Subscribe('color/picked', (color) => {
    const colors = [...$swatch.querySelectorAll('color-')];
    const exists = colors.find(x =>
      x.querySelector('hex-').textContent === `#${color.hex}`
    );
    
    if(!exists && colors.length < maxColorCount) {
      Publish('color/selected', [color]);

      Fetch([color])
      .then(Node(({base, shade, hex, text}) => `
        <color- ${text} style='background-color:#${hex}'>
          <name->${base.replace(' ','-')}-${shade}</name->
          <hex->#${hex}</hex->
          <button type="button" class="cross-btn ${useSVG ? 'is-svg' : ''}">
            ${
              useSVG ?
                '<svg viewBox="0 0 10 10" class="cross-icon-svg"><use href="#cross" ></svg>' : 
                '<span class="mdi mdi-close cross-icon"></span>'
            }
          </button>
        </color->
      `))
      .then(Draw($swatch));
    }
  });

  return $swatch;
};
