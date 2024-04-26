import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import Box from '@mui/material/Box';
import styled from '@mui/styles/styled';
import SelectInput from '@geomatico/geocomponents/SelectInput';
import Geomatico from '../../components/Geomatico';
import {getDirections, getInfo} from '../../utils/ors';
import POISidePanel from '../../components/POISidePanel';
import FlatSidePanel from '../../components/FlatSidePanel';
import {useTranslation} from 'react-i18next';
import Typography from '@mui/material/Typography';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '8px',
});


const SidePanelContent = ({onBlueModeChanged, onRedModeChanged, onRoutesChange, mode, onChangeCalculatedRoutes,allPoints,  onChangePoints}) => {

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
    {
      id: 'driving-hgv',
      label: t('driving-hgv')
    },
  ];

  const [transportation, setTransportation] = useState(transportOptions[0].id);
  
  const redPointsCoords = allPoints?.red ? allPoints.red.map(({lng,lat}) => [lng,lat]) : [];
  const bluePointsCoords = allPoints?.blue ? allPoints.blue.map(({lng,lat}) => [lng,lat]) : [];

  const calculateDirectionsTable = (transportationType) => {
    if (bluePointsCoords.length === 0 || redPointsCoords.length === 0) {
      onChangeCalculatedRoutes([]);
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
      onChangeCalculatedRoutes(finalRows);
    });
  };

  const calculateRoutes = (transportationType) => {
    const promises = {};
    bluePointsCoords.forEach((location, idx) => {
      redPointsCoords.forEach(destination => {
        if (promises[idx]?.length) {
          promises[idx].push(getDirections([location], [destination], transportationType || transportation));
        } else {
          promises[idx] = [getDirections([location], [destination], transportationType || transportation)];
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

  const handleTransportationType = (transportationType) => {
    setTransportation(transportationType);
    if (allPoints.red?.length && allPoints.blue?.length) {
      calculateDirectionsTable(transportationType);
      calculateRoutes(transportationType);
    }

  };
  useEffect(() => {
    calculateRoutes();
    calculateDirectionsTable(transportation);
  }, [allPoints.red, allPoints.blue]);

  return <Stack sx={{
    height: '100%',
    overflow: 'hidden'
  }}>

    <ScrollableContent>
      <Box my={2} flexDirection='row'>
        <Typography variant='overline'>{t('transportType')}</Typography>
        <SelectInput
          options={transportOptions}
          selectedOptionId={transportation}
          onOptionChange={handleTransportationType} minWidth='100%'/>
      </Box>
      <Box my={2}>
        <POISidePanel
          mode={mode}
          onBlueModeChanged={onBlueModeChanged}
        />
        <FlatSidePanel
          mode={mode}
          onRedModeChanged={onRedModeChanged}
          onCalculateRoutes={calculateRoutes}
          onCalculateDirections={calculateDirectionsTable}
          onChangePoints={onChangePoints}
        />
      </Box>
    </ScrollableContent>
    <Geomatico/>
  </Stack>;
};

SidePanelContent.propTypes = {
  mapStyle: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  onBlueModeChanged: PropTypes.func,
  onRedModeChanged: PropTypes.func,
  onModeChanged: PropTypes.func,
  onRoutesChange: PropTypes.func.isRequired,
  onChangeCalculatedRoutes: PropTypes.func.isRequired,
  allPoints: PropTypes.shape({
    red: PropTypes.arrayOf(PropTypes.shape({
      lng: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
      name: PropTypes.string
    })).isRequired,
    blue: PropTypes.arrayOf(PropTypes.shape({
      lng: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
      name: PropTypes.string
    })).isRequired,
  }).isRequired,
  onChangePoints: PropTypes.func.isRequired
};

export default SidePanelContent;
