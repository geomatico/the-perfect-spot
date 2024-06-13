import React from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import PointsSidePanels from '../../components/PointsSidePanels';
import Box from '@mui/material/Box';
import styled from '@mui/styles/styled';
import SelectInput from '@geomatico/geocomponents/SelectInput';
import Geomatico from '../../components/Geomatico';
import Typography from '@mui/material/Typography';
import http from '../../utils/http';
import LoadingError from '../../components/LoadingError';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@emotion/react';
const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '8px',
});

const SidePanelContent = ({ onChangeModePoints, allPoints, onChangePoints, mode, onChangeEditMode, editMode, onHandleTransportationType, transportOptions,transportType, lastModePoint, onChangeLastModePoint, selectedMode, onChangeSelectedMode}) => {
  const requestError = http.getError();
  const {t} = useTranslation();
  const theme = useTheme();
  const customSx= (theme)=>({
    root: {
      margin: 4 ,
      [theme.breakpoints.down('sm')]:{
        margin :0
      }
    }
  });
  return <Stack sx={{
    height: '100%',
    overflow: 'hidden'
  }}>

    <ScrollableContent>
      <Box sx={customSx(theme)} flexDirection='row'>
        <Typography sx={customSx(theme)} variant='overline'>{t('transportType')}</Typography>
        <SelectInput
          options={transportOptions}
          disabled={true}
          selectedOptionId={transportType}
          onOptionChange={onHandleTransportationType} minWidth='100%'
        />
      </Box>
      <Box sx={{...customSx(theme)}}>
        <Typography variant='overline'>{t('addLocations')}</Typography>
        <PointsSidePanels 
          onChangeModePoints={onChangeModePoints}
          onChangePoints={onChangePoints}
          mode={mode}
          editMode={editMode}
          onChangeEditMode={onChangeEditMode}
          allPoints={allPoints}
          lastModePoint={lastModePoint}
          onChangeLastModePoint={onChangeLastModePoint}
          selectedMode={selectedMode}
          onChangeSelectedMode={onChangeSelectedMode}
        />          
      </Box>
    </ScrollableContent>
    { requestError && <LoadingError />}
    <Geomatico/>
  </Stack>;
};

SidePanelContent.propTypes = {
  mapStyle: PropTypes.string.isRequired,
  onChangeModePoints: PropTypes.func,
  allPoints: PropTypes.shape({
    red: PropTypes.arrayOf(PropTypes.shape({
      id:  PropTypes.string.isRequired,
      lng: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
      name: PropTypes.string
    })).isRequired,
    blue: PropTypes.arrayOf(PropTypes.shape({
      id:  PropTypes.string.isRequired,
      lng: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
      name: PropTypes.string
    })).isRequired,
  }).isRequired,
  onChangePoints: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  onChangeEditMode: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  onHandleTransportationType: PropTypes.func.isRequired,
  transportOptions: PropTypes.array.isRequired,
  transportType: PropTypes.string.isRequired,
  lastModePoint: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null])
  ]),
  onChangeLastModePoint: PropTypes.func.isRequired,
  selectedMode: PropTypes.string.isRequired,
  onChangeSelectedMode: PropTypes.func.isRequired
};

export default SidePanelContent;
