import PrettyFallCore from './core/PrettyFallCore.js';
import ImageLoader from './ImageLoader.js';

// attach ImageLoader to the core as a static property for compatibility
PrettyFallCore.ImageLoader = ImageLoader;

// keep compatibility: export default and attach to window
if (typeof window !== 'undefined') {
  window.PrettyFall = PrettyFallCore;
  // restore legacy global for backward compatibility
  try {
    // use string key to make the assignment explicit and less likely to be optimized away
    window['ImageLoader'] = PrettyFallCore.ImageLoader || ImageLoader;
  } catch (e) {
    // ignore if window is not writeable in some environments
  }
}

// Named export for ImageLoader (makes it explicit in ESM and UMD named exports)
export { ImageLoader };
export default PrettyFallCore;