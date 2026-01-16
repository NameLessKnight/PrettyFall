import React, { useEffect, useRef } from 'react';
import PrettyFall from '../../PrettyFall.js';

export default function PrettyFallReact({ items = [], options = {} }) {
  const containerRef = useRef(null);
  const idRef = useRef('prettyfall-' + Math.random().toString(36).slice(2, 9));

  useEffect(() => {
    const containerId = '#' + idRef.current;
    const selector = containerId + ' ' + (options.itemsSelector || '.grid-item');
    const pf = new PrettyFall(Object.assign({}, options, {
      container: containerId,
      itemsSelector: selector,
      isFluid: options.isFluid !== undefined ? options.isFluid : true
    }));

    if (items && items.length) {
      setTimeout(() => {
        items.forEach(itemData => pf.append(itemData));
      }, 0);
    }

    pf.initialize();

    return () => {
      try {
        window.removeEventListener('resize', pf.resizeHandler);
      } catch (e) {}
    };
  }, [items]);

  return (
    <div id={idRef.current} ref={containerRef} className={options.wrapperClass || 'grid-wrapper'} />
  );
}
