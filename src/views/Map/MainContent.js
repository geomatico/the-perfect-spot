import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';

import turfCircle from '@turf/circle';
import turfDissolve from '@turf/dissolve';
import Map from '@geomatico/geocomponents/Map';

import {ADD_POI_MODE, ADD_ORIGIN_MODE, INITIAL_VIEWPORT, MAPSTYLES, REMOVE_POI_MODE, REMOVE_ORIGIN_MODE} from '../../config';
import {useNavigate, useParams} from 'react-router-dom';
import NominatimSearchBox from '@geomatico/geocomponents/NominatimSearchBox';
import {useTranslation} from 'react-i18next';

const MainContent = ({mapStyle, mode}) => {
  const {t, i18n} = useTranslation();

  const mapRef = useRef();
  const flyTo = bbox => mapRef.current?.fitBounds(bbox, {duration: 1000});
  const handleSearchResult = ({bbox}) => flyTo(bbox);

  const {
    points: strPoints
  } = useParams();

  const points = strPoints ? JSON.parse(strPoints) : [];

  const navigate = useNavigate();
  const setPoints = points => {
    let strPoints = JSON.stringify(points);
    navigate(`../map/${strPoints}`);
  };

  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);

  const COLOR = MAPSTYLES.find(ms => ms.id === mapStyle)?.overlayColor;

  const sources = useMemo(() => {

    const empty = {
      type: 'FeatureCollection',
      features: []
    };

    const centers = {
      type: 'FeatureCollection',
      features: points.map((p, i) => ({
        type: 'Feature',
        id: i,
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: p
        }
      }))
    };

    const circles500 = {
      type: 'FeatureCollection',
      features: points.map(p => turfCircle(p, 0.5, {units: 'kilometers'}))
    };

    const circles2k = {
      type: 'FeatureCollection',
      features: points.map(p => turfCircle(p, 2.0, {units: 'kilometers'}))
    };

    return {
      centers: {
        type: 'geojson',
        data: centers
      },
      circles500: {
        type: 'geojson',
        data: circles500
      },
      area500: {
        type: 'geojson',
        data: points.length ? turfDissolve(circles500) : empty
      },
      circles2k: {
        type: 'geojson',
        data: circles2k
      },
      area2k: {
        type: 'geojson',
        data: points.length ? turfDissolve(circles2k) : empty
      }
    };
  }, [points]);

  const layers = useMemo(() => {
    return [{
      id: 'area2k',
      source: 'area2k',
      type: 'fill',
      paint: {
        'fill-color': COLOR,
        'fill-opacity': 0.1
      }
    }, {
      id: 'area500',
      source: 'area500',
      type: 'fill',
      paint: {
        'fill-color': COLOR,
        'fill-opacity': 0.3
      }
    }, {
      id: 'circles2k',
      source: 'circles2k',
      type: 'line',
      paint: {
        'line-width': 1,
        'line-opacity': 0.5,
        'line-color': COLOR,
        'line-dasharray': [4, 4]
      }
    }, {
      id: 'circles500',
      source: 'circles500',
      type: 'line',
      paint: {
        'line-width': 1,
        'line-opacity': 0.5,
        'line-color': COLOR
      }
    }, {
      id: 'contour2k',
      source: 'area2k',
      type: 'line',
      paint: {
        'line-width': 1,
        'line-opacity': 1,
        'line-color': COLOR,
        'line-dasharray': [4, 4]
      }
    }, {
      id: 'contour500',
      source: 'area500',
      type: 'line',
      paint: {
        'line-width': 1.5,
        'line-opacity': 1,
        'line-color': COLOR
      }
    }, {
      id: 'labels2k',
      source: 'area2k',
      type: 'symbol',
      minzoom: 12,
      layout: {
        'symbol-placement': 'line',
        'text-font': ['Open Sans Regular'],
        'text-field': '2 km',
        'text-size': 12,
        'text-offset': [0, 0.5]
      },
      paint: {
        'text-color': COLOR
      }
    }, {
      id: 'labels500',
      source: 'area500',
      type: 'symbol',
      minzoom: 12,
      layout: {
        'symbol-placement': 'line',
        'text-font': ['Open Sans Regular'],
        'text-field': '500 m',
        'text-size': 12,
        'text-offset': [0, 0.5]
      },
      paint: {
        'text-color': COLOR
      }
    }, {
      id: 'centers',
      source: 'centers',
      type: 'circle',
      paint: {
        'circle-color': COLOR,
        'circle-radius': 5,
        'circle-stroke-color': '#FFFFFF',
        'circle-stroke-width': 2
      }
    }];
  }, [mapStyle]);

  const handleClick = e => {
    if (mode === ADD_POI_MODE) {
      setPoints([...points, [+e.lngLat.lng.toFixed(5), +e.lngLat.lat.toFixed(5)]]);
    } else if (mode === REMOVE_POI_MODE) {
      // TODO remove clicked element
      console.log('remove', e.features);
      setPoints(points.filter((p, i) => i !== e.features[0].id));
    }
  };

  const [cursor, setCursor] = useState('pointer');

  useEffect(() => {
    setCursor(mode === ADD_POI_MODE ? 'pointer' : 'auto');
  }, [mode]);

  const onMouseEnter = useCallback(() => setCursor('no-drop'), []);
  const onMouseLeave = useCallback(() => setCursor('auto'), []);

  return <>
    <Map
      ref={mapRef}
      mapStyle={mapStyle}
      viewport={viewport}
      sources={sources}
      layers={layers}
      onViewportChange={setViewport}
      interactiveLayerIds={mode === REMOVE_POI_MODE ? ['centers'] : undefined}
      cursor={cursor}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
    />
    <div style={{position: 'absolute', top: 18, left: 18, width: 250}}>
      <NominatimSearchBox placeholder={t('search')} country='ES' lang={i18n.language} onResultClick={handleSearchResult}/>
    </div>
  </>;
};

MainContent.propTypes = {
  mapStyle: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired
};

export default MainContent;
