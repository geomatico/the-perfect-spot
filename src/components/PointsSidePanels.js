import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import DeletePointsModal from './DeletePointsModal';
//GEOCOMPONENTS
import ButtonGroupList from '@geomatico/geocomponents/ButtonGroupList';
// UTILS
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/AddLocationAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function PointsSidePanels({onChangePoints, onChangeModePoints, mode}) {
  const { t } = useTranslation();
 
  const [selectedMode, setSelectedMode] = useState('Points-ADD_BLUE');
  const handlePointClick = (newMode) => {
    if (newMode) {
      const splitMode = newMode.split('-');
      setSelectedMode(newMode);
      onChangeModePoints(splitMode[1]);
    }
  };

  const handlePointClickEdit = (newMode) =>{
    if (newMode) {
      setSelectedMode(newMode);
      newMode === 'Edit-REMOVE' ?
        onChangeModePoints('REMOVE'): onChangeModePoints('EDIT');
      
    }
  };
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

  const buttonGroupEdit = [
    {
      id: 'EDIT',
      content:
       <Tooltip title={'editar'} >
         <EditIcon />
       </Tooltip>

    },
    {
      id:'REMOVE',
      content: 
        <Tooltip title={'ELimina'}>
          <DeleteIcon />
        </Tooltip>
    }
  ];

  const categoriesGroupEdit =[
    {
      id: 'Edit',
      description: <Typography> </Typography>,
    }
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
        '& .ButtonGroup-button': {
          '&.Mui-selected': {
            border: theme => `2px solid ${theme.palette.secondary.main}`,
            backgroundColor: theme => `${theme.palette.common.white}`,
            '&:hover': {
              border: theme =>  `2px solid ${theme.palette.secondary.main}`,
              backgroundColor: theme => `${theme.palette.common.white}`,
            }
          }
        },
        '& .ButtonGroup-buttonContent': {
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
        disabled = {mode === 'EDIT' ? true : false}
        buttonGroupVariant='outlined'
        categories={categories}
        buttonGroupItems={buttonGroupItems}
        selectedItemId={selectedMode}
        onItemClick={handlePointClick}
        sx={customSx}
      />

      <ButtonGroupList 
        buttonGroupVariant = 'outlined'
        categories ={categoriesGroupEdit}
        buttonGroupItems={buttonGroupEdit}
        selectedItemId = {selectedMode}
        onItemClick= {handlePointClickEdit}
      />
     
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
  mode: PropTypes.string.isRequired
};

export default PointsSidePanels;
