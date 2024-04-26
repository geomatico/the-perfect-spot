import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import {useTranslation} from 'react-i18next';

function DeletePointsModal({ onChangePoints, onChangeStateModal }) {
  const {t} = useTranslation();
  const handleDeletePoints = () => {
    onChangePoints({ red: [], blue: [] });
    localStorage.removeItem('ThePerfectSpot');
    handleClose();
  };
  const handleClose = () => {
    onChangeStateModal(false);
  };

  return (
    <>
      <Dialog open={true} onClose={handleClose}>
        <DialogTitle>{t('deleteAllPoints')}</DialogTitle>
        <DialogActions sx={{ justifyContent: 'center'}}>
          <Button variant='outlined' onClick={handleDeletePoints}>
            {t('delete')}
          </Button>
          <Button variant='outlined' onClick={handleClose}>
            {t('cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
DeletePointsModal.propTypes = {
  onChangePoints: PropTypes.func.isRequired,
  onChangeStateModal: PropTypes.func.isRequired,
};
export default DeletePointsModal;
