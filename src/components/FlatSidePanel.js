import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import {ADD_FLAT_MODE, REMOVE_FLAT_MODE} from '../config';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

//GEOCOMPONENTS
import ButtonGroup from '@geomatico/geocomponents/ButtonGroup';
//BIKENTA

//UTILS
import {useTranslation} from 'react-i18next';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/AddLocationAlt';
import RemoveIcon from '@mui/icons-material/WrongLocation';


const FlatSidePanel = ({mode, onFlatModeChanged, onCalculateRoutes, onCalculateDirections}) => {
  const {t} = useTranslation();
  const handleFlatCLick = newMode => newMode && onFlatModeChanged(newMode);

  const handleOnCalculate =()=> {
    onCalculateRoutes();
    onCalculateDirections();
  };

  const items = [
    {
      id: ADD_FLAT_MODE,
      content: <Tooltip title={t('add_origin')}><AddIcon/></Tooltip>
    },
    {
      id: REMOVE_FLAT_MODE,
      content: <Tooltip title={t('remove_origin')}><RemoveIcon/></Tooltip>
    }
  ];
  
  return <>
    <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center' my={2}>
      <Typography variant='overline'>{t('finalPoints')}</Typography>
      <ButtonGroup
        variant="outlined"
        color='#d70f0f'
        items={items}
        onItemClick={handleFlatCLick}
        selectedItemId={mode}
        sx={{display: 'inline-block', color: 'red'}}
      />
    </Box>
    <Button variant='contained' color='secondary' sx={{mt: 2}} onClick={handleOnCalculate}>{t('find_the')} PERFECT SPOT!</Button>
  </>;
};

FlatSidePanel.propTypes = {
  onFlatModeChanged: PropTypes.func,
  onCalculateRoutes: PropTypes.func,
  onCalculateDirections: PropTypes.func,
  mode: PropTypes.string
};

FlatSidePanel.defaultProps = {
  mode: ADD_FLAT_MODE
};

export default FlatSidePanel;

