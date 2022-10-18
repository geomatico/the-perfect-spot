import React, {useState} from 'react';

import Layout from '../../components/Layout';
import SidePanelContent from './SidePanelContent';
import MainContent from './MainContent';

import {ADD_POI_MODE, INITIAL_MAPSTYLE_URL} from '../../config';

const Map = () => {
  const [mapStyle, setMapStyle] = useState(INITIAL_MAPSTYLE_URL);
  const [mode, setMode] = useState(ADD_POI_MODE);

  const [routes, setRoutes] = useState(null);
  const [directions, setDirections] = useState([]);

  const sidePanelContent = <SidePanelContent
    mapStyle={mapStyle}
    onMapStyleChanged={setMapStyle}
    mode={mode}
    onModeChanged={setMode}
    onRoutesChange={setRoutes}
    directions={directions}
    onDirectionsChange={setDirections}
  />;

  const mainContent = <MainContent
    mapStyle={mapStyle}
    mode={mode}
    routes={routes}
    directions={directions}
  />;

  return <Layout
    sidePanelContent={sidePanelContent}
    mainContent={mainContent}
  />;
};

export default Map;
