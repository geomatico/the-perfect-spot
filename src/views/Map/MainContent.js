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
import NominatimSearchBox from '@geomatico/geocomponents/NominatimSearchBox';
import {useTranslation} from 'react-i18next';
import DirectionsTable from '../../components/DirectionsTable';
import Box from '@mui/material/Box';
import ModalInfo from '../../components/ModalInfo';
import ModalAddPoint from '../../components/ModalAddPoint';



const MainContent = ({mapStyle, mode, routes, calculatedRoutes, onChangePoints}) => {
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [openModal, setOpenModal] = useState(false);
  const [allPoints,setAllPoints] = useState(localStorage.getItem('ThePerfectSpot') ? JSON.parse(localStorage.getItem('ThePerfectSpot')):{red: [], blue: []});

  const handleOpen = () => setOpenModal(true);
  const handleClose = (event, reason) => {
    // para que no se cierre con click fuera de la modal si esc
    if (reason && (reason === 'backdropClick' || reason === 'escapeKeyDown')){
      if (mode === ADD_POI_MODE) {
        const bluePoints = [...allPoints.blue];
        bluePoints.pop();
        setAllPoints(prevState =>({
          ...prevState ,blue: bluePoints
        }));

      }else if(mode === ADD_FLAT_MODE){
        const redPoints = [...allPoints.red];
        redPoints.pop();
        setAllPoints(prevState =>({
          ...prevState ,red: redPoints
        }));
      }
    }
    setOpenModal(false);
  };

  const {t, i18n} = useTranslation();

  const mapRef = useRef();
  const flyTo = bbox => mapRef.current?.fitBounds(bbox, {duration: 1000});
  const handleSearchResult = ({bbox}) => flyTo(bbox);

  const [text, setText] = useState(t('point'));

  const COLOR = MAPSTYLES.find(ms => ms.id === mapStyle)?.overlayColor;

  const sources = useMemo(() => {

    const empty = {
      type: 'FeatureCollection',
      features:[]
    };
    const centers = {
      type: 'FeatureCollection',
      features: allPoints.red?.map(({lng,lat}, index) => ({
        type: 'Feature',
        id: index,
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [lng,lat]
        }
      }))
    };

    const centersOrigin = {
      type: 'FeatureCollection',
      features: allPoints.blue?.map(({lng,lat}, index) => ({
        type: 'Feature',
        id: index,
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [lng,lat]
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
  }, [allPoints,routes,calculatedRoutes]);
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
     
      setAllPoints(prevState => ({
        ...prevState,
        blue: prevState.blue === undefined
          ? [{ lng: +e.lngLat.lng.toFixed(5), lat: +e.lngLat.lat.toFixed(5) }]
          : [ ...prevState.blue,
            { lng: +e.lngLat.lng.toFixed(5), lat: +e.lngLat.lat.toFixed(5) }
          ]
      }));
      
      handleOpen();
    } else if (mode === REMOVE_POI_MODE) {
      
      setAllPoints(prevState => ({
        ...prevState, blue : prevState.blue.filter((p, i) => i !== e.features[0].id)
      }));

    } else if (mode === ADD_FLAT_MODE) {
      setAllPoints(prevState => ({
        ...prevState,
        red: prevState.red === undefined
          ? [{ lng: +e.lngLat.lng.toFixed(5), lat: +e.lngLat.lat.toFixed(5) }]
          : [
            ...prevState.red,
            { lng: +e.lngLat.lng.toFixed(5), lat: +e.lngLat.lat.toFixed(5) }
          ]
      }));
      handleOpen();

    } else if (mode === REMOVE_FLAT_MODE) {
      setAllPoints(prevState => ({
        ...prevState, red: prevState.red.filter((p, i) => i !== e.features[0].id)
      }));
    }
  };
 
  useEffect(()=>{
    localStorage.setItem('ThePerfectSpot',JSON.stringify(allPoints));
    onChangePoints(allPoints);
  },[allPoints]);
  
  const [cursor, setCursor] = useState('pointer');

  useEffect(() => {
    setCursor(mode === ADD_POI_MODE ? 'pointer' : 'auto');
  }, [mode]);

  const onMouseEnter = useCallback(() => {
    setCursor('no-drop');
  }, []);
  const onMouseLeave = useCallback(() => setCursor('auto'), []);

  // habilita/deshabilita capas segun el modo seleccionado
  const calculateInteractiveLayers = () => {
    if (mode === REMOVE_POI_MODE) {
      return ['centersOrigin'];
    } else if (mode === REMOVE_FLAT_MODE) {
      return ['centers'];
    } else {
      return undefined;
    }
  };

  const handleChangeText = (x) => {
    setText(x);
  };

  const handleSaveName = () => {
    if(text === '')  return;
    if (mode === 'ADD_POI') {
    
    
      const lastBluePoint = allPoints.blue[allPoints.blue.length - 1];
     
      const updatebluePoints = allPoints.blue.map(point =>{
        if (point === lastBluePoint) {
          return {
            ...point,
            name:text
          };
        }
        return point;
      });
      setAllPoints(prevState =>({
        ...prevState,blue:updatebluePoints
      }));

    } else if (mode === 'ADD_FLAT') {
      
      const lastRedPoint = allPoints.red[allPoints.red.length -1];
      const updateRedPoint = allPoints.red.map(point=>{
        if (point === lastRedPoint) {
          return {
            ...point,
            name:text
          };
        }
        return point;
      });
      setAllPoints(prevState =>({
        ...prevState,red:updateRedPoint
      }));
    }
    handleClose();
    setText(t('point'));
  };


  return <>
    <ModalInfo/>
    {openModal && <ModalAddPoint 
      pointType={mode}
      pointName={text}
      onChangePointName={handleChangeText}
      onSavePointName={handleSaveName}
      onClose={handleClose}
    />
    }
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
      <DirectionsTable calculatedRoutes={calculatedRoutes} allPoints={allPoints}/>
    </div>
  </>;
};

MainContent.propTypes = {
  onMapStyleChanged: PropTypes.func,
  mapStyle: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  routes: PropTypes.any,
  calculatedRoutes: PropTypes.array.isRequired,
  onChangePoints: PropTypes.func.isRequired
};

export default MainContent;
