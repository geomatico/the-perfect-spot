import React from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import Box from '@mui/material/Box';
import styled from '@mui/styles/styled';

import Geomatico from '../../components/Geomatico';
import {getDirections, getInfo} from '../../utils/ors';
import {useParams} from 'react-router-dom';
import POISidePanel from '../../components/POISidePanel';
import FlatSidePanel from '../../components/FlatSidePanel';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '8px',
});

const SidePanelContent = ({isPOIsEditing, onPOIModeChanged, onFlatModeChanged, onPhaseChanged, onRoutesChange, mode, onDirectionsChange}) => {

  const {
    points: strPoiPoints,
    originPoints: strFlatPoints
  } = useParams();

  const destinations = strPoiPoints ? JSON.parse(strPoiPoints) : [];
  const locations = strFlatPoints ? JSON.parse(strFlatPoints) : [];

  const calculateDirectionsTable = () => {
    getInfo(locations, destinations).then(data => {
      console.log('data from API', data);
      const finalRows = data.destinations.map((destination, destinationIndex) => {
        return {
          name: destination.name,
          data: locations.map((loc, locationIndex) => {
            return [
              (data.distances[locationIndex][destinationIndex] / 1000).toFixed(1),
              (data.durations[locationIndex][destinationIndex] / 60).toFixed(1)
            ];
          }),
        };
      });
      console.log('final Object', finalRows);
      onDirectionsChange(finalRows);
    });
  };


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
            onCalculateDirections={calculateDirectionsTable}
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
  onDirectionsChange: PropTypes.func.isRequired
};

export default SidePanelContent;
