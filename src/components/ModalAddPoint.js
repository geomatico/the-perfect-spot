import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import  PropTypes  from 'prop-types';
import React from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import {useTranslation} from 'react-i18next';
import Button from '@mui/material/Button';
import red from '@mui/material/colors/red';
import blue from '@mui/material/colors/blue';
 
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
const  ModalAddPoint = ({poiType,poiName,onChangePoiName,onSavePoiName,onClose}) => {
  const {t} = useTranslation();
  const handleClose = () => onClose();
  const handleChangePoiName = poiName => onChangePoiName(poiName);
  const handleSaveName = () => onSavePoiName();

  const buttonColors= {
    color : poiType === 'ADD_POI' ? blue[800]: red[500],
    borderColor: poiType === 'ADD_POI'? blue[800]: red[500]
  };
 
  return (
    <Modal open={true} onClose={handleClose}>
      <Box sx={inputContainerStyles}>
        <Typography id="modal-modal-title" variant="body1"> 
          {poiType == 'ADD_POI' ? t('insertPOIName') : t('insertFLATName')}
        </Typography>
        <TextField
          error={!poiName}
          helperText={!poiName ? t('mandatoryField') : ''}
          sx={{mt: 2}}
          value={poiName}
          onChange={(e) => handleChangePoiName(e)}
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
  poiType: PropTypes.string.isRequired,
  poiName: PropTypes.string.isRequired,
  onChangePoiName: PropTypes.func.isRequired,
  onSavePoiName: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
export default ModalAddPoint;