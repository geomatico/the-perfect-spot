import React, {useState} from 'react';
import {Dialog,DialogContent} from '@mui/material';

const paperProps = {sx: {height: 'auto', pb: 1}};

const dialogContentSx = {mt: 2, textAlign: 'center'};

const ModalInfo = () => {
  const [isOpen, setOpen] = useState(true);

  const handleClose = () => setOpen(false); //onClose();

  return <Dialog open={isOpen} onClose={handleClose} fullWidth PaperProps={paperProps}>
    <DialogContent sx={dialogContentSx}>
      TODO
    </DialogContent>
  </Dialog>;
};

export default ModalInfo;