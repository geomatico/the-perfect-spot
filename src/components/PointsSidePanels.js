import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import {
  ADD_RED_MODE,
  REMOVE_RED_MODE,
  ADD_BLUE_MODE,
  REMOVE_BLUE_MODE,
} from '../config';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import DeletePointsModal from './DeletePointsModal';
//GEOCOMPONENTS
import ButtonGroupList from '@geomatico/geocomponents/ButtonGroupList';
// UTILS
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/AddLocationAlt';
import RemoveIcon from '@mui/icons-material/WrongLocation';

function PointsSidePanels({onChangePoints, onChangeModePoints }) {
  const { t } = useTranslation();
 
  const [selectedMode, setSelectedMode] = useState('bluePoints-ADD_BLUE');
  const handleFlatClick = (newMode) => {
    if (newMode) {
      setSelectedMode(newMode);
      const changeMode = newMode.slice(newMode.indexOf('-') + 1);
      onChangeModePoints(changeMode);
    }
  };
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const buttonGroupItemsBlue = [
    {
      id: ADD_BLUE_MODE,
      content: 
        <Tooltip title={t('add_poi')}>
          <AddIcon />
        </Tooltip>
      
    },
    {
      id: REMOVE_BLUE_MODE,
      content: 
        <Tooltip title={t('remove_poi')}>
          <RemoveIcon />
        </Tooltip>
      
    },
  ];

  const buttonGroupItemsRed = [
    {
      id: ADD_RED_MODE,
      content: 
        <Tooltip title={t('add_origin')}>
          <AddIcon />
        </Tooltip>
      
    },
    {
      id: REMOVE_RED_MODE,
      content: 
        <Tooltip title={t('remove_origin')}>
          <RemoveIcon />
        </Tooltip>
      
    },
  ];

  const categoriesBlue = [
    {
      id: 'bluePoints',
      description: <Typography>{t('originPoints')}</Typography>,
    },
  ];

  const categoriesRed = [
    {
      id: 'redPoints',
      description: <Typography>{t('finalPoints')}</Typography>,
    },
  ];

  return (
    <>
      <ButtonGroupList
        buttonGroupVariant='outlined'
        categories={categoriesBlue}
        buttonGroupItems={buttonGroupItemsBlue}
        selectedItemId={selectedMode}
        onItemClick={handleFlatClick}
      />

      <ButtonGroupList
        buttonGroupVariant='outlined'
        buttonGroupColor='#d70f0f'
        categories={categoriesRed}
        buttonGroupItems={buttonGroupItemsRed}
        selectedItemId={selectedMode}
        onItemClick={handleFlatClick}
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
