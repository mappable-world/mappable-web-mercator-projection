mappable.import.loaders.unshift(async (pkg) => {
    if (!pkg.includes('@mappable-world/mappable-web-mercator-projection')) {
        return;
    }

    if (location.href.includes('localhost')) {
        await mappable.import.script(`/dist/index.js`);
    } else {
        await mappable.import.script(`https://unpkg.com/${pkg}/dist/index.js`);
    }

    Object.assign(mappable, window[`${pkg}`]);
    return window[`${pkg}`];
})


const BOUNDS = [
    [54.58311, 25.99850],
    [56.30248, 24.47889]
];

/* eslint-disable @typescript-eslint/no-unused-vars */
const LOCATION = {bounds: BOUNDS};
const SOURCE = {
    id: 'osmSource',
    zoomRange: {min: 0, max: 19},
    clampMapZoom: true,
    raster: {
        type: 'ground',
        fetchTile: 'https://tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png'
    },
    copyrights: ['© OpenStreetMap contributors']
};
const LAYER = {
    id: 'osm',
    source: 'osmSource',
    type: 'ground',
};
const MARKER = {title: 'Burj Khalifa', coordinates: [55.274243, 25.197300]};
