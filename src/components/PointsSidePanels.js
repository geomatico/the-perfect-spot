import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DeletePointsModal from './DeletePointsModal';
import {
  REMOVE,
  EDIT
} from '../config';
//GEOCOMPONENTS
import ButtonGroup from '@geomatico/geocomponents/ButtonGroup';
import grey from '@mui/material/colors/grey';
// UTILS
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/AddLocationAlt';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import Box from '@mui/material/Box';


function PointsSidePanels({ onChangePoints, onChangeModePoints, editMode, onChangeEditMode, allPoints, mode }) {
  const { t } = useTranslation();
  const [lastModePoint, setLastModePoint] = useState(null);

  const [selectedMode, setSelectedMode] = useState('ADD_BLUE');
  const handlePointClick = (newMode) => {
    if (newMode) {
      setSelectedMode(newMode);
      onChangeModePoints(newMode);
    }
  };

  const handleEditIConClick = () => {
    setLastModePoint(mode);
    onChangeEditMode(true);
    onChangeModePoints('');
  };
  const handleCancelEditIconClick = () => {
    onChangeEditMode(false);
    onChangeModePoints(lastModePoint);
  };

  const handleRemoveIconClick = () => onChangeModePoints(REMOVE);
  const handleEditLocationCLick = () => onChangeModePoints(EDIT);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const buttonGroupItems = [
    {
      id: 'ADD_BLUE',
      content:
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AddIcon /><Typography fontSize={14}  >{t('originPoints')}</Typography>
        </Box>

    },
    {
      id: 'ADD_RED',
      content:
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AddIcon /><Typography fontSize={14} >{t('finalPoints')}</Typography>
        </Box>

    },
  ];


  const handleButtonColor = (pointMode) => {
    if (pointMode.includes('RED')) {
      return {
        '& .ButtonGroup-button': editMode ? '' : {
          '&.Mui-selected': {
            border: theme => `2px solid ${theme.palette.secondary.main}`,
            backgroundColor: theme => `${theme.palette.common.white}`,
            '&:hover': {
              border: theme => `2px solid ${theme.palette.secondary.main}`,
              backgroundColor: theme => `${theme.palette.common.white}`,
            },
          },
          '&.Mui-disabled': {
            border: theme => `2px solid ${theme.palette.success.main}`,
          }
        },
        '& .ButtonGroup-buttonContent': editMode ? '' : {
          color: theme => `${theme.palette.secondary.main}`
        }
      };

    } else {
      return {
        '& .ButtonGroup-button': editMode ? '' : {
          '&.Mui-selected': {
            backgroundColor: theme => `${theme.palette.common.white} !important`,
          }
        },
        '& .ButtonGroup-buttonContent': editMode ? '' : {
          color: theme => `${theme.palette.primary.main}`
        }
      };
    }
  };


  const customSx = {
    ...handleButtonColor(selectedMode),
  };

  const customSxButtonIcons = {
    color: grey[900], border: `1px solid ${grey[900]}`,
    '&:hover': {
      border: `1px solid ${grey[900]}`
    }
  }; 

  return (
    <>
      <ButtonGroup
        disabled={editMode ? true : false}
        variant='outlined'
        items={buttonGroupItems}
        selectedItemId={selectedMode}
        onItemClick={handlePointClick}
        sx={customSx}

      />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 1, marginTop: 2 }}>
        {editMode ?
          <Button onClick={handleCancelEditIconClick}
            startIcon={<CloseOutlinedIcon />} size='small' sx={customSxButtonIcons} variant='outlined'>
            {t('exitEdit')}</Button>
          : <Button onClick={handleEditIConClick} startIcon={<EditOutlinedIcon />} sx={customSxButtonIcons}
            disabled={(allPoints.blue.length || allPoints.red.length) ? false : true} variant='outlined' size='small'>{t('edit')}</Button>}
      </Box>

      <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>

        {editMode &&
          <Button size='medium' sx={customSxButtonIcons}
            startIcon={<DeleteOutlineOutlinedIcon fontSize='medium' />} onClick={handleRemoveIconClick} variant='outlined'>{t('remove')}</Button>}

        {editMode &&
          <Button sx={customSxButtonIcons}
            startIcon={<EditLocationOutlinedIcon fontSize='medium' />}
            onClick={handleEditLocationCLick} variant='outlined' size='medium'>{t('move')}</Button>}
      </Box>


      <Button
        variant='contained'
        color='secondary'
        sx={{ mt: 2 }}
        onClick={handleOpenModal}
        disabled={(allPoints.blue.length || allPoints.red.length) ? false : true}
      >
        {t('removeButton')}
      </Button>
      {openModal && (
        <DeletePointsModal
          onChangeStateModal={setOpenModal}
          onChangePoints={onChangePoints}
        />
      )}

    </>

  );

}

PointsSidePanels.propTypes = {
  onChangePoints: PropTypes.func.isRequired,
  onChangeModePoints: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  onChangeEditMode: PropTypes.func.isRequired,
  allPoints: PropTypes.shape({
    red: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      lng: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
      name: PropTypes.string
    })).isRequired,
    blue: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      lng: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
      name: PropTypes.string
    })).isRequired,
  }).isRequired,
  mode: PropTypes.string.isRequired
};

export default PointsSidePanels;
