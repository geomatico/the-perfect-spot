import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const ModalReload = ({ open, onClose, variant }) => {
  // this function is used to delete the URL
  const onDeletePoints = () => {
    window.history.replaceState({},document.title,document.location.pathname);
    window.location.reload();
         
  };

  // function is used to close the modal
  const handleClose = () => onClose();
  
  const dialogContentSx = {mt: 2, textAlign: 'center'};
  const dialogActionsSx ={m:'auto'};

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={dialogContentSx}>Borrar Puntos</DialogTitle>
      <DialogContent>
        <p>¿Quieres borrar los puntos?</p>
      </DialogContent>
      <DialogActions>
        <Button variant={variant} onClick={onDeletePoints} sx={dialogActionsSx}>Aceptar</Button>
        <Button variant={variant} onClick={handleClose} sx={dialogActionsSx} >Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
};

ModalReload.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  variant: PropTypes.string.isRequired
};



export default ModalReload;