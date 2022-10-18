import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import Map from '@geomatico/geocomponents/Map';

import {
  ADD_ORIGIN_MODE,
  ADD_POI_MODE,
  INITIAL_VIEWPORT,
  MAPSTYLES,
  REMOVE_ORIGIN_MODE,
  REMOVE_POI_MODE
} from '../../config';
import {useNavigate, useParams} from 'react-router-dom';
import NominatimSearchBox from '@geomatico/geocomponents/NominatimSearchBox';
import {useTranslation} from 'react-i18next';
import DirectionsTable from '../../components/DirectionsTable';
import Box from '@mui/material/Box';

const MainContent = ({mapStyle, mode, routes, directions}) => {

  const {t, i18n} = useTranslation();

  const mapRef = useRef();
  const flyTo = bbox => mapRef.current?.fitBounds(bbox, {duration: 1000});
  const handleSearchResult = ({bbox}) => flyTo(bbox);

  const {points: strPoints, originPoints: strOriginPoints} = useParams();

  const points = strPoints ? JSON.parse(strPoints) : [];
  const originPoints = strOriginPoints ? JSON.parse(strOriginPoints) : [];

  const navigate = useNavigate();

  const setPoints = points => {
    let strPoints = JSON.stringify(points);
    navigate(`../map/${strPoints}/${strOriginPoints || '[]'}`);
  };

  const setOriginPoints = originPoints => {
    let strOriginPoints = JSON.stringify(originPoints);
    navigate(`../map/${strPoints || '[]'}/${strOriginPoints}`);
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

    const centersOrigin = {
      type: 'FeatureCollection',
      features: originPoints.map((p, i) => ({
        type: 'Feature',
        id: i,
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: p
        }
      }))
    };


    return {
      centers: {
        type: 'geojson',
        data: centers
      },
      centersOrigin: {
        type: 'geojson',
        data: centersOrigin
      },
      directions: {
        type: 'geojson',
        data: routes || empty
      },
    };
  }, [points, originPoints]);

  const layers = useMemo(() => {
    return [
      {
        'id': 'directions',
        'type': 'line',
        'source': 'directions',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#888',
          'line-width': 3
        }
      },
      {
        id: 'centers',
        source: 'centers',
        type: 'circle',
        paint: {
          'circle-color': 'red',
          'circle-radius': 10,
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 2
        }
      },
      {
        id: 'centersOrigin',
        source: 'centersOrigin',
        type: 'circle',
        paint: {
          'circle-color': COLOR,
          'circle-radius': 10,
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 2
        }
      },

      {
        'id': 'symbols',
        'type': 'symbol',
        'source': 'directions',
        'layout': {
          'symbol-placement': 'line',
          'text-anchor': 'bottom',

          'text-font': ['Open Sans Regular'],
          'text-field': '{duration}',
          'text-size': 16
        },
        'paint': {
          'text-color': 'red',
        }
      }

    ];
  }, [mapStyle]);

  const handleClick = e => {
    //setPoints
    if (mode === ADD_POI_MODE) {
      setOriginPoints([...originPoints, [+e.lngLat.lng.toFixed(5), +e.lngLat.lat.toFixed(5)]]);
    } else if (mode === REMOVE_POI_MODE) {
      setOriginPoints(originPoints.filter((p, i) => i !== e.features[0].id));
    } else if (mode === ADD_ORIGIN_MODE) {
      setPoints([...points, [+e.lngLat.lng.toFixed(5), +e.lngLat.lat.toFixed(5)]]);
    } else if (mode === REMOVE_ORIGIN_MODE) {
      setPoints(originPoints.filter((p, i) => i !== e.features[0].id));
    }
  };

  const [cursor, setCursor] = useState('pointer');

  useEffect(() => {
    setCursor(mode === ADD_POI_MODE ? 'pointer' : 'auto');
  }, [mode]);

  const onMouseEnter = useCallback(() => {
    setCursor('no-drop');
    console.log('entra');
  }, []);
  const onMouseLeave = useCallback(() => setCursor('auto'), []);


  // habilita capas segun el modo seleccionado
  const calculateInteractiveLayers = () => {
    if (mode === REMOVE_POI_MODE) {
      return ['centersOrigin'];
    } else if (mode === REMOVE_ORIGIN_MODE) {
      return ['centers'];
    } else {
      return undefined;
    }
  };

  return <>
    <Map
      ref={mapRef}
      mapStyle={mapStyle}
      viewport={viewport}
      sources={sources}
      layers={layers}
      onViewportChange={setViewport}
      interactiveLayerIds={calculateInteractiveLayers()}
      cursor={cursor}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
    />
    <Box sx={{
      position: 'absolute',
      top: 18,
      left: 18,
      width: 250
    }}>
      <NominatimSearchBox
        placeholder={t('search')}
        country='ES'
        lang={i18n.language}
        onResultClick={handleSearchResult}/>
    </Box>
    <div style={{
      position: 'absolute',
      bottom: 18,
      right: 18,
      background: 'white'
    }}>
      <DirectionsTable directions={directions}/>
    </div>
  </>;
};

MainContent.propTypes = {
  onMapStyleChanged: PropTypes.func,
  mapStyle: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  routes: PropTypes.any,
  directions: PropTypes.array.isRequired,

};

export default MainContent;
