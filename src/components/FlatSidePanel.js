import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import {ADD_FLAT_MODE, REMOVE_FLAT_MODE} from '../config';
import Tooltip from '@mui/material/Tooltip';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

//GEOCOMPONENTS
import ButtonGroup from '@geomatico/geocomponents/ButtonGroup';
//BIKENTA

//UTILS
import {useTranslation} from 'react-i18next';


const FlatSidePanel = ({mode, onFlatModeChanged, onPhaseChanged, onCalculateRoutes, onCalculateDirections}) => {
  const {t} = useTranslation();
  const handleFlatCLick = newMode => newMode && onFlatModeChanged(newMode);

  const handleOnCalculate =()=> {
    onCalculateRoutes();
    onCalculateDirections();
  };

  return <>
    <Typography paragraph variant='subtitle1' sx={{textTransform: 'uppercase',  mt: 4}}>{t('p1')}</Typography>
    <Stack>
      <ButtonGroup
        variant="outlined"
        color='#d70f0f'
        items={[
          {
            id: ADD_FLAT_MODE,
            content: <Tooltip title={t('add_origin')}><HomeIcon/></Tooltip>
          },
          {
            id: REMOVE_FLAT_MODE,
            content: <Tooltip title={t('remove_origin')}><HomeOutlinedIcon/></Tooltip>
          }
        ]}
        onItemClick={handleFlatCLick}
        selectedItemId={mode}
        sx={{display: 'inline-block', color: 'red'}}
      />
      <Button variant='contained' color='secondary' sx={{mt: 2}} onClick={handleOnCalculate}>CALCULAR RUTAS</Button>
      <Button variant='outlined' color='primary' sx={{mt: 2}} onClick={onPhaseChanged}>VOLVER ATRÁS</Button>
    </Stack>
  </>;
};

FlatSidePanel.propTypes = {
  onFlatModeChanged: PropTypes.func,
  onPhaseChanged: PropTypes.func,
  onCalculateRoutes: PropTypes.func,
  onCalculateDirections: PropTypes.func,
  mode: PropTypes.string
};

FlatSidePanel.defaultProps = {
  mode: ADD_FLAT_MODE
};

export default FlatSidePanel;

