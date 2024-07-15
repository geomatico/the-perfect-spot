import React, {useEffect, useState} from 'react';

import Layout from '../../components/Layout';
import SidePanelContent from './SidePanelContent';
import MainContent from './MainContent';

import { ADD_BLUE_MODE, INITIAL_MAPSTYLE_URL} from '../../config';
import { getDirections, getInfo } from '../../utils/ors';
import { useTranslation } from 'react-i18next';

const Map = () => {
  const [mapStyle, setMapStyle] = useState(INITIAL_MAPSTYLE_URL);
  const [mode, setMode] = useState(ADD_BLUE_MODE);
  const [routes, setRoutes] = useState(null);
  const [calculatedRoutes, setCalculatedRoutes] = useState([]);
  const [hover, setHover] = useState(false);
  const [idHoverPoint,setIdHoverPoint] = useState(null);
  const [allPoints,setAllPoints] = useState(localStorage.getItem('ThePerfectSpot') ? JSON.parse(localStorage.getItem('ThePerfectSpot')):{red: [], blue: []});
  const [editMode, setEditMode] = useState(false);
  const [lastModePoint, setLastModePoint] = useState(null);
  const [nearestRedPoint, setNearestRedPoint] = useState(0);
  const [selectedMode, setSelectedMode] = useState(lastModePoint ? lastModePoint : 'ADD_BLUE');


  useEffect(() => {
    calculatedRoutes.forEach(function (element) {
      let sum = 0;
      for (var i = 0; i < element.data.length; i++) {
        sum += parseInt(element.data[i][1], 10);
      }
      let avg = sum / element.data.length;
      
      element.data.avg = Math.round(avg * 10) / 10;
    });

    let dir = calculatedRoutes.map(d => d.data.avg);
    let shortestRouteIndex = dir.indexOf(Math.min(...dir));
    setNearestRedPoint(shortestRouteIndex);
  }, [calculatedRoutes]);
  const {t} = useTranslation();
  const transportOptions = [
    {
      id: 'foot-walking',
      label: t('foot-walking')
    },
    {
      id: 'cycling-regular',
      label: t('cycling-regular')
    },
    {
      id: 'driving-car',
      label: t('driving-car')
    },
    /*{
      id: 'driving-hgv',
      label: t('driving-hgv')
    },*/
  ];

  const [transportation, setTransportation] = useState(transportOptions[0].id);

  const redPointsCoords = allPoints?.red ? allPoints.red.map(({lng,lat}) => [lng,lat]) : [];
  const bluePointsCoords = allPoints?.blue ? allPoints.blue.map(({lng,lat}) => [lng,lat]) : [];

  const calculateDirectionsTable = (transportationType) => {
    if (bluePointsCoords.length === 0 || redPointsCoords.length === 0) {
      setCalculatedRoutes([]);
      return;
    }
    getInfo(bluePointsCoords, redPointsCoords, transportationType || transportation).then(data => {
      const finalRows = data.destinations.map((destination, destinationIndex) => {
        return {
          name: destination.name,
          data: bluePointsCoords.map((loc, locationIndex) => {
            return [
              (data.distances[locationIndex][destinationIndex] / 1000).toFixed(1),
              (data.durations[locationIndex][destinationIndex] / 60).toFixed(1)
            ];
          }),
        };
      });
      setCalculatedRoutes(finalRows);
    });
  };

  const calculateRoutes = (transportationType) => {
    const promises = {};
    bluePointsCoords.forEach((location, idx) => {
      redPointsCoords.forEach((destination, redIdx) => {
        if (promises[idx]?.length) { 
          promises[idx].push(getDirections([location], [destination], transportationType || transportation).then(data => ({ data, redPointId: allPoints.red[redIdx].id })));
        } else {
          promises[idx] = [getDirections([location], [destination], transportationType || transportation).then(data => ({ data, redPointId: allPoints.red[redIdx].id }))];
        }
      });
    });

    Promise.all(Object.values(promises).flat())
      .then((data) => {
        const features = data.map(f => f.data.features.map(feature => (
          {
            ...feature,
            properties: {
              ...feature.properties,
              duration: (feature.properties.summary.duration / 60).toFixed(1) + 'min',
              redPointId: f.redPointId  
            }
          }
        ))).flat();
        const featureCollection = {
          type: 'FeatureCollection',
          features: features
        };
        setRoutes(featureCollection);
      });
  };

  const handleTransportationType = (transportationType) => {
    setTransportation(transportationType);
    if (allPoints.red?.length && allPoints.blue?.length) {
      calculateDirectionsTable(transportationType);
      calculateRoutes(transportationType);
    }

  };
  useEffect(() => {
    
    calculateRoutes(transportation);
    calculateDirectionsTable(transportation);
    
    
  }, [allPoints.red, allPoints.blue]);

  
  const sidePanelContent = <SidePanelContent
    onChangeModePoints={setMode}
    allPoints={allPoints}
    onChangePoints={setAllPoints}
    onChangeEditMode={setEditMode}
    onHandleTransportationType={handleTransportationType}
    mode={mode}
    editMode={editMode}
    transportOptions={transportOptions}
    transportType={transportation}
    lastModePoint={lastModePoint}
    onChangeLastModePoint={setLastModePoint}
    selectedMode={selectedMode}
    onChangeSelectedMode={setSelectedMode}
  />;

  const mainContent = <MainContent
    onMapStyleChanged={setMapStyle}
    mapStyle={mapStyle}
    mode={mode}
    routes={routes}
    calculatedRoutes={calculatedRoutes}
    onChangePoints={setAllPoints}
    allPoints={allPoints}
    hover={hover}
    onChangeHover={setHover}
    idHoverPoint={idHoverPoint}
    onChangeIdHoverPoint={setIdHoverPoint}
    editMode={editMode}
    onChangeEditMode={setEditMode}
    onChangeModePoints={setMode}
    onHandleTransportationType={handleTransportationType}
    transportType={transportation}
    transportOptions={transportOptions}
    lastModePoint={lastModePoint}
    onChangeLastModePoint={setLastModePoint}
    onChangeRoutes={setCalculatedRoutes}
    nearestRedPoint={nearestRedPoint}
    selectedMode={selectedMode}
    onChangeSelectedMode={setSelectedMode}
  />;

  return <Layout
    sidePanelContent={sidePanelContent}
    mainContent={mainContent}
  />;
};

export default Map;
