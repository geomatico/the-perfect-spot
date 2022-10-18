import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/AddLocationAlt';
import RemoveIcon from '@mui/icons-material/WrongLocation';
import Button from '@mui/material/Button';

//GEOCOMPONENTS
import ButtonGroup from '@geomatico/geocomponents/ButtonGroup';

//UTILS
import {useTranslation} from 'react-i18next';
import {ADD_POI_MODE, REMOVE_POI_MODE} from '../config';

const POISidePanel = ({mode, onPOIModeChanged, onPhaseChanged}) => {
  const {t} = useTranslation();
  const handlePOICLick = newMode => newMode && onPOIModeChanged(newMode);

  return <>
    <Typography paragraph variant='subtitle1' sx={{textTransform: 'uppercase'}}>{t('p0')}</Typography>
    <Stack>
      <ButtonGroup
        variant="outlined"
        items={[
          {
            id: ADD_POI_MODE,
            content: <Tooltip title={t('add_poi')}><AddIcon/></Tooltip>
          },
          {
            id: REMOVE_POI_MODE,
            content: <Tooltip title={t('remove_poi')}><RemoveIcon/></Tooltip>
          },

        ]}
        onItemClick={handlePOICLick}
        selectedItemId={mode}
        sx={{display: 'inline-block'}}
      />
      <Button variant='contained' sx={{mt: 2}} onClick={onPhaseChanged}>FINALIZAR</Button>
    </Stack>
  </>;
};

POISidePanel.propTypes = {
  onPhaseChanged: PropTypes.func,
  onPOIModeChanged: PropTypes.func,
  mode: PropTypes.string,
};

POISidePanel.defaultProps = {
  mode: ADD_POI_MODE
};

export default POISidePanel;

