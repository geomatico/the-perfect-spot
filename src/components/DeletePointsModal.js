import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
function DeletePointsModal({ onChangePoints, onChangeStateModal }) {
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
        <DialogTitle>{'¿Quieres borrar todos los puntos?'}</DialogTitle>
        <DialogActions sx={{ justifyContent: 'center'}}>
          <Button variant='outlined' onClick={handleDeletePoints}>
            Borrar
          </Button>
          <Button variant='outlined' onClick={handleClose}>
            Cancelar
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
