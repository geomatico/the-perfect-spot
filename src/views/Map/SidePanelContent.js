import React from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import BaseMapList from '@geomatico/geocomponents/BaseMapList';
import Box from '@mui/material/Box';
import styled from '@mui/styles/styled';

import SectionTitle from '../../components/SectionTitle';
import Logos from '../../components/Logos';

import {ADD_MODE, MAPSTYLES, REMOVE_MODE} from '../../config';
import ButtonGroup from '@geomatico/geocomponents/ButtonGroup';

import AddIcon from '@mui/icons-material/AddLocationAlt';
import RemoveIcon from '@mui/icons-material/WrongLocation';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {useTranslation} from 'react-i18next';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '8px',
});

const SidePanelContent = ({mapStyle, onMapStyleChanged, mode, onModeChanged}) => {

  const {t} = useTranslation();

  const handleItemCLick = newMode => newMode && onModeChanged(newMode);

  return <Stack sx={{height: '100%', overflow: 'hidden'}}>
    <ScrollableContent>
      <Typography paragraph variant='h5'>{t('p0')}</Typography>
      <Typography paragraph>{t('p1')}</Typography>
      <Typography paragraph>{t('p2')}</Typography>

      <SectionTitle titleKey='editor'/>
      <Grid mt={3} mb={3} justifyContent='center' container>
        <Grid item>
          <ButtonGroup
            variant="outlined"
            items={[
              {id: ADD_MODE, content: <><AddIcon/><Typography sx={{ml: 0}}>{t('add')}</Typography></>, label: t('add')},
              {id: REMOVE_MODE, content: <><RemoveIcon/><Typography sx={{ml: 0}}>{t('remove')}</Typography></>, label: t('remove')},
            ]}
            onItemClick={handleItemCLick}
            selectedItemId={mode}
          />
        </Grid>
      </Grid>
      <SectionTitle titleKey='baseMap'/>
      <Grid mt={2} mb={2}>
        <BaseMapList
          styles={MAPSTYLES.map(s => ({...s, label: t(s.label)}))}
          selectedStyleId={mapStyle}
          onStyleChange={onMapStyleChanged}
        />
      </Grid>
    </ScrollableContent>
    <Logos/>
  </Stack>;
};

SidePanelContent.propTypes = {
  mapStyle: PropTypes.string.isRequired,
  onMapStyleChanged: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  onModeChanged: PropTypes.func.isRequired
};

export default SidePanelContent;
