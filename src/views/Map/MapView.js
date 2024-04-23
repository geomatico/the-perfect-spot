import React, {useState} from 'react';

import Layout from '../../components/Layout';
import SidePanelContent from './SidePanelContent';
import MainContent from './MainContent';

import {ADD_FLAT_MODE, ADD_POI_MODE, INITIAL_MAPSTYLE_URL, REMOVE_POI_MODE} from '../../config';

const Map = () => {
  const [mapStyle, setMapStyle] = useState(INITIAL_MAPSTYLE_URL);
  const [mode, setMode] = useState(ADD_POI_MODE);
  const [routes, setRoutes] = useState(null);
  const [directions, setDirections] = useState([]);
  const [allPoints,setAllPoints] = useState(localStorage.getItem('ThePerfectSpot') !==null?JSON.parse(localStorage.getItem('ThePerfectSpot')):{red: [], blue: []});
  const onModeChanged = () => {
    setMode(mode === ADD_POI_MODE || REMOVE_POI_MODE ? ADD_FLAT_MODE : ADD_POI_MODE);
  };

  const sidePanelContent = <SidePanelContent
    mapStyle={mapStyle}
    mode={mode}
    onPOIModeChanged={setMode}
    onFlatModeChanged={setMode}
    onPhaseChanged={onModeChanged}
    onRoutesChange={setRoutes}
    directions={directions}
    onDirectionsChange={setDirections}
    allPoints={allPoints}
  />;

  const mainContent = <MainContent
    onMapStyleChanged={setMapStyle}
    mapStyle={mapStyle}
    mode={mode}
    routes={routes}
    directions={directions}
    onChangePoints={setAllPoints}
  />;

  return <Layout
    sidePanelContent={sidePanelContent}
    mainContent={mainContent}
  />;
};

export default Map;
