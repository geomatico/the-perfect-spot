import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import DeletePointsModal from './DeletePointsModal';
import {
  REMOVE,
  EDIT
} from '../config';
//GEOCOMPONENTS
import ButtonGroupList from '@geomatico/geocomponents/ButtonGroupList';
// UTILS
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/AddLocationAlt';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';


function PointsSidePanels({onChangePoints, onChangeModePoints, editMode, onChangeEditMode}) {
  const { t } = useTranslation();
 
  const [selectedMode, setSelectedMode] = useState('Points-ADD_BLUE');
  const handlePointClick = (newMode) => {
    if (newMode) {
      const splitMode = newMode.split('-');
      setSelectedMode(newMode);
      onChangeModePoints(splitMode[1]);
    }
  };

  const handleEditIConClick = () => {
    onChangeEditMode(true);
    onChangeModePoints('');
  };
  const handleCancelEditIconClick = () => {
    onChangeEditMode(false);
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
        <Tooltip title={t('add_poi')}>
          <AddIcon />
        </Tooltip>
      
    },
    {
      id: 'ADD_RED',
      content: 
        <Tooltip title={t('add_origin')}>
          <AddIcon />
        </Tooltip>
      
    },
  ];




  const categories = [
    {
      id: 'Points',
      description: <Typography>{t('addPoint')}</Typography>,
    },
  ];

  const handleButtonColor = (pointMode) => {
    if (pointMode.includes('RED')) {
      return {
        '& .ButtonGroup-button':editMode ? '' : {
          '&.Mui-selected': {
            border: theme => `2px solid ${theme.palette.secondary.main}`,
            backgroundColor: theme => `${theme.palette.common.white}`,
            '&:hover': {
              border: theme =>  `2px solid ${theme.palette.secondary.main}`,
              backgroundColor: theme => `${theme.palette.common.white}`,
            },
          },
          '&.Mui-disabled': {
            border: theme => `2px solid ${theme.palette.success.main}`,
            backgroundColor:'red',
          }
        },
        '& .ButtonGroup-buttonContent': editMode ? '' : {
          color: theme => `${theme.palette.secondary.main}`
        }
      };
      
    }else{
      return {
        '& .ButtonGroup-button': {
          '&.Mui-selected': {
            backgroundColor: theme => `${theme.palette.common.white} !important`,
          }
        },
        '& .ButtonGroup-buttonContent': {
          color: theme => `${theme.palette.primary.main}`
        }
      };
    }
  };
  

  const customSx = {
    ...handleButtonColor(selectedMode),
  };
  
  return (
    <>
      <ButtonGroupList
        disabled = {editMode ? true : false}
        buttonGroupVariant='outlined'
        categories={categories}
        buttonGroupItems={buttonGroupItems}
        selectedItemId={selectedMode}
        onItemClick={handlePointClick}
        sx={customSx}
      />
      <Box sx={{display:'flex', flexDirection:'column' ,alignItems:'end',gap:1}}> 
        {editMode ? <Button onClick={handleCancelEditIconClick} size='small' sx={{margin:0}}><CancelIcon /></Button>  : <Button onClick={handleEditIConClick} size='small'><EditIcon/></Button> } 
        {editMode && <Button onClick={handleRemoveIconClick} variant='outlined'>borra un punto</Button>}
        {editMode && <Button onClick={handleEditLocationCLick} variant='outlined'>Mueve un punto</Button>}

      </Box>
      <Button
        variant='contained'
        color='secondary'
        sx={{ mt: 2 }}
        onClick={handleOpenModal}
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
  onChangeEditMode: PropTypes.func.isRequired
};

export default PointsSidePanels;
