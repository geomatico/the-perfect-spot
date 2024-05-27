import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';

function ModalEditPoint({allPoints, onChangePoints, indexPointSelect, onClose, mode}) {
  const pointUpdated = mode === 'blue' ? { ...allPoints.blue[indexPointSelect] }: { ...allPoints.red[indexPointSelect] };
  const [value, setValue] = useState(pointUpdated.name);
  const handleChangeName = name => setValue(name);
  const {t} = useTranslation();
  const buttonColor = mode === 'blue' ? 'primary' : 'secondary';
  const handleSaveName = () => {
    if (mode === 'blue') {
      const bluePointsUpdated = allPoints.blue.map((point, index) => {
        if (index === indexPointSelect) {
          return { ...point, name: value };
        }
        return { ...point };
      });
      onChangePoints({ ...allPoints, blue: bluePointsUpdated });
    } else {
      const redPointsUpdated = allPoints.red.map((point, index) => {
        if (index === indexPointSelect) {
          return { ...point, name: value };
        }
        return point;
      });
      onChangePoints({ ...allPoints, red: redPointsUpdated });
    }
    onClose();
  };
  const modalStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    m: 4,
  };
  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={modalStyles}>
        <Typography>{mode === 'blue'? t('editNameBluePoint'):t('editNameRedPoint')}</Typography>
        <TextField sx={{mt:2}}
          error={!pointUpdated.name}
          value={value}
          onChange={(e) => handleChangeName(e.target.value)}
        />
        <Box sx={{mt:2}}>
          <Button variant='contained' color={buttonColor} onClick={handleSaveName}>
            {t('saveNamePoint')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

ModalEditPoint.propTypes = {
  allPoints: PropTypes.shape({
    red: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        lng: PropTypes.number.isRequired,
        lat: PropTypes.number.isRequired,
        name: PropTypes.string,
      })
    ).isRequired,
    blue: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        lng: PropTypes.number.isRequired,
        lat: PropTypes.number.isRequired,
        name: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  onChangePoints: PropTypes.func.isRequired,
  indexPointSelect: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
};

export default ModalEditPoint;
