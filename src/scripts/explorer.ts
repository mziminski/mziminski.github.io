import { LngLatBounds, Map, NavigationControl, Popup, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { smoke, trails } from '../data/explorer';

export type ExplorerFilters = {
  trails: boolean;
  smoke: boolean;
  statuses: string[];
  reduceMotion?: boolean;
};

type ExplorerApi = {
  applyFilters: (filters: ExplorerFilters) => void;
  focus: (id: string, reduceMotion: boolean) => void;
};

// Classic .js name so GitHub Pages sends a JavaScript MIME type. Copied in prebuild.
setWorkerUrl('/maplibre-gl-worker.js');

const STYLES = {
  light: 'https://tiles.openfreemap.org/styles/positron',
  dark: 'https://tiles.openfreemap.org/styles/dark',
} as const;

const TRAIL_LAYERS: { id: string; status: string; color: string; dash?: number[] }[] = [
  { id: 'trails-open', status: 'open', color: '#0072B2' },
  { id: 'trails-caution', status: 'caution', color: '#E69F00', dash: [2, 1.15] },
  { id: 'trails-closed', status: 'closed', color: '#D55E00', dash: [0.4, 0.85] },
];

function themeName() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function addOverlays(map: Map) {
  if (map.getSource('trails')) return;
  map.addSource('trails', { type: 'geojson', data: trails });
  map.addSource('smoke', { type: 'geojson', data: smoke });

  map.addLayer({
    id: 'smoke-fill',
    type: 'fill',
    source: 'smoke',
    paint: {
      'fill-color': [
        'match',
        ['get', 'density'],
        'light',
        '#56B4E9',
        'moderate',
        '#E69F00',
        'heavy',
        '#CC79A7',
        '#56B4E9',
      ],
      'fill-opacity': 0.33,
    },
  });
  map.addLayer({
    id: 'smoke-line',
    type: 'line',
    source: 'smoke',
    paint: {
      'line-color': themeName() === 'dark' ? '#f3efe6' : '#1a1714',
      'line-width': 1.25,
      'line-dasharray': [2, 1],
    },
  });

  for (const spec of TRAIL_LAYERS) {
    map.addLayer({
      id: spec.id,
      type: 'line',
      source: 'trails',
      filter: ['==', ['get', 'status'], spec.status],
      layout: { 'line-cap': 'butt', 'line-join': 'round' },
      paint: {
        'line-color': spec.color,
        'line-width': 4,
        ...(spec.dash ? { 'line-dasharray': spec.dash } : {}),
      },
    });
  }

  map.addLayer({
    id: 'trail-casing',
    type: 'line',
    source: 'trails',
    filter: ['==', ['get', 'id'], ''],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': themeName() === 'dark' ? '#f3efe6' : '#1a1714',
      'line-width': 9,
      'line-opacity': 0.35,
    },
  });

  map.addLayer({
    id: 'labels',
    type: 'symbol',
    source: 'trails',
    layout: {
      'text-field': ['get', 'name'],
      'text-font': ['Noto Sans Regular'],
      'text-size': 13,
      'symbol-placement': 'line',
      'text-offset': [0, 0.9],
    },
    paint: {
      'text-color': themeName() === 'dark' ? '#f3efe6' : '#1a1714',
      'text-halo-color': themeName() === 'dark' ? '#12110f' : '#f3efe4',
      'text-halo-width': 1.4,
    },
  });

  for (const spec of TRAIL_LAYERS) {
    map.on('click', spec.id, (event) => {
      const feature = event.features?.[0];
      const props = feature?.properties;
      if (!props || !event.lngLat) return;
      const root = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = String(props.name ?? 'Trail');
      const meta = document.createElement('div');
      meta.textContent = `Trail · ${String(props.status ?? '')}`;
      root.append(title, meta);
      new Popup({ offset: 12, focusAfterOpen: false }).setLngLat(event.lngLat).setDOMContent(root).addTo(map);
    });
    map.on('mouseenter', spec.id, () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', spec.id, () => {
      map.getCanvas().style.cursor = '';
    });
  }
}

function applyFilters(map: Map, filters: ExplorerFilters) {
  const smokeVisibility = filters.smoke ? 'visible' : 'none';
  for (const id of ['smoke-fill', 'smoke-line']) {
    if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', smokeVisibility);
  }
  for (const spec of TRAIL_LAYERS) {
    if (!map.getLayer(spec.id)) continue;
    const visible = filters.trails && filters.statuses.includes(spec.status);
    map.setLayoutProperty(spec.id, 'visibility', visible ? 'visible' : 'none');
  }
  if (map.getLayer('labels')) {
    map.setLayoutProperty('labels', 'visibility', filters.trails ? 'visible' : 'none');
  }
}

function focusFeature(map: Map, id: string, reduceMotion: boolean) {
  const trail = trails.features.find((feature) => feature.id === id);
  const plume = smoke.features.find((feature) => feature.id === id);
  const bounds = new LngLatBounds();
  const coordinates = trail
    ? trail.geometry.coordinates
    : plume
      ? plume.geometry.coordinates[0]
      : [];
  for (const coordinate of coordinates) bounds.extend(coordinate);
  if (bounds.isEmpty()) return;
  if (map.getLayer('trail-casing')) {
    map.setFilter('trail-casing', ['==', ['get', 'id'], trail ? id : '']);
  }
  map.fitBounds(bounds, { padding: 56, duration: reduceMotion ? 0 : 700, maxZoom: 12.5 });
}

export function mountExplorer(filters: ExplorerFilters) {
  const container = document.querySelector<HTMLElement>('#map');
  if (!container) throw new Error('Map container missing');

  const map = new Map({
    container,
    style: STYLES[themeName()],
    center: [-121.75, 45.38],
    zoom: 9,
    canvasContextAttributes: { preserveDrawingBuffer: true },
    fadeDuration: filters.reduceMotion ? 0 : 250,
    cooperativeGestures: true,
    maxPitch: 0,
  });

  map.addControl(new NavigationControl({ showCompass: false, visualizePitch: false }), 'top-right');
  map.getCanvas().setAttribute('aria-label', 'Sample map of made-up trails and smoke plumes near a real basemap. Not for travel.');

  const ready = new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error('Basemap style failed to load')), 12000);
    map.on('load', () => {
      window.clearTimeout(timer);
      addOverlays(map);
      applyFilters(map, filters);
      const bounds = new LngLatBounds();
      for (const feature of trails.features) {
        for (const coordinate of feature.geometry.coordinates) bounds.extend(coordinate);
      }
      map.fitBounds(bounds, { padding: 36, duration: 0 });
      resolve();
    });
  });

  const api: ExplorerApi = {
    applyFilters(next) {
      if (map.isStyleLoaded()) applyFilters(map, next);
    },
    focus(id, reduceMotion) {
      if (map.isStyleLoaded()) focusFeature(map, id, reduceMotion);
    },
  };
  window.__mzExplorer = api;

  const observer = new MutationObserver(() => {
    const nextStyle = STYLES[themeName()];
    map.setStyle(nextStyle);
    map.once('style.load', () => {
      addOverlays(map);
      applyFilters(map, {
        trails: overlayChecked('trails'),
        smoke: overlayChecked('smoke'),
        statuses: [...document.querySelectorAll<HTMLInputElement>('input[name="status"]:checked')].map((input) => input.value),
      });
    });
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  return ready;
}

function overlayChecked(name: string) {
  return document.querySelector<HTMLInputElement>(`input[name="overlay"][value="${name}"]`)?.checked ?? true;
}
