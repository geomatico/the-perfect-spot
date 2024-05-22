import React, {useState} from 'react';

import Layout from '../../components/Layout';
import SidePanelContent from './SidePanelContent';
import MainContent from './MainContent';

import { ADD_BLUE_MODE, INITIAL_MAPSTYLE_URL} from '../../config';

const Map = () => {
  const [mapStyle, setMapStyle] = useState(INITIAL_MAPSTYLE_URL);
  const [mode, setMode] = useState(ADD_BLUE_MODE);
  const [routes, setRoutes] = useState(null);
  const [calculatedRoutes, setCalculatedRoutes] = useState([]);
  const [hover, setHover] = useState(false);
  const [idHoverPoint,setIdHoverPoint] = useState(null);
  const [allPoints,setAllPoints] = useState(localStorage.getItem('ThePerfectSpot') ? JSON.parse(localStorage.getItem('ThePerfectSpot')):{red: [], blue: []});

  const sidePanelContent = <SidePanelContent
    onChangeModePoints={setMode}
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
    hover={hover}
    onChangeHover={setHover}
    idHoverPoint={idHoverPoint}
    onChangeIdHoverPoint={setIdHoverPoint}
  />;

  return <Layout
    sidePanelContent={sidePanelContent}
    mainContent={mainContent}
  />;
};

export default Map;
