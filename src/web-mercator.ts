import type {Projection, LngLat, WorldCoordinates} from '@mappable-world/mappable-types';
import {cycleRestrict, restrict, DEG_TO_RAD, RAD_TO_DEG} from './utils'

/**
 * @class Mercator projection onto a sphere.
 * Used by many mapping services, in particular OpenStreetMap.
 * @name projection.webMercator
 * @augments Projection
 * @static
 * @example
 * ```js
 * const {MMap, MMapTileDataSource, MMapLayer} = mappable;
 * const {WebMercator} = await mappable.import('@mappable-world/mappable-web-mercator-projection');
 *
 * // Create a map in the web Mercator projection
 * const map = new MMap(document.getElementById('map_id'), {
 *     // ...
 *     projection: new WebMercator()
 * });
 *
 * // Add osm tiles
 * const dataSource = new MMapTileDataSource({
 *     id: 'osmSource',
 *     zoomRange: {min: 0, max: 19},
 *     clampMapZoom: true,
 *     raster: {
 *         type: 'ground',
 *         fetchTile: 'https://tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png'
 *     },
 *     copyrights: ['© OpenStreetMap contributors']
 * });
 *
 * const layer = new MMapLayer({
 *     id: 'osm',
 *     source: 'osmSource',
 *     type: 'ground',
 * });
 * ```
 */

export class WebMercator implements Projection {
    private _maxLatitudeRad = Math.atan(Math.sinh(Math.PI));

    toWorldCoordinates(coords: LngLat): WorldCoordinates {
        return {
            x: this._longitudeToWorldX(coords[0]),
            y: this._latitudeToWorldY(coords[1])
        };
    }

    fromWorldCoordinates(world: WorldCoordinates): LngLat {
        return [this._worldXToLongitude(world.x), this._worldYToLatitude(world.y)] as LngLat;
    }

    // For all transformations, we don't need either the radius or the equator, only their ratio, which is always Math.PI
    private _worldXToLongitude(x: number): number {
        return cycleRestrict(x * Math.PI * RAD_TO_DEG, -180, 180);
    }

    private _longitudeToWorldX(lng: number): number {
        return cycleRestrict((lng * DEG_TO_RAD) / Math.PI, -1, 1);
    }

    private _latitudeToWorldY(lat: number): number {
        // We restrict latitude to use it with an aspect ratio of one and prevent Infinity calculations
        const latitude = restrict(lat * DEG_TO_RAD, -this._maxLatitudeRad, this._maxLatitudeRad);
        const tanTemp = Math.tan(Math.PI / 4 + latitude / 2);

        return Math.log(tanTemp) / Math.PI;
    }

    private _worldYToLatitude(y: number): number {
        const merkatorYDivR = -y * Math.PI;
        const latitude = Math.PI / 2 - 2 * Math.atan(Math.exp(merkatorYDivR));

        return restrict(latitude * RAD_TO_DEG, -90, 90);
    }
}
