import React from 'react';
import PropTypes  from 'prop-types';

import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import {useTranslation} from 'react-i18next';
import Box from '@mui/material/Box';

const inputContainerStyles = {
  display: 'flex',
  flexDirection:'column',
  justifyContent: 'space-between',
  gap: 2
};

const  ModalAddPoint = ({pointType, pointName, onChangePointName, onSavePointName, onClose}) => {
  const {t} = useTranslation();
  const handleChangePoiName = pointName => onChangePointName(pointName);
  const handleSaveName = () => onSavePointName();

  const buttonColor = pointType === 'ADD_BLUE' ? 'primary' : 'secondary';
  
  return <Dialog open={true} onClose={onClose} fullWidth>
    <DialogContent sx={inputContainerStyles}>
      <Box>
        <Typography id="modal-modal-title" variant="body1">
          {pointType === 'ADD_BLUE' ? t('insertBlueName') : t('insertRedName')}
        </Typography>
        <Typography variant="body2" sx={{fontStyle: 'italic', color: 'text.secondary'}} gutterBottom>
          {pointType === 'ADD_BLUE' ? t('insertBlueExample') : t('insertRedExample')}
        </Typography>
      </Box>
      
      <TextField
        error={!pointName}
        helperText={!pointName ? t('mandatoryField') : ''}
        size='small'
        color={buttonColor}
        autoFocus={true}
        onKeyDown={(e)=>{
          if (e.key === 'Enter') onSavePointName();
        }}
        placeholder={t('point')}
        onChange={(e) => handleChangePoiName(e.target.value)}
        variant="outlined"
      />
      <Button variant="contained" color={buttonColor} onClick={handleSaveName} size='medium'>{t('done')}</Button>
    </DialogContent>
  </Dialog>;
};

ModalAddPoint.propTypes = {
  pointType: PropTypes.oneOf(['ADD_BLUE','ADD_RED']).isRequired,
  pointName: PropTypes.string.isRequired,
  onChangePointName: PropTypes.func.isRequired,
  onSavePointName: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ModalAddPoint;