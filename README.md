# vite-string-replacement

A Vite plugin for performing string replacements during the build process. Configure it to replace specific strings or patterns in your source files.

## Installation

```bash
npm install vite-string-replacement --save-dev
```

## Usage

Add the plugin to `vite.config.js`:

```js
import viteStringReplacement from 'vite-string-replacement';

export default {
  plugins: [
    viteStringReplacement([
      {
        filter: /\.vue/,
        replace: {
          from: 'foo',
          to: 'bar',
        },
      },
    ]),
  ],
};
```

Or `quasar.config.js`

```js
const viteStringReplacement = require('vite-string-replacement');

module.export = configure(function () {
  vitePlugins: [
    viteStringReplacement(
      [
        {
          filter: /\.vue$|\.js$|\.ts$|\.scss$|.css$/,
          replace: [
            {
              from: /\/?imgs\//gim,
              to: 'https://external-storage.url/imgs/',
            },
            {
              from: /\/?audio\//gim,
              to: 'https://external-storage.url/audio/',
            },
          ],
        },
      ],
      {
        apply: 'build', // "serve" for dev
      },
    ),
  ];
});
```
