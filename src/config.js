export const DRAWER_WIDTH = 350;
export const SM_BREAKPOINT = 600;
export const MINI_SIDE_PANEL_WIDTH = 0;
export const MINI_SIDE_PANEL_DENSE_WIDTH = 0;

export const INITIAL_VIEWPORT = {
  latitude: 41.389044,
  longitude: 2.162161,
  zoom: 13,
  bearing: -45,
  pitch: 0
};

export const MAPSTYLES = [
  {
    'label': 'OSM Bright',
    'thumbnail': 'https://openicgc.github.io/img/osm-bright.png',
    'url': 'https://geoserveis.icgc.cat/contextmaps/osm-bright.json',
    'overlayColor': '#0000aa'
  },
  {
    'label': 'Hibrid',
    'thumbnail': 'https://openicgc.github.io/img/orto.png',
    'url': 'https://geoserveis.icgc.cat/contextmaps/hibrid.json',
    'overlayColor': '#cc00ff'
  },
  {
    'label': 'Positron',
    'thumbnail': 'https://openicgc.github.io/img/positron.png',
    'url': 'https://geoserveis.icgc.cat/contextmaps/positron.json',
    'firstTopLayer': 'place_other'
  },
  {
    'label': 'Full Dark',
    'thumbnail': 'https://openicgc.github.io/img/fulldark.png',
    'url': 'https://geoserveis.icgc.cat/contextmaps/fulldark.json',
    'overlayColor': '#ffff00'
  }
];

export const INITIAL_MAPSTYLE_URL = MAPSTYLES[0].id;

export const ADD_POI_MODE = 'ADD_POI', REMOVE_POI_MODE = 'REMOVE_POI', ADD_FLAT_MODE = 'ADD_FLAT', REMOVE_FLAT_MODE = 'REMOVE_FLAT';
