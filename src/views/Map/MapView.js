import React, {useState} from 'react';

import Layout from '../../components/Layout';
import SidePanelContent from './SidePanelContent';
import MainContent from './MainContent';

import {ADD_RED_MODE, ADD_BLUE_MODE, INITIAL_MAPSTYLE_URL, REMOVE_BLUE_MODE} from '../../config';

const Map = () => {
  const [mapStyle, setMapStyle] = useState(INITIAL_MAPSTYLE_URL);
  const [mode, setMode] = useState(ADD_BLUE_MODE);
  const [routes, setRoutes] = useState(null);
  const [calculatedRoutes, setCalculatedRoutes] = useState([]);
  const [allPoints,setAllPoints] = useState(localStorage.getItem('ThePerfectSpot') ? JSON.parse(localStorage.getItem('ThePerfectSpot')):{red: [], blue: []});
  const onModeChanged = () => {
    setMode(mode === ADD_BLUE_MODE || REMOVE_BLUE_MODE ? ADD_RED_MODE : ADD_BLUE_MODE);
  };

  const sidePanelContent = <SidePanelContent
    mapStyle={mapStyle}
    mode={mode}
    onBlueModeChanged={setMode}
    onRedModeChanged={setMode}
    onModeChanged={onModeChanged}
    onRoutesChange={setRoutes}
    onChangeCalculatedRoutes={setCalculatedRoutes}
    allPoints={allPoints}
    onChangePoints={setAllPoints}
  />;

  const mainContent = <MainContent
    onMapStyleChanged={setMapStyle}
    mapStyle={mapStyle}
    mode={mode}
    routes={routes}
    calculatedRoutes={calculatedRoutes}
    onChangePoints={setAllPoints}
    allPoints={allPoints}
  />;

  return <Layout
    sidePanelContent={sidePanelContent}
    mainContent={mainContent}
  />;
};

export default Map;
