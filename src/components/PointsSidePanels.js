import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DeletePointsModal from './DeletePointsModal';

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


function PointsSidePanels({ onChangePoints, onChangeModePoints, editMode, onChangeEditMode, allPoints, mode, lastModePoint, onChangeLastModePoint }) {
  const { t } = useTranslation();

  const [selectedMode, setSelectedMode] = useState('ADD_BLUE');
  const handlePointClick = (newMode) => {
    if (newMode) {
      setSelectedMode(newMode);
      onChangeModePoints(newMode);
    }
  };

  const handleEditIConClick = () => {
    onChangeLastModePoint(mode);
    onChangeEditMode(true);
    onChangeModePoints('');
  };
  const handleCancelEditIconClick = () => {
    onChangeModePoints(lastModePoint);
    setSelectedMode(lastModePoint);
    onChangeEditMode(false);

  };

  const [openModal, setOpenModal] = useState(false);
  
  const handleOpenModal = () => {
    setOpenModal(true);
  };


  const buttonGroupTypePoints = [
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
            border: theme => `2px solid ${theme.palette.primary.main}`,
            '&:hover': {
              border: theme => `2px solid ${theme.palette.primary.main}`,
              backgroundColor: theme => `${theme.palette.common.white}`,
            },
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
  const itemsEditMode =[
    {
      id: 'EDIT',
      content:
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <EditLocationOutlinedIcon fontSize='medium' /><Typography fontSize={14}  >{t('move')}</Typography>
      </Box>,
    },
    {
      id: 'REMOVE',
      content: 
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <DeleteOutlineOutlinedIcon fontSize='medium' /><Typography fontSize={14}  >{t('remove')}</Typography>
      </Box>

    }
    
  ];
  return (
    <>
      <ButtonGroup
        disabled={editMode}
        variant='outlined'
        color = {grey[900]}
        items={buttonGroupTypePoints}
        selectedItemId={selectedMode}
        onItemClick={handlePointClick}
        sx={customSx}

      />

      <Button
        variant='contained'
        color='secondary'
        fullWidth
        sx={{ mt: 8}}
        onClick={handleOpenModal}
        disabled={(!(allPoints.blue.length || allPoints.red.length))}>
        {t('removeButton')}
      </Button>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 4 }}>
        <Typography variant='body2' sx={{color: 'grey.600', fontStyle: 'italic'}}>{t('editDescription')}</Typography>
        <Button
          onClick={editMode ? handleCancelEditIconClick : handleEditIConClick}
          startIcon={editMode ? <CloseOutlinedIcon /> : <EditOutlinedIcon />}
          size='medium'
          sx={customSxButtonIcons}
          variant='outlined'
          fullWidth
          disabled={!(allPoints.blue.length || allPoints.red.length ||editMode)}
        >
          {editMode ? t('exitEdit') : t('edit')}
        </Button>
        {
          editMode &&  <ButtonGroup 
            variant='outlined'
            items={itemsEditMode}
            selectedItemId={mode}
            onItemClick={handlePointClick}
            color = {grey[900]}
            fullWidth= 'true'
          />
        }
      </Box>

      {
        openModal && <DeletePointsModal
          onChangeStateModal={setOpenModal}
          onChangePoints={onChangePoints}
        />
      }
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
  mode: PropTypes.string.isRequired,
  lastModePoint: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null])
  ]),
  onChangeLastModePoint: PropTypes.func.isRequired
};

export default PointsSidePanels;
