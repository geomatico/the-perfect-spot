import React from 'react';
import MapIcon from '@mui/icons-material/Map';
import TableChartIcon from '@mui/icons-material/TableChart';

export const DRAWER_WIDTH = 300;
export const SM_BREAKPOINT = 600;
export const MINI_SIDE_PANEL_WIDTH = 0;
export const MINI_SIDE_PANEL_DENSE_WIDTH = 0;

export const MINISIDEPANEL_CONFIG = [
  {id: 'mapView', route: '../map', label: 'map', content: <MapIcon/>},
  {id: 'detail', route: '../detail', label: 'detail', content: <TableChartIcon/>}
];

export const INITIAL_VIEWPORT = {
  latitude: 41.9453,
  longitude: 2.259,
  zoom: 9.5,
  bearing: 0,
  pitch: 0
};

export const MAPSTYLES = [
  {
    'label': 'image',
    'thumbnail': 'https://openicgc.github.io/img/orto.png',
    'id': 'https://geoserveis.icgc.cat/contextmaps/hibrid.json',
    'firstTopLayer': 'place-other',
    'overlayColor': '#cc00ff'
  },
  {
    'label': 'map',
    'thumbnail': 'https://openicgc.github.io/img/osm-bright.png',
    'id': 'https://geoserveis.icgc.cat/contextmaps/osm-bright.json',
    'firstTopLayer': 'place-other',
    'overlayColor': '#0000aa'
  },
  {
    'label': 'dark',
    'thumbnail': 'https://openicgc.github.io/img/fulldark.png',
    'id': 'https://geoserveis.icgc.cat/contextmaps/fulldark.json',
    'firstTopLayer': 'place-other',
    'overlayColor': '#ffff00'
  }
];

export const INITIAL_MAPSTYLE_URL = MAPSTYLES[1].id;

export const ADD_MODE = 'ADD', REMOVE_MODE = 'REMOVE', ADD_ORIGIN = 'ADD_ORIGIN', REMOVE_ORIGIN = 'REMOVE_ORIGIN';