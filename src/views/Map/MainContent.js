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
  const [allPointers,setAllPointers] = useState({red: undefined, blue: undefined});
  const [highlightDirection, setHighlightDirection] = useState(undefined);
  console.log('routes', routes);
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);

  const handleClose = (event, reason) => {
    // para que no se cierre con click fuera de la modal si esc
    if (reason && (reason === 'backdropClick' || reason === 'escapeKeyDown')){
      if (mode === ADD_POI_MODE) {
        const bluePoints = [...allPointers.blue];
        bluePoints.pop();
        setAllPointers(prevState =>({
          ...prevState ,blue: bluePoints
        }));

      }else if(mode === ADD_FLAT_MODE){
        const redPoints = [...allPointers.red];
        redPoints.pop();
        setAllPointers(prevState =>({
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
    console.log('allPointers',allPointers);
    const centers = {
      type: 'FeatureCollection',
      features: allPointers.blue?.map((p, i) => ({
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
      features: allPointers.red?.map((p, i) => ({
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
  }, [allPointers, originPoints]);

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
      setPoints([...originPoints, [+e.lngLat.lng.toFixed(5), +e.lngLat.lat.toFixed(5)]]);
     
      setAllPointers(prevState => ({
        ...prevState,
        blue: prevState.blue === undefined
          ? [{ lng: +e.lngLat.lng.toFixed(5), lat: +e.lngLat.lat.toFixed(5) }]
          : [ ...prevState.blue,
            { lng: +e.lngLat.lng.toFixed(5), lat: +e.lngLat.lat.toFixed(5) }
          ]
      }));
      
      handleOpen();
    } else if (mode === REMOVE_POI_MODE) {
      
      setAllPointers(prevState => ({
        ...prevState, blue : prevState.blue.filter((p, i) => i !== e.features[0].id)
      }));
      setPoints(originPoints.filter((p, i) => i !== e.features[0].id));

    } else if (mode === ADD_FLAT_MODE) {
      setPoints([...points, [+e.lngLat.lng.toFixed(5), +e.lngLat.lat.toFixed(5)]]);
      setAllPointers(prevState => ({
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
      setAllPointers(prevState => ({
        ...prevState, red: prevState.red.filter((p, i) => i !== e.features[0].id)
      }));
      setPoints(points.filter((p, i) => i !== e.features[0].id));
    }
  };
 
  const handleSave = () => localStorage.setItem('ThePerfectSpot',JSON.stringify(allPointers));
  
  useEffect(()=>{
    handleSave();
    console.log('localstorage',localStorage.getItem('ThePerfectSpot').blue);
  },[allPointers]);

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
    
      const lastBluePoint = allPointers.blue[allPointers.blue.length - 1];
     
      const updatebluePoints = allPointers.blue.map(point =>{
        if (point === lastBluePoint) {
          return {
            ...point,
            name:text
          };
        }
        return point;
      });

      setAllPointers(prevState =>({
        ...prevState,blue:updatebluePoints
      }));
   
    } else if (mode === 'ADD_FLAT') {
      setStateUrl({
        ...stateUrl,
        pointsNames: [...stateUrl.pointsNames, text]
      });
      const lastRedPoint = allPointers.red[allPointers.red.length -1];
      const updateRedPoint = allPointers.red.map(point=>{
        if (point === lastRedPoint) {
          return {
            ...point,
            name:text
          };
        }
        return point;
      });
      setAllPointers(prevState =>({
        ...prevState,red:updateRedPoint
      }));
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
      <DirectionsTable directions={directions} onDirectionHighlight={handleDirectionHighlight} pointers={allPointers}/>
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
