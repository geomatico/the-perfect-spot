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
import {Chip, useMediaQuery} from '@mui/material';
import theme from '../../theme';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '8px',
});

const SidePanelContent = ({
  allPoints,
  editMode,
  lastModePoint,
  selectedMode,
  transportOptions,
  transportType,
  mode,
  onChangeEditMode,
  onChangeModePoints,
  onChangeLastModePoint,
  onChangePoints,
  onHandleTransportationType,
  onChangeSelectedMode
}) => {
  
  const requestError = http.getError();
  const {t} = useTranslation();
  const widescreen = useMediaQuery(theme().breakpoints.up('lg'), { noSsr: true });

  return <Stack sx={{
    height: '100%',
    overflow: 'hidden'
  }}>

    <ScrollableContent>
      <Box sx={{m: { xs: 0, md: 0}}} display='flex' flexDirection={widescreen ? 'column' : 'row'} alignItems={widescreen ? 'flex-start' : 'center'}>
        {
          widescreen ? 
            <Typography component='p' sx={{mt:0}} variant='overline'>{t('transportType')}</Typography>
            : <Typography component='p' sx={{mt: 1.5, mr: 2}} variant='overline'>MODO</Typography>
        }
        <SelectInput
          options={transportOptions}
          disabled={true}
          selectedOptionId={transportType}
          onOptionChange={onHandleTransportationType}
        />
      </Box>
      <Box mt={2}>
        {
          widescreen ?
            <Typography variant='overline'>{t('addLocations')}</Typography>
            : <Typography component='p' sx={{mt: 1.5, mr: 2}} variant='overline'>LOCALIZACIONES</Typography>
        }
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

    <Box sx={{display:'flex',justifyContent:'flex-end', alignItems:'flex-end',flexGrow: 2, minHeight: 25}}>
      <Chip label={
        <>
          <Typography variant='caption' sx={{fontWeight: 'bolder'}}>{t('version')}: </Typography>
          <Typography variant='caption' sx={{mr: 1}}>
            {
              // eslint-disable-next-line
          VERSION
            }
          </Typography>
          <Typography variant='caption' sx={{fontWeight: 'bolder'}}>{t('hash')}: </Typography>
          <Typography variant='caption'>
            {
              // eslint-disable-next-line
          HASH
            }
          </Typography>
        </>
      }/>
      <Geomatico/>
    </Box>
  </Stack>;
};

SidePanelContent.propTypes = {
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
  editMode: PropTypes.bool.isRequired,
  lastModePoint: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null])
  ]),
  selectedMode: PropTypes.string.isRequired,
  transportOptions: PropTypes.array.isRequired,
  transportType: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  onChangeEditMode: PropTypes.func.isRequired,
  onChangeModePoints: PropTypes.func,
  onChangeLastModePoint: PropTypes.func.isRequired,
  onChangePoints: PropTypes.func.isRequired,
  onChangeSelectedMode: PropTypes.func.isRequired,
  onHandleTransportationType: PropTypes.func.isRequired
};

export default SidePanelContent;
