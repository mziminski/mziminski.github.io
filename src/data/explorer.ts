/**
 * Sample geometry for the home-page explorer.
 * These coordinates are invented for the demo. They are drawn near Mount Hood
 * so the basemap has terrain, and they are not a trail network or a hazard feed.
 * TODO(matt): replace this file if you want the demo to show a real dataset
 * you have the rights to publish. Keep the "not for travel" labeling if the
 * data can be mistaken for current conditions.
 */

export type TrailStatus = 'open' | 'caution' | 'closed';
export type SmokeDensity = 'light' | 'moderate' | 'heavy';

export type TrailFeature = {
  type: 'Feature';
  id: string;
  properties: {
    id: string;
    name: string;
    kind: 'trail';
    status: TrailStatus;
    note: string;
  };
  geometry: { type: 'LineString'; coordinates: [number, number][] };
};

export type SmokeFeature = {
  type: 'Feature';
  id: string;
  properties: {
    id: string;
    name: string;
    kind: 'smoke';
    density: SmokeDensity;
    note: string;
  };
  geometry: { type: 'Polygon'; coordinates: [number, number][][] };
};

export const trails: { type: 'FeatureCollection'; features: TrailFeature[] } = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'ridge-line',
      properties: {
        id: 'ridge-line',
        name: 'Ridge Line',
        kind: 'trail',
        status: 'open',
        note: 'Drawn north of the sample plumes, so the rule leaves it open.',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-121.8, 45.445],
          [-121.74, 45.438],
          [-121.68, 45.45],
          [-121.6, 45.442],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'river-grade',
      properties: {
        id: 'river-grade',
        name: 'River Grade',
        kind: 'trail',
        status: 'caution',
        note: 'The west half crosses the light plume. The east end is clear. The segment stays caution.',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-121.82, 45.355],
          [-121.76, 45.348],
          [-121.7, 45.338],
          [-121.62, 45.346],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'lookout-spur',
      properties: {
        id: 'lookout-spur',
        name: 'Lookout Spur',
        kind: 'trail',
        status: 'closed',
        note: 'Drawn inside the heavy plume. The rule closes the segment.',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-121.745, 45.4],
          [-121.72, 45.385],
          [-121.7, 45.368],
          [-121.678, 45.352],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'cedar-switch',
      properties: {
        id: 'cedar-switch',
        name: 'Cedar Switch',
        kind: 'trail',
        status: 'open',
        note: 'Drawn west of the sample plumes. No overlap, so the status is open.',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-121.93, 45.4],
          [-121.91, 45.37],
          [-121.9, 45.34],
          [-121.92, 45.31],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'basin-loop',
      properties: {
        id: 'basin-loop',
        name: 'Basin Loop',
        kind: 'trail',
        status: 'caution',
        note: 'Sits in the moderate plume. Caution, not a closure, under the sample thresholds.',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-121.66, 45.4],
          [-121.63, 45.382],
          [-121.605, 45.36],
          [-121.63, 45.342],
          [-121.665, 45.35],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'north-bench',
      properties: {
        id: 'north-bench',
        name: 'North Bench',
        kind: 'trail',
        status: 'closed',
        note: 'A short segment on the north edge of the heavy plume. Closed in this sample.',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-121.78, 45.408],
          [-121.75, 45.4],
          [-121.72, 45.396],
        ],
      },
    },
  ],
};

export const smoke: { type: 'FeatureCollection'; features: SmokeFeature[] } = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'plume-light',
      properties: {
        id: 'plume-light',
        name: 'Light plume',
        kind: 'smoke',
        density: 'light',
        note: 'Sample polygon. It covers the west half of River Grade and nothing else in the list.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-121.84, 45.37],
            [-121.7, 45.372],
            [-121.69, 45.325],
            [-121.845, 45.322],
            [-121.84, 45.37],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'plume-moderate',
      properties: {
        id: 'plume-moderate',
        name: 'Moderate plume',
        kind: 'smoke',
        density: 'moderate',
        note: 'Sample polygon drawn over Basin Loop.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-121.69, 45.415],
            [-121.58, 45.415],
            [-121.58, 45.33],
            [-121.69, 45.33],
            [-121.69, 45.415],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'plume-heavy',
      properties: {
        id: 'plume-heavy',
        name: 'Heavy plume',
        kind: 'smoke',
        density: 'heavy',
        note: 'Sample polygon drawn over Lookout Spur and North Bench.',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-121.8, 45.42],
            [-121.66, 45.41],
            [-121.655, 45.34],
            [-121.74, 45.33],
            [-121.79, 45.36],
            [-121.8, 45.42],
          ],
        ],
      },
    },
  ],
};

export const trailCount = trails.features.length;
export const smokeCount = smoke.features.length;

export const statusLabel: Record<TrailStatus, string> = {
  open: 'Open',
  caution: 'Caution',
  closed: 'Closed',
};

export const densityLabel: Record<SmokeDensity, string> = {
  light: 'Light',
  moderate: 'Moderate',
  heavy: 'Heavy',
};
