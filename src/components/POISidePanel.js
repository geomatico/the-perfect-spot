import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/AddLocationAlt';
import RemoveIcon from '@mui/icons-material/WrongLocation';

//GEOCOMPONENTS
import ButtonGroup from '@geomatico/geocomponents/ButtonGroup';

//UTILS
import {useTranslation} from 'react-i18next';
import {ADD_POI_MODE, REMOVE_POI_MODE} from '../config';
import Box from '@mui/material/Box';

const POISidePanel = ({mode, onPOIModeChanged}) => {
  const {t} = useTranslation();
  const handlePOICLick = newMode => newMode && onPOIModeChanged(newMode);

  const items = [
    {
      id: ADD_POI_MODE,
      content: <Tooltip title={t('add_poi')}><AddIcon/></Tooltip>
    },
    {
      id: REMOVE_POI_MODE,
      content: <Tooltip title={t('remove_poi')}><RemoveIcon/></Tooltip>
    },
  ];
  
  return <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center' my={2}>
    <Typography variant='overline'>{t('originPoints')}</Typography>
    <ButtonGroup
      variant="outlined"
      items={items}
      onItemClick={handlePOICLick}
      selectedItemId={mode}
      sx={{display: 'inline-block'}}
    />
  </Box>;
};

POISidePanel.propTypes = {
  onPOIModeChanged: PropTypes.func,
  mode: PropTypes.string,
};

POISidePanel.defaultProps = {
  mode: ADD_POI_MODE
};

export default POISidePanel;

