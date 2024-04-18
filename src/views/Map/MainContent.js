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
import ModalInfo from '../../components/ModalInfo';
import ModalAddPoint from '../../components/ModalAddPoint';


const toStr = (a) => JSON.stringify(a);

const MainContent = ({mapStyle, mode, routes, directions}) => {
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [highlightDirection, setHighlightDirection] = useState(undefined);
  console.log('routes', routes);
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);

  const handleClose = (event, reason) => {
    // para que no se cierre con click fuera de la modal si esc
    if (reason && (reason === 'backdropClick' || reason === 'escapeKeyDown')) return;
    setOpenModal(false);
  };

  const {t, i18n} = useTranslation();

  const mapRef = useRef();
  const flyTo = bbox => mapRef.current?.fitBounds(bbox, {duration: 1000});
  const handleSearchResult = ({bbox}) => flyTo(bbox);
  const navigate = useNavigate();

  const {points: strPoiPoints, originPoints: strFlatPoints, pointsNames, originPointsNames} = useParams();

  const points = strPoiPoints ? JSON.parse(strPoiPoints) : [];
  const originPoints = strFlatPoints ? JSON.parse(strFlatPoints) : [];

  const [text, setText] = useState(t('point'));

  const initialState = {
    strPoiPoints: strPoiPoints ? JSON.parse(strPoiPoints) : [],
    strFlatPoints: strFlatPoints ? JSON.parse(strFlatPoints) : [],
    pointsNames: pointsNames ? JSON.parse(pointsNames) : [],
    originPointsNames: originPointsNames ? JSON.parse(originPointsNames) : [],
  };
  const [stateUrl, setStateUrl] = useState(initialState);

  useEffect(() => {
    const url = `../map/${toStr(stateUrl.strPoiPoints)}/${toStr(stateUrl.strFlatPoints)}/${toStr(stateUrl.pointsNames)}/${toStr(stateUrl.originPointsNames)}`;
    navigate(url);
  }, [stateUrl]);

  const setPoints = points => {
    if (mode === 'ADD_FLAT' || mode === 'REMOVE_FLAT') {
      setStateUrl({
        ...stateUrl,
        strPoiPoints: points
      });
    }
    if (mode === 'ADD_POI' || mode === 'REMOVE_POI') {
      setStateUrl({
        ...stateUrl,
        strFlatPoints: points
      });
    }
    if (mode === 'ADD_FLAT' || mode === 'ADD_POI') handleOpen();
  };

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

  const [pointBLue,setPointBlue] = useState([]);
  const [pointRed,setPointRed] = useState([]);
  const [nameBlue,setNameBlue] = useState([]);
  const [nameRed,setNameRed] = useState([]);

  console.log('mode',mode);
  const handleClick = e => {
    console.log('eeeee', e);
    if (mode === ADD_POI_MODE) {
      setPointBlue(prevState => [...prevState, {
        'lat': e.lngLat.lat.toFixed(5),
        'lng': e.lngLat.lng.toFixed(5)
      }]);

    } else if (mode === REMOVE_POI_MODE) {
      setPoints(originPoints.filter((p, i) => i !== e.features[0].id));
    } else if (mode === ADD_FLAT_MODE) {
      setPointRed(prevState =>[...prevState,{
        'lat': e.lngLat.lat.toFixed(5),
        'lng': e.lngLat.lng.toFixed(5)
      }]);
    } else if (mode === REMOVE_FLAT_MODE) {
      setPoints(points.filter((p, i) => i !== e.features[0].id));
    }
    handleOpen();

  };

  useEffect(()=>{
    localStorage.setItem('blue',JSON.stringify(pointBLue));
  },[pointBLue]);

  useEffect(()=>{
    localStorage.setItem('red',JSON.stringify(pointRed));
  },[pointRed]);

  useEffect(()=>{
    localStorage.setItem('nameRed',JSON.stringify(nameRed));
  },[nameRed]);

  useEffect(()=>{
    localStorage.setItem('nameBlue',JSON.stringify(nameBlue));
  },[nameBlue]);
  
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
      setStateUrl({
        ...stateUrl,
        originPointsNames: [...stateUrl.originPointsNames, text]
      });
      
      
      setNameBlue(prevState => [
        ...prevState,{
          'name': text
        }]);
       
        
    } else if (mode === 'ADD_FLAT') {
      setStateUrl({
        ...stateUrl,
        pointsNames: [...stateUrl.pointsNames, text]
      });

      setNameRed(prevState => [
        ...prevState,{
          'name': text
        }]);
     
    }
    handleClose();
    setText(t('point'));
  };


  const handleDirectionHighlight = (i) => setHighlightDirection(i);
  console.log('highlightDirection', highlightDirection);
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
      <DirectionsTable directions={directions} onDirectionHighlight={handleDirectionHighlight}/>
    </div>
  </>;
};

MainContent.propTypes = {
  onMapStyleChanged: PropTypes.func,
  mapStyle: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  routes: PropTypes.any,
  directions: PropTypes.array.isRequired
};

export default MainContent;
