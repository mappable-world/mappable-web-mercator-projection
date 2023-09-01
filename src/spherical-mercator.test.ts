import type {LngLat} from '@mappable-world/mappable-types';
import * as turf from '@turf/projection';
import {restrict, cycleRestrict, RAD_TO_DEG} from './utils';
import {SphericalMercator} from './spherical-mercator';

describe('sphericalMercator transformations', () => {
    const WORLD_TO_METRIC = 6378137.0 * Math.PI;
    const sphericalMercator = new SphericalMercator();

    const maxLat = Math.atan(Math.sinh(Math.PI)) * RAD_TO_DEG;
    const lngWorld = [
        [-180, -1],
        [-171, -0.95],
        [-162, -0.9],
        [-99, -0.55],
        [-90, -0.5],
        [-81, -0.45],
        [-9, -0.05],
        [0, 0],
        [9, 0.05],
        [81, 0.45],
        [90, 0.5],
        [99, 0.55],
        [162, 0.9],
        [171, 0.95],
        [180, -1]
    ];
    const latWorld = [
        [-90, -1],
        [-maxLat, -1],
        [-66.51326044311185, -0.5],
        [-45, -0.28054992616959007],
        [0, 0],
        [45, 0.28054992616959007],
        [66.51326044311185, 0.5],
        [maxLat, 1],
        [90, 1]
    ];

    it('check toWorldCoordinates', () => {
        lngWorld.map(([lng, worldX]) => {
            latWorld.map(([lat, worldY]) => {
                const world = sphericalMercator.toWorldCoordinates([lng, lat]);
                expect(world.x).toBeCloseTo(worldX, 9);
                expect(world.y).toBeCloseTo(worldY, 9);

                const turfMercator = turf.toMercator([lng, lat]);
                expect(cycleRestrict(turfMercator[0] / WORLD_TO_METRIC, -1, 1)).toBeCloseTo(worldX, 9);
                expect(restrict(turfMercator[1] / WORLD_TO_METRIC, -1, 1)).toBeCloseTo(worldY, 9);
            });
        });
    });

    it('check fromWorldCoordinates', () => {
        lngWorld.map(([lng, worldX]) => {
            latWorld.map(([lat, worldY]) => {
                const lngLat = sphericalMercator.fromWorldCoordinates({x: worldX, y: worldY});
                expect(lngLat[0]).toBeCloseTo(cycleRestrict(lng, -180, 180), 9);
                expect(lngLat[1]).toBeCloseTo(restrict(lat, -maxLat, maxLat), 9);

                const turfLngLat = turf.toWgs84([worldX * WORLD_TO_METRIC, worldY * WORLD_TO_METRIC]);
                expect(turfLngLat[0]).toBeCloseTo(cycleRestrict(lng, -180, 180), 9);
                expect(turfLngLat[1]).toBeCloseTo(restrict(lat, -maxLat, maxLat), 9);
            });
        });
    });

    it('check toWorldCoordinates and fromWorldCoordinates accuracy', () => {
        for (let lng = -190; lng < 190; lng++) {
            for (let lat = -100; lat < 100; lat++) {
                const lngLat: LngLat = [cycleRestrict(lng, -180, 180), restrict(lat, -maxLat, maxLat)];

                const world = sphericalMercator.toWorldCoordinates(lngLat);
                const lngLatAfter = sphericalMercator.fromWorldCoordinates(world);
                expect(lngLat[0]).toBeCloseTo(lngLatAfter[0], 9);
                expect(lngLat[1]).toBeCloseTo(lngLatAfter[1], 9);
            }
        }
    });
});
