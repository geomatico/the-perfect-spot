import http from './http';

const ors_api = 'https://api.openrouteservice.org/v2/matrix/';
export const ors_modes = {
  'foot-walking': 'foot-walking',
  'cycling-regular': 'cycling-regular',
  'driving-car': 'driving-car'
};

const compute_ors_params = () => (
  {
    "locations": [[9.70093, 48.477473], [9.207916, 49.153868], [37.573242, 55.801281], [115.663757, 38.106467]],
    "destinations": [0, 1],
    "metrics": ["distance", "duration"],
    "resolve_locations": "true",
    "sources": [2, 3],
    "units": "km"
  }
);

//fixme cambiar nombre
export const getIsochrones = (
 /* lat,
  lon,
  {
    range = 900,
    interval = 300,
    url = ors_api,
    mode = ors_modes['foot-walking']
  } = {}*/
) =>
  http.post(ors_api + ors_modes['driving-car'], compute_ors_params())
    .then(featureCollection => featureCollection);


