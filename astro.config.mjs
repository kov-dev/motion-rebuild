import { defineConfig } from 'astro/config';

// src/motion.js and src/sphere.js import their libraries by pinned jsDelivr URLs, so the same files also run
// unbundled (the Webflow staging copy loads them straight from the repository). Here those URLs are mapped to the
// npm packages of the same versions, and the build ships one bundle with no third-party CDN at run time.
const CDN = /^https:\/\/cdn\.jsdelivr\.net\/npm\/((?:@[^/]+\/)?[^@/]+)@[^/]+(\/.*?)?\/\+esm$/;

const cdnToNpm = () => ({
  name: 'cdn-to-npm',
  enforce: 'pre',
  resolveId(source, importer, options) {
    const m = source.match(CDN);
    if (!m) return null;
    return this.resolve(m[1] + (m[2] || ''), importer, { ...options, skipSelf: true });
  },
});

export default defineConfig({
  site: 'https://motion.zajno.com',
  // The page is one long document: keep the markup as written, the host compresses it.
  compressHTML: true,
  build: { assets: '_astro' },
  vite: { plugins: [cdnToNpm()] },
});
