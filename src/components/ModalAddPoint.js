import { Box, Typography } from '@mui/material';
import  PropTypes  from 'prop-types';
import React from 'react';
import {Modal, TextField} from '@mui/material';
import {useTranslation} from 'react-i18next';
import Button from '@mui/material/Button';

 
const inputContainerStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  m: 4
};
const  ModalAddPoint = ({mode,text,openModal,onHandleChangeText,onHandleSaveName,onHandleClose}) => {
  const {t} = useTranslation();
  console.log('openMODal',openModal);
  console.log('mode',mode);
  const handleClose = () => onHandleClose();
  
  const handleChangeText = text => onHandleChangeText(text);
  
  const handleSaveName = () => onHandleSaveName();

  const buttonColors= {
    color : mode === 'ADD_POI' ? 'blue': 'red',
    borderColor: mode === 'ADD_POI'? 'blue': 'red'
  };
 
  return (
    <Modal open={openModal} onClose={handleClose}>
      <Box sx={inputContainerStyles}>
        <Typography id="modal-modal-title" variant="body1"> 
          {mode == 'ADD_POI' ? t('insertPOIName') : t('insertFLATName')}
        </Typography>
        <TextField
          error={!text}
          helperText={!text ? t('mandatoryField') : ''}
          sx={{mt: 2}}
          value={text}
          onChange={(element) => handleChangeText(element)}
          variant="outlined"
        />
        <Box mt={2}>
          <Button variant="outlined" sx={buttonColors} onClick={handleSaveName}>{t('done')}</Button>
        </Box>
      </Box>
    </Modal>
  );
};
ModalAddPoint.propTypes = {
  mode: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  openModal: PropTypes.bool.isRequired,
  onHandleChangeText: PropTypes.func.isRequired,
  onHandleSaveName: PropTypes.func.isRequired,
  onHandleClose: PropTypes.func.isRequired
};
export default ModalAddPoint;