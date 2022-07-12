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

const MainContent = ({
                       mapStyle,
                       mode
                     }) => {
  const {
          t,
          i18n
        } = useTranslation();

  const mapRef = useRef();
  const flyTo = bbox => mapRef.current?.fitBounds(bbox, {duration: 1000});
  const handleSearchResult = ({bbox}) => flyTo(bbox);

  const {
          points: strPoints,
          originPoints: strOriginPoints
        } = useParams();

  const points = strPoints ? JSON.parse(strPoints) : [];
  const originPoints = strOriginPoints ? JSON.parse(strOriginPoints) : [];


  const navigate = useNavigate();

  const setPoints = points => {
    let strPoints = JSON.stringify(points);
    navigate(`../map/${strPoints}/${strOriginPoints}`);
  };

  const setOriginPoints = originPoints => {
    let strOriginPoints = JSON.stringify(originPoints);
    navigate(`../map/${strPoints}/${strOriginPoints}`);
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
    };
  }, [points, originPoints]);

  const layers = useMemo(() => {
    return [

      {
        id: 'centers',
        source: 'centers',
        type: 'circle',
        paint: {
          'circle-color': COLOR,
          'circle-radius': 15,
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 2
        }
      },
      {
        id: 'centersOrigin',
        source: 'centersOrigin',
        type: 'circle',
        paint: {
          'circle-color': 'red',
          'circle-radius': 15,
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 2
        }
      }
    ];
  }, [mapStyle]);

  const handleClick = e => {

    if (mode === ADD_POI_MODE) {

      setPoints([...points, [+e.lngLat.lng.toFixed(5), +e.lngLat.lat.toFixed(5)]]);
    } else if (mode === REMOVE_POI_MODE) {
      // TODO remove clicked element
      console.log('remove', e.features);
      setPoints(points.filter((p, i) => i !== e.features[0].id));
    } else if (mode === ADD_ORIGIN_MODE) {
      console.log('aqui', originPoints)
      setOriginPoints([...originPoints, [+e.lngLat.lng.toFixed(5), +e.lngLat.lat.toFixed(5)]]);

    } else if (mode === REMOVE_ORIGIN_MODE) {
      console.log('remove point red');
      setOriginPoints(originPoints.filter((p, i) => i !== e.features[0].id));
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
    <div style={{
      position: 'absolute',
      top: 18,
      left: 18,
      width: 250
    }}>
      <NominatimSearchBox placeholder={t('search')} country='ES' lang={i18n.language}
                          onResultClick={handleSearchResult}/>
    </div>
  </>;
};

MainContent.propTypes = {
  mapStyle: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired
};

export default MainContent;
