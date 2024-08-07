import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import {  useTranslation } from 'react-i18next';
import DirectionsTable from '../../components/DirectionsTable';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { primaryColor, secondaryColor } from '../../theme';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import ModalInfo from '../../components/ModalInfo';
import ModalAddPoint from '../../components/ModalAddPoint';
import BottomSheet from '@geomatico/geocomponents/BottomSheet';
import SidePanelContent from './SidePanelContent';

import { v4 as uuid } from 'uuid';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Popup } from 'react-map-gl';

import Grow from '@mui/material/Grow';

import HighlightAltIcon from '@mui/icons-material/HighlightAlt';

const MainContent = ({ mapStyle, mode, routes, calculatedRoutes, onChangePoints, allPoints, onChangeHover, hover, idHoverPoint, onChangeIdHoverPoint, editMode, onChangeModePoints, onChangeEditMode, onHandleTransportationType, transportOptions,transportType, lastModePoint, onChangeLastModePoint, nearestRedPoint, selectedMode, onChangeSelectedMode }) => {

  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [openModal, setOpenModal] = useState(false);
  const [getOpen, setOpen] = useState(!widescreen);
  const [value, setValue] = useState(0);
  const [editedPointsName, setEditedPointsName] = useState(allPoints);
  const [openDirectionsTable,setOpenDirectionsTable] = useState(true);
  const [coords, setCoords]= useState('');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(()=>{
    setEditedPointsName(allPoints);
  },[allPoints]);

  const [featureHovered, setFeatureHovered] = useState(null);
  const getCookie = document.cookie.split('; ').some(cookie => cookie.startsWith('modalInfo'));

  const [openModalInfo, setOpenModalInfo] = useState(!getCookie);

  const handleOpen = () => setOpenModal(true);

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();

  const handleCloseModalInfo = () => {
    document.cookie = 'modalInfo=accept; expires=' + tomorrow; // the modal opens once a day
    setOpenModalInfo(false);
  };

  const handleClose = () => setOpenModal(false);


  const { t, i18n } = useTranslation();

  const mapRef = useRef();

  const flyTo = (lat, lon) => {
    mapRef.current?.flyTo({
      center: [lon, lat]
    });
  };
  const handleSearchResult = ({ lat, lon }) => flyTo(lat, lon);
  const [placeholderText, setPlaceholderText] = useState(t('point'));

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
        data: redPoints
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
  }, [allPoints, routes, hover, idHoverPoint, nearestRedPoint]);

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
    
    if (mode === ADD_BLUE_MODE || mode === ADD_RED_MODE) {
      setCoords(e.lngLat);
      handleOpen();
    }else if (mode === REMOVE) {
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
    setPlaceholderText(x);
  };

  const handleSaveName = () => {
    if(placeholderText === '')  return;
    if (mode === 'ADD_BLUE') {

      onChangePoints({
        ...allPoints,
        blue: [
          ...allPoints.blue,
          {
            id : uuid(),
            lng: +coords.lng.toFixed(5),
            lat: +coords.lat.toFixed(5),
            name: placeholderText
          }]
      });

    } else if (mode === 'ADD_RED') {
      
      onChangePoints({
        ...allPoints,
        red: [
          ...allPoints.red,
          {
            id : uuid(),
            lng: +coords.lng.toFixed(5),
            lat: +coords.lat.toFixed(5),
            name: placeholderText
          }]
      });

    }
    handleClose();
    setPlaceholderText(t('point'));
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
          mapRef.current.off('touchend', onUp);

          setCursor('auto');
        };

        mapRef.current.on('mousemove', onMove);
        mapRef.current.on('touchmove', onMove);
        mapRef.current.once('touchend', onUp);

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
    }else{
      if (mapRef.current && mode !== REMOVE) {
        const handleHoverPoint = (event) =>{
          
          if (!event.point) return;
          
          const id = event.features[0].id;
          const pointType = event.features[0].layer.id;
          setFeatureHovered({
            lngLat: event.lngLat,
            pointType: event.features[0].layer.id,
            name: pointType === 'bluePoints' ? allPoints.blue[id].name : allPoints.red[id].name
          });
        };

        const handleMouseLeave = (event) =>{
          if (!event.point) return;
          setFeatureHovered(null); 
        };
        mapRef.current.off('mousemove','bluePoints',handleHoverPoint);
        mapRef.current.off('mouseleave','bluePoints',handleMouseLeave);
        mapRef.current.off('mousemove','redPoints',handleHoverPoint);
        mapRef.current.off('mouseleave','redPoints',handleMouseLeave);


        mapRef.current.on('mousemove','bluePoints',handleHoverPoint);
        mapRef.current.on('mouseleave','bluePoints',handleMouseLeave);

        mapRef.current.on('mousemove','redPoints',handleHoverPoint);
        mapRef.current.on('mouseleave','redPoints',handleMouseLeave);

        return () =>{
          mapRef.current.off('mousemove','bluePoints',handleHoverPoint);
          mapRef.current.off('mouseleave','bluePoints',handleMouseLeave);
          mapRef.current.off('mousemove','redPoints',handleHoverPoint);
          mapRef.current.off('mouseleave','redPoints',handleMouseLeave);


        };
      }

     
    }
  }, [mapRef.current, mode, allPoints, onChangePoints, setCursor,setFeatureHovered,editMode]);
  const theme = useTheme();
  const widescreen = useMediaQuery(theme.breakpoints.up('lg'), { noSsr: true });

  

  useEffect(()=>{
    if (!editMode) {
      onChangePoints(editedPointsName);
      
    }
  },[editMode,onChangePoints,editedPointsName]);

  const expandTableSx = {
    position: 'absolute',
    bottom: 20,
    right: 8,
    '&.MuiButton-outlined':{
      border: 'none',
    }
  };
  return <>
    {openModalInfo && <ModalInfo onHandleCloseModalInfo={handleCloseModalInfo} />}
    {openModal && <ModalAddPoint
      pointType={mode}
      pointName={placeholderText}
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
    >
      {featureHovered &&
        <Popup
          longitude={featureHovered.lngLat.lng}
          latitude={featureHovered.lngLat.lat}
          closeButton={false}
          closeOnClick={false}
          offsetTop={-10}
        >
          <Container>
            <Typography>{featureHovered.name}</Typography>
          </Container>
        </Popup>
      }
    </Map>
    <Box sx={{
      position: 'absolute',
      top: widescreen ? 18 : 6,
      left: widescreen ? 18 : 6,
      width: widescreen ? 250 : '97%'
    }}>
      <NominatimSearchBox
        placeholder={t('search')}
        country='ES'
        lang={i18n.language}
        onResultClick={handleSearchResult} />
    </Box>
    {widescreen ? (
      <>
        <div
          style={{
            position: 'absolute',
            bottom: 18,
            right: 18,
            background: 'white',
          }}
        >
          {openDirectionsTable && (
            <Grow in={openDirectionsTable} style={{ transformOrigin: '0 0 0' }}
              {...(openDirectionsTable ? { timeout: 500 } : {})}>
              <div> <DirectionsTable
                calculatedRoutes={calculatedRoutes}
                allPoints={allPoints}
                onChangeHover={onChangeHover}
                onChangeIdHoverPoint={onChangeIdHoverPoint}
                onChangePoints={onChangePoints}
                mode={mode}
                editMode={editMode}
                editedPointsName={editedPointsName}
                onChangeEditedPointsName={setEditedPointsName}
                shortestRouteIndex={nearestRedPoint}
                openButtonSheet={false}
              /> </div></Grow>
          )}
        </div>
        {
          allPoints.blue.length > 0 && allPoints.red.length > 0 && 
          <Tooltip title={openDirectionsTable ? t('hiddenTable') : t('showTable')}>
            <Button size='small' variant= {openDirectionsTable ? 'outlined' : 'contained'} onClick={() => setOpenDirectionsTable(!openDirectionsTable)} sx={expandTableSx}>
              <HighlightAltIcon/>
            </Button>
          </Tooltip>
        }
      </>

    ) : (
      <BottomSheet
        isOpen={getOpen}
        onToggle={setOpen}
        isCloseable={true}
        closeHeight={50}
        openHeight="50vh"
      >
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label={t('pointsTab')} />
              <Tab label={t('tableTab')} />
            </Tabs>
          </Box>
          {
            value === 0 && <SidePanelContent
              allPoints={allPoints}
              editMode={editMode}
              lastModePoint={lastModePoint}
              selectedMode={selectedMode}
              transportOptions={transportOptions}
              transportType={transportType}
              mode={mode}
              onChangeEditMode={onChangeEditMode}
              onChangeModePoints={onChangeModePoints}
              onChangeLastModePoint={onChangeLastModePoint}
              onChangePoints={onChangePoints}
              onChangeSelectedMode={onChangeSelectedMode}
              onHandleTransportationType={onHandleTransportationType}
            />
          }
          {value === 1 && (
            <DirectionsTable
              calculatedRoutes={calculatedRoutes}
              allPoints={allPoints}
              onChangeHover={onChangeHover}
              onChangeIdHoverPoint={onChangeIdHoverPoint}
              onChangePoints={onChangePoints}
              mode={mode}
              editMode={editMode}
              openButtonSheet={true}
              editedPointsName={editedPointsName}
              onChangeEditedPointsName={setEditedPointsName}
              shortestRouteIndex={nearestRedPoint}
            />
          )}
        </Box>
      </BottomSheet>
    )}
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
  editMode: PropTypes.bool.isRequired,
  onChangeModePoints: PropTypes.func.isRequired,
  onChangeEditMode: PropTypes.func.isRequired,
  onHandleTransportationType: PropTypes.func.isRequired,
  transportOptions: PropTypes.array.isRequired,
  transportType: PropTypes.string.isRequired,
  lastModePoint: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null])
  ]),
  onChangeLastModePoint: PropTypes.func.isRequired,
  nearestRedPoint: PropTypes.number.isRequired,
  selectedMode: PropTypes.string.isRequired,
  onChangeSelectedMode: PropTypes.func.isRequired

};

export default MainContent;
