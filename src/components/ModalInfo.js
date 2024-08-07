import React from 'react';
import {Dialog,DialogContent} from '@mui/material';
import PropTypes from 'prop-types';

const paperProps = {sx: {height: 'auto', pb: 1}};

const dialogContentSx = {mt: 2, textAlign: 'center'};

const ModalInfo = ({onHandleCloseModalInfo}) => { 
  return <Dialog open={true} onClose={onHandleCloseModalInfo} fullWidth PaperProps={paperProps}>
    <DialogContent sx={dialogContentSx}>
      <b>¡Encuentra el lugar mejor comunicado de entre varios!</b><br/>El <b>perfect spot</b> en base a tus sitios importantes.
      <ul>
        <li>¿Tienes varias opciones para tu próxima vivienda y quieres que quede cerca de tu trabajo, de tus clases de yoga, de donde viven tus padres?</li>
        <li>¿Organizas una comida y no sabes qué restaurante de los posibles spots les va mejor a tus familiares y amigos?</li>
        <li>¿Dudas entre tres gimnasios para apuntarte con unos amigos y quieres que les quede cerca a todos?</li>
      </ul>
    </DialogContent>
  </Dialog>;
};

ModalInfo.propTypes = {
  onHandleCloseModalInfo : PropTypes.func.isRequired
};

export default ModalInfo;