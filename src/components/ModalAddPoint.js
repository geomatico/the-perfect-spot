import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import  PropTypes  from 'prop-types';
import React from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import {useTranslation} from 'react-i18next';
import Button from '@mui/material/Button';
 
const inputContainerStyles = {
  display: 'flex',
  flexDirection:'column',
  alignItems:'center',
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
const  ModalAddPoint = ({pointType,pointName,onChangePointName,onSavePointName,onClose}) => {
  const {t} = useTranslation();
  const handleChangePoiName = pointName => onChangePointName(pointName);
  const handleSaveName = () => onSavePointName();

  const buttonColor = pointType === 'ADD_POI' ? 'primary' : 'secondary';

 
  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={inputContainerStyles}>
        <Typography id="modal-modal-title" variant="body1" sx={{textAlign:'center'}}> 
          {pointType === 'ADD_POI' ? t('insertPOIName') : t('insertFLATName')}
        </Typography>
        <TextField
          error={!pointName}
          helperText={!pointName ? t('mandatoryField') : ''}
          sx={{mt: 2}}
          value={pointName}
          onChange={(e) => handleChangePoiName(e.target.value)}
          variant="outlined"
        />
        <Box mt={2}>
          <Button variant="contained" color={buttonColor} onClick={handleSaveName}>{t('done')}</Button>
        </Box>
      </Box>
    </Modal>
  );
};
ModalAddPoint.propTypes = {
  pointType: PropTypes.oneOf(['ADD_POI','ADD_FLAT']).isRequired,
  pointName: PropTypes.string.isRequired,
  onChangePointName: PropTypes.func.isRequired,
  onSavePointName: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
export default ModalAddPoint;