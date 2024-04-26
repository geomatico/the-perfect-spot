import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import {ADD_RED_MODE, REMOVE_RED_MODE} from '../config';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import DeletePointsModal from './DeletePointsModal';
//GEOCOMPONENTS
import ButtonGroup from '@geomatico/geocomponents/ButtonGroup';

//UTILS
import {useTranslation} from 'react-i18next';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/AddLocationAlt';
import RemoveIcon from '@mui/icons-material/WrongLocation';


const FlatSidePanel = ({mode, onRedModeChanged, onChangePoints}) => {
  const {t} = useTranslation();
  const handleFlatCLick = newMode => newMode && onRedModeChanged(newMode);
  const [openModal,setOpenModal] = useState(false);
  const handleOpenModal =()=> {
    setOpenModal(true);
  };

  const items = [
    {
      id: ADD_RED_MODE,
      content: <Tooltip title={t('add_origin')}><AddIcon/></Tooltip>
    },
    {
      id: REMOVE_RED_MODE,
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
    <Button variant='contained' color='secondary' sx={{mt: 2}} onClick={handleOpenModal}>BORRAR TODOS LOS PUNTOS</Button>
    {openModal && <DeletePointsModal onChangeStateModal={setOpenModal} onChangePoints={onChangePoints}/>}
  </>;
};

FlatSidePanel.propTypes = {
  onRedModeChanged: PropTypes.func,
  mode: PropTypes.string,
  onChangePoints: PropTypes.func.isRequired
};

FlatSidePanel.defaultProps = {
  mode: ADD_RED_MODE
};

export default FlatSidePanel;

