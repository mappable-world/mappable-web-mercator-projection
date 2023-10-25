# @mappable-world/mappable-web-mercator-projection package

Web Mercator projection package for Mappable JS API.

[![npm version](https://badge.fury.io/js/@mappable-world%2Fmappable-web-mercator-projection.svg)](https://badge.fury.io/js/@mappable-world%2Fmappable-web-mercator-projection)
[![npm](https://img.shields.io/npm/dm/@mappable-world/mappable-web-mercator-projection.svg)](https://www.npmjs.com/package/@mappable-world/mappable-web-mercator-projection)
[![Build Status](https://github.com/mappable-world/mappable-web-mercator-projection/workflows/Run%20tests/badge.svg)](https://github.com/mappable-world/mappable-web-mercator-projection/actions/workflows/tests.yml)

![projection scheme](https://github.com/mappable-world/mappable-web-mercator-projection/blob/main/projection_scheme.png?raw=true)

## Install

You can install this package via npm:

```bash
npm install --save @mappable-world/mappable-web-mercator-projection
```

## How use

To use Web Mercator projection, just import it:

```js
import {WebMercator} from '@mappable-world/mappable-web-mercator-projection';

const projection = new WebMercator();

console.log(projection.toWorldCoordinates([-180, 90])) // {x: -1, y: 1}
console.log(projection.toWorldCoordinates([-180, 85.051])) // ~ {x: -1, y: 1}
console.log(projection.toWorldCoordinates([90, 0])) // ~ {x: 0.5, y: 0}
console.log(projection.toWorldCoordinates([0, -23.6])) // ~ {x: 0, y: -0.135}

console.log(projection.fromWorldCoordinates({x: -1, y: 1})) // ~ [-180, 85.051]
console.log(projection.fromWorldCoordinates({x: 0.5, y: 0})) // [90, 0]
console.log(projection.fromWorldCoordinates({x: 0, y: -0.135})) // ~ [0, -23.6]
```

### Usage without npm

You can use some CDN with `mappable.import` JS API module loading handler on your page:

```js
const {WebMercator} = await mappable.import('@mappable-world/mappable-web-mercator-projection');
```

**_NOTE:_**s
By default `mappable.import` can load self modules, scripts or style.
To make the code above work, you should add a loader:

```js
// Add loader at the beginning of the loader queue
mappable.import.loaders.unshift(async (pkg) => {
    // Process only this package
    if (!pkg.includes('@mappable-world/mappable-web-mercator-projection')) return;

    // Load script directly. You can use another CDN
    await mappable.import.script(`https://unpkg.com/${pkg}/dist/index.js`);

    // Return result object
    return window['@mappable-world/mappable-web-mercator-projection'];
});
```
