import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import Map from '@geomatico/geocomponents/Map';

import {
  ADD_FLAT_MODE,
  ADD_POI_MODE,
  INITIAL_VIEWPORT,
  MAPSTYLES,
  REMOVE_FLAT_MODE,
  REMOVE_POI_MODE
} from '../../config';
import {useNavigate, useParams} from 'react-router-dom';
import NominatimSearchBox from '@geomatico/geocomponents/NominatimSearchBox';
import {useTranslation} from 'react-i18next';
import DirectionsTable from '../../components/DirectionsTable';
import Box from '@mui/material/Box';
import {Modal, TextField} from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const MainContent = ({mapStyle, mode, routes, directions}) => {

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {t, i18n} = useTranslation();

  const mapRef = useRef();
  const flyTo = bbox => mapRef.current?.fitBounds(bbox, {duration: 1000});
  const handleSearchResult = ({bbox}) => flyTo(bbox);

  const {points: strPoiPoints, originPoints: strFlatPoints} = useParams();

  const points = strPoiPoints ? JSON.parse(strPoiPoints) : [];
  const originPoints = strFlatPoints ? JSON.parse(strFlatPoints) : [];

  const navigate = useNavigate();

  const setPoints = points => {
    let strPoiPoints = JSON.stringify(points);
    navigate(`../map/${strPoiPoints}/${strFlatPoints || '[]'}`);
    handleOpen();

  };

  const setOriginPoints = originPoints => {
    let strFlatPoints = JSON.stringify(originPoints);
    navigate(`../map/${strPoiPoints || '[]'}/${strFlatPoints}`);
    handleOpen();
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
    if (mode === ADD_POI_MODE) {
      setOriginPoints([...originPoints, [+e.lngLat.lng.toFixed(5), +e.lngLat.lat.toFixed(5)]]);
    } else if (mode === REMOVE_POI_MODE) {
      setOriginPoints(originPoints.filter((p, i) => i !== e.features[0].id));
    } else if (mode === ADD_FLAT_MODE) {
      setPoints([...points, [+e.lngLat.lng.toFixed(5), +e.lngLat.lat.toFixed(5)]]);
    } else if (mode === REMOVE_FLAT_MODE) {
      console.log('entra');
      setPoints(points.filter((p, i) => i !== e.features[0].id));
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
    } else if (mode === REMOVE_FLAT_MODE) {
      return ['centers'];
    } else {
      return undefined;
    }
  };

  return <>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Text in a modal
        </Typography>
        <TextField value={'aaaaaa'} id="outlined-basic" label="Outlined" variant="outlined"/>

        <Button onClick={handleClose}>Insertar nombre</Button>

      </Box>
    </Modal>
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
