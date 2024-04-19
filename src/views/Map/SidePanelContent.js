import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import Box from '@mui/material/Box';
import styled from '@mui/styles/styled';
import SelectInput from '@geomatico/geocomponents/SelectInput';
import Geomatico from '../../components/Geomatico';
import {getDirections, getInfo} from '../../utils/ors';
import {useParams} from 'react-router-dom';
import POISidePanel from '../../components/POISidePanel';
import FlatSidePanel from '../../components/FlatSidePanel';
import {useTranslation} from 'react-i18next';
import Typography from '@mui/material/Typography';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '8px',
});


const SidePanelContent = ({onPOIModeChanged, onFlatModeChanged, onRoutesChange, mode, onDirectionsChange}) => {

  const {points: strPoiPoints, originPoints: strFlatPoints} = useParams();
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
  const allPointers = JSON.parse(localStorage.getItem('ThePerfectSpot'));
  console.log('localStorage',allPointers);
  const destinations = allPointers?.red ? allPointers.red.map(point =>[point.lng,point.lat]) : [];
  const locations = allPointers?.blue ? allPointers.blue.map(point =>[point.lng,point.lat]) : [];

  const calculateDirectionsTable = (transportationType) => {
    getInfo(locations, destinations, transportationType || transportation).then(data => {
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
      onDirectionsChange(finalRows);
    });
  };

  const calculateRoutes = (transportationType) => {
    const promises = {};
    locations.forEach((location, idx) => {
      destinations.forEach(destination => {
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
    if (strFlatPoints?.length && strPoiPoints?.length) {
      calculateDirectionsTable(transportationType);
      calculateRoutes(transportationType);
    }

  };

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
          onPOIModeChanged={onPOIModeChanged}
        />
        <FlatSidePanel
          mode={mode}
          onFlatModeChanged={onFlatModeChanged}
          onCalculateRoutes={calculateRoutes}
          onCalculateDirections={calculateDirectionsTable}
        />
      </Box>
    </ScrollableContent>
    <Geomatico/>
  </Stack>;
};

SidePanelContent.propTypes = {
  mapStyle: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  onPOIModeChanged: PropTypes.func,
  onFlatModeChanged: PropTypes.func,
  onPhaseChanged: PropTypes.func,
  onRoutesChange: PropTypes.func.isRequired,
  onDirectionsChange: PropTypes.func.isRequired
};

export default SidePanelContent;
