import http from './http';

const ors_api = 'https://api.openrouteservice.org/v2/matrix/';

export const ors_modes = {
  'foot-walking': 'foot-walking',
  'cycling-regular': 'cycling-regular',
  'driving-car': 'driving-car',
  'driving-hgv':'driving-hgv'
};

const getRange =(start, end)=> {
  return Array(end - start + 1).fill().map((_, idx) => start + idx);
};

const compute_ors_params = (locations, destinations) => {
  const allLocations = locations.concat(destinations);

  return {
    'locations': allLocations,
    'destinations': getRange(locations.length, allLocations.length -1),
    'metrics': ['distance', 'duration'],
    'resolve_locations': 'true',
    'sources': getRange(0, locations.length - 1),
    'units': 'm'
  };
};

export const getInfo = (
  locations,
  destinations,
  transportation,
  {url = ors_api, mode = ors_modes[transportation]} = {}
) => http.post(url + mode, compute_ors_params(locations, destinations)).then(featureCollection => featureCollection);


export const getDirections = (
  locations,
  destinations,
  transportation
) => {
  const ors_geometries = `https://api.openrouteservice.org/v2/directions/${transportation}/geojson`;
  return http.post(ors_geometries , {coordinates: [...locations, ...destinations] }).then(featureCollection => featureCollection);
};
