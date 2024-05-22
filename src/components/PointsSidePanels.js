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
import RemoveIcon from '@mui/icons-material/WrongLocation';
function PointsSidePanels({onChangePoints, onChangeModePoints}) {
  const { t } = useTranslation();
 
  const [selectedMode, setSelectedMode] = useState('BLUE-ADD_');
  const handlePointClick = (newMode) => {
    if (newMode) {
      setSelectedMode(newMode);
      const modeSort = newMode.split('-');
      const changeMode= modeSort[1] + modeSort[0];
      onChangeModePoints(changeMode);
    }
  };
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const buttonGroupItems = [
    {
      id: 'ADD_',
      content: 
        <Tooltip title={t('add_poi')}>
          <AddIcon />
        </Tooltip>
      
    },
    {
      id: 'REMOVE_',
      content: 
        <Tooltip title={t('remove_poi')}>
          <RemoveIcon />
        </Tooltip>
      
    },
  ];


  const categories = [
    {
      id: 'BLUE',
      description: <Typography>{t('originPoints')}</Typography>,
    },
    {
      id: 'RED',
      description: <Typography>{t('finalPoints')}</Typography>,
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
        buttonGroupVariant='outlined'
        categories={categories}
        buttonGroupItems={buttonGroupItems}
        selectedItemId={selectedMode}
        onItemClick={handlePointClick}
        sx={customSx}
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
};

export default PointsSidePanels;
