import React from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import Box from '@mui/material/Box';
import styled from '@mui/styles/styled';

import Geomatico from '../../components/Geomatico';
import {getDirections} from '../../utils/ors';
import {useParams} from 'react-router-dom';
import POISidePanel from '../../components/POISidePanel';
import FlatSidePanel from '../../components/FlatSidePanel';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '8px',
});
const SidePanelContent = ({
  mode,
  isPOIsEditing,
  onPOIModeChanged,
  onFlatModeChanged,
  onPhaseChanged,
  onRoutesChange
}) => {

  /*const {t} = useTranslation();*/

  /*const handleItemCLick = newMode => newMode && onModeChanged(newMode);*/

  const {
    points: strPoints,
    originPoints: strOriginPoints
  } = useParams();
  const destinations = strPoints ? JSON.parse(strPoints) : [];
  const locations = strOriginPoints ? JSON.parse(strOriginPoints) : [];

  const calculateRoutes = () => {
    const promises = {};
    locations.forEach((location, idx) => {
      destinations.forEach(destination => {
        if (promises[idx]?.length) {
          promises[idx].push(getDirections([location], [destination]));
        } else {
          promises[idx] = [getDirections([location], [destination])];
        }
      });
    });

    console.log(888, Object.values(promises).flat());

    Promise.all(Object.values(promises).flat())
      .then((data) => {
        const features = data.map(f => f.features).flat();
        const featureCollection = {
          type: 'FeatureCollection',
          features: features
            .map(feature => (
              {
                ...feature,
                ...{properties: {duration: (feature.properties.summary.duration / 60).toFixed(1) + 'min'}}
              }
            )),
        };
        onRoutesChange(featureCollection);
      });
  };
  console.log('mode', mode);
  return <Stack sx={{height: '100%', overflow: 'hidden'}}>
    <ScrollableContent>
      {
        isPOIsEditing ?
          <POISidePanel
            mode={mode}
            onPOIModeChanged={onPOIModeChanged}
            onPhaseChanged={onPhaseChanged}
          /> : <FlatSidePanel
            mode={mode}
            onFlatModeChanged={onFlatModeChanged}
            onCalculateRoutes={calculateRoutes}
            onPhaseChanged={onPhaseChanged}
          />
      }
    </ScrollableContent>
    <Geomatico/>
  </Stack>;
};

SidePanelContent.propTypes = {
  mapStyle: PropTypes.string.isRequired,
  isPOIsEditing: PropTypes.bool,
  mode: PropTypes.string.isRequired,
  onPOIModeChanged: PropTypes.func,
  onFlatModeChanged: PropTypes.func,
  onPhaseChanged: PropTypes.func,
  onRoutesChange: PropTypes.func.isRequired,
};

export default SidePanelContent;
