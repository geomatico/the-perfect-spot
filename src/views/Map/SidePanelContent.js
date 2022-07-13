import React from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import BaseMapList from '@geomatico/geocomponents/BaseMapList';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import styled from '@mui/styles/styled';

import SectionTitle from '../../components/SectionTitle';

import {ADD_ORIGIN_MODE, ADD_POI_MODE, MAPSTYLES, REMOVE_ORIGIN_MODE, REMOVE_POI_MODE} from '../../config';
import ButtonGroup from '@geomatico/geocomponents/ButtonGroup';

import AddIcon from '@mui/icons-material/AddLocationAlt';
import RemoveIcon from '@mui/icons-material/WrongLocation';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {useTranslation} from 'react-i18next';
import {Tooltip} from '@mui/material';
import Geomatico from '../../components/Geomatico';
import {getInfo} from '../../utils/ors';
import {useParams} from 'react-router-dom';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '8px',
});
const SidePanelContent = ({mapStyle, onMapStyleChanged, mode, onModeChanged}) => {

  const {t} = useTranslation();

  const handleItemCLick = newMode => newMode && onModeChanged(newMode);

  const {points: strPoints, originPoints: strOriginPoints} = useParams();
  const destinations = strPoints ? JSON.parse(strPoints) : [];
  const locations = strOriginPoints ? JSON.parse(strOriginPoints) : [];

  const calculate = () => {
    getInfo(locations, destinations).then(data => console.log('data', data));
  };

  /*  const calculateRoutes =()=> {
      getDirections().then(lines => console.log('lines',lines));
    }*/

  return <Stack sx={{
    height: '100%',
    overflow: 'hidden'
  }}>
    <ScrollableContent>
      <Typography paragraph variant='h5'>{t('p0')}</Typography>
      <SectionTitle titleKey='editor'/>
      <Grid mt={3} mb={3} justifyContent='center' container>
        <Grid item>
          <ButtonGroup
            variant="outlined"
            items={[
              {
                id: ADD_POI_MODE,
                content: <Tooltip title={t('add_poi')}><AddIcon/></Tooltip>
              },
              {
                id: REMOVE_POI_MODE,
                content: <Tooltip title={t('remove_poi')}><RemoveIcon/></Tooltip>
              },
              {
                id: ADD_ORIGIN_MODE,
                content: <Tooltip title={t('add_origin')}><HomeIcon/></Tooltip>
              },
              {
                id: REMOVE_ORIGIN_MODE,
                content: <Tooltip title={t('remove_origin')}><HomeOutlinedIcon/></Tooltip>
              },
            ]}
            onItemClick={handleItemCLick}
            selectedItemId={mode}
            /*sx={{
              '&:last-child': {
                border: 2
              }
            }}*/
          />
        </Grid>
        <Grid item>
          <Button variant='contained' sx={{mt: 2}} onClick={calculate}>CALCULAR</Button>

          {/*
          <Button variant='contained' sx={{mt: 2}} onClick={calculateRoutes}>CALCULAR RUTAS</Button>
*/}

        </Grid>
      </Grid>
      <SectionTitle titleKey='baseMap'/>
      <Grid mt={2} mb={2}>
        <BaseMapList
          styles={MAPSTYLES.map(s => ({
            ...s,
            label: t(s.label)
          }))}
          selectedStyleId={mapStyle}
          onStyleChange={onMapStyleChanged}
        />
      </Grid>
    </ScrollableContent>
    <Geomatico/>
  </Stack>;
};

SidePanelContent.propTypes = {
  mapStyle: PropTypes.string.isRequired,
  onMapStyleChanged: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  onModeChanged: PropTypes.func.isRequired,
  /*
    onDirectionsChange: PropTypes.func.isRequired,
  */
};

export default SidePanelContent;
