import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import Map from '@geomatico/geocomponents/Map';

import {
  ADD_RED_MODE,
  ADD_BLUE_MODE,
  REMOVE,
  INITIAL_VIEWPORT,
  EDIT
} from '../../config';
import NominatimSearchBox from '@geomatico/geocomponents/NominatimSearchBox';
import {useTranslation} from 'react-i18next';
import DirectionsTable from '../../components/DirectionsTable';
import Box from '@mui/material/Box';
import ModalInfo from '../../components/ModalInfo';
import ModalAddPoint from '../../components/ModalAddPoint';
import { primaryColor, secondaryColor } from '../../theme';
import { v4 as uuid } from 'uuid';
const MainContent = ({mapStyle, mode, routes, calculatedRoutes, onChangePoints, allPoints, onChangeHover, hover, idHoverPoint, onChangeIdHoverPoint, editMode }) => {
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [openModal, setOpenModal] = useState(false);
  const [nearestRedPoint,setNearestRedPoint] = useState(null);
  const handleOpen = () => setOpenModal(true);

  
  const handleClose = (event, reason) => {
    // para que no se cierre con click fuera de la modal si esc
    if (reason && (reason === 'backdropClick' || reason === 'escapeKeyDown')){
      if (mode === ADD_BLUE_MODE) {
        const bluePoints = [...allPoints.blue];
        bluePoints.pop();
        onChangePoints({
          ...allPoints, blue: bluePoints
        });
     
      }else if(mode === ADD_RED_MODE){
        const redPoints = [...allPoints.red];
        redPoints.pop();
        onChangePoints({
          ...allPoints, red: redPoints
        });
      }
    }
    setOpenModal(false);
  };

  const {t, i18n} = useTranslation();

  const mapRef = useRef();
  const flyTo = bbox => mapRef.current?.fitBounds(bbox, {duration: 1000});
  const handleSearchResult = ({bbox}) => flyTo(bbox);
  const [text, setText] = useState(t('point'));

  const COLOR = mode === ADD_BLUE_MODE ? primaryColor : secondaryColor;
  const sources = useMemo(() => {

    const empty = {
      type: 'FeatureCollection',
      features:[]
    };
    const filterRedPoint = hover ? allPoints.red.find(({id})=> id === idHoverPoint) : null;
    const redPoints = {
      type: 'FeatureCollection',
      features: hover ? [{
        type: 'Feature',
        id: 1,
        properties: {},
        geometry: {
          type: 'Point',
          coordinates:  [filterRedPoint.lng,filterRedPoint.lat]
        }
      }]: allPoints.red?.map(({lng,lat},index) => ({
        type: 'Feature',
        id: index,
        properties: {},
        geometry: {
          type: 'Point',
          coordinates:  [lng,lat] 
        }
      })) 
    };

    const bluePoints = {
      type: 'FeatureCollection',
      features: allPoints.blue?.map(({lng,lat}, index) => ({
        type: 'Feature',
        id: index,
        properties: {},
        geometry: {
          type: 'Point',
          coordinates:  [lng,lat] 
        }
      }))
    };
    const nearestPoint = {
      type: 'FeatureCollection',
      features:[
        {
          type: 'Feature',
          id: 1,
          properties: {},
          geometry:{
            type: 'Point',
            coordinates: !hover || idHoverPoint === allPoints?.red[nearestRedPoint].id ? [allPoints?.red[nearestRedPoint]?.lng, allPoints?.red[nearestRedPoint]?.lat] : empty
          }
        }
      ]
    };      
    return {
      redPoints: {
        type: 'geojson',
        data:   redPoints
      },
      bluePoints: {
        type: 'geojson',
        data: bluePoints
      },
      directions: {
        type: 'geojson',
        data: routes && hover ? {
          type : 'FeatureCollection',
          features: routes.features.filter(route => route.properties.redPointId  === idHoverPoint)
        } : routes || empty
      },
      nearestRedPoint: {
        type: 'geojson',
        data: nearestPoint || empty
      }
    };
  }, [allPoints,routes,hover,idHoverPoint,nearestRedPoint]);
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
        id: 'redPoints',
        source: 'redPoints',
        type: 'circle',
        paint: {
          'circle-color': 'red',
          'circle-radius': 10,
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 2
        }
      },
      {
        id: 'bluePoints',
        source: 'bluePoints',
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
      },
      {
        id: 'nearestRedPoint',
        source: 'nearestRedPoint',
        type: 'circle',
        paint: {
          'circle-color': '#d00000',
          'circle-radius': 14,
          'circle-stroke-color': '#d00000',
          'circle-stroke-width': 2,
        }
      }
    ];
  }, [mapStyle]);

  const handleClick = e => {
    const coords = e.lngLat;
    if (mode === ADD_BLUE_MODE) {
     
      onChangePoints({
        ...allPoints,
        blue: [
          ...allPoints.blue,
          {
            id : uuid(),
            lng: +coords.lng.toFixed(5),
            lat: +coords.lat.toFixed(5),
          }]
      });
      
      handleOpen();
    }  else if (mode === ADD_RED_MODE) {
      
      onChangePoints({
        ...allPoints,
        red: [
          ...allPoints.red,
          {
            id: uuid(),
            lng: +coords.lng.toFixed(5),
            lat: +coords.lat.toFixed(5),
            
          }]
      });
      
      handleOpen();

    } else if (mode === REMOVE) {
      const {point} = e;
      const features = mapRef.current.queryRenderedFeatures(point, {
        layers: ['redPoints', 'bluePoints']
      });
      if (features[0]) {
        features[0].source === 'bluePoints' ?  onChangePoints({
          ...allPoints, blue : allPoints.blue.filter((p, i) => i !== features[0].id)
        }) : onChangePoints({
          ...allPoints, red: allPoints.red.filter((p, i) => i !== features[0].id)
        });
      }
     
    }
  };
  
  useEffect(()=>{
    localStorage.setItem('ThePerfectSpot',JSON.stringify(allPoints));
    onChangePoints(allPoints);
  },[allPoints]);
  const [cursor, setCursor] = useState('pointer');

  useEffect(() => {
    setCursor(mode === ADD_BLUE_MODE ? 'pointer' : 'auto');

    if (mode === REMOVE) {
      setCursor('crosshair');
    }else if(mode === ADD_BLUE_MODE || ADD_RED_MODE){
      setCursor('pointer');
    }else{
      setCursor('auto');
    }
  }, [mode]);

  const onMouseEnter = useCallback(() => {
    setCursor('no-drop');
  }, []);
  const onMouseLeave = useCallback(() => setCursor('auto'), []);


  const handleChangeText = (x) => {
    setText(x);
  };

  const handleSaveName = () => {
    if(text === '')  return;
    if (mode === 'ADD_BLUE') {
    
    
      const lastBluePoint = allPoints.blue[allPoints.blue.length - 1];
     
      const updateBluePoints = allPoints.blue.map(point =>{
        if (point === lastBluePoint) {
          return {
            ...point,
            name:text
          };
        }
        return point;
      });
      onChangePoints({
        ...allPoints,blue:updateBluePoints
      });

    } else if (mode === 'ADD_RED') {
      
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
      onChangePoints({
        ...allPoints,red:updateRedPoint
      });

    }
    handleClose();
    setText(t('point'));
  };
 
 
  useEffect(() => {
    if (mapRef.current && editMode && mode === EDIT) {
      setCursor('');
      const handleBlueMouseDown = (e) => {
        
        if (!e.point) return;
        const indexPointRef = e.features[0].id;
        
        setCursor('grab');
        e.preventDefault();
        const onMove = () => setCursor('grabbing');

        const onUp = (event) => {
          const coords = event.lngLat;
          onChangePoints(prevPoints => {
            return {
              ...prevPoints,
              blue: prevPoints.blue.map((point, idx) => {
                if (idx === indexPointRef) {
                  return {
                    ...point,
                    lat: coords.lat,
                    lng: coords.lng
                  };
                }
                return point;
              })
            };
          });
          

          mapRef.current.off('mousemove', onMove);
          mapRef.current.off('mouseup', onUp);
          mapRef.current.off('touchmove', onMove);
          setCursor('auto');
        };

        mapRef.current.on('mousemove', onMove);
        mapRef.current.once('mouseup', onUp);
      };
      const handleRedMouseDown = (e) => {
        
        if (!e.point) return;
        const indexPointRef = e.features[0].id;
        
        setCursor('grab');
        e.preventDefault();
        const onMove = () => setCursor('grabbing');

        const onUp = (event) => {
          const coords = event.lngLat;
          onChangePoints(prevPoints => {
            return {
              ...prevPoints,
              red: prevPoints.red.map((point, idx) => {
                if (idx === indexPointRef) {
                  return {
                    ...point,
                    lat: coords.lat,
                    lng: coords.lng
                  };
                }
                return point;
              })
            };
          });
          

          mapRef.current.off('mousemove', onMove);
          mapRef.current.off('mouseup', onUp);
          mapRef.current.off('touchmove', onMove);
          setCursor('auto');
        };

        mapRef.current.on('mousemove', onMove);
        mapRef.current.once('mouseup', onUp);
      };

      mapRef.current.off('mousedown', 'bluePoints', handleBlueMouseDown);
      mapRef.current.off('mousedown', 'redPoints', handleRedMouseDown);
      
      mapRef.current.on('mousedown', 'bluePoints', handleBlueMouseDown);
      mapRef.current.on('mousedown', 'redPoints', handleRedMouseDown);


      return () => {
        mapRef.current.off('mousedown', 'bluePoints', handleBlueMouseDown);
        mapRef.current.off('mousedown', 'redPoints', handleRedMouseDown);
        
      };
    }
  }, [mapRef, mode, allPoints, onChangePoints, setCursor]);

  

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
      <DirectionsTable calculatedRoutes={calculatedRoutes} allPoints={allPoints}
        onChangeNearestRedPoint={setNearestRedPoint} onChangeHover={onChangeHover} 
        onChangeIdHoverPoint={onChangeIdHoverPoint} onChangePoints={onChangePoints}
        mode={mode} editMode={editMode} />
    </div>
  </>;
};

MainContent.propTypes = {
  onMapStyleChanged: PropTypes.func,
  mapStyle: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  routes: PropTypes.any,
  calculatedRoutes: PropTypes.array.isRequired,
  onChangePoints: PropTypes.func.isRequired,
  allPoints: PropTypes.shape({
    red: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      lng: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
      name: PropTypes.string
    })).isRequired,
    blue: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      lng: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
      name: PropTypes.string
    })).isRequired,
  }).isRequired,
  hover: PropTypes.bool.isRequired,
  onChangeHover: PropTypes.func.isRequired,
  idHoverPoint: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null])
  ]),
  onChangeIdHoverPoint: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired
};

export default MainContent;
