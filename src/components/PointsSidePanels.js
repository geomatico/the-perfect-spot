import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DeletePointsModal from './DeletePointsModal';

//GEOCOMPONENTS
import ButtonGroup from '@geomatico/geocomponents/ButtonGroup';
import grey from '@mui/material/colors/grey';
// UTILS
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/AddLocationAlt';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import Box from '@mui/material/Box';
import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@mui/material';


function PointsSidePanels({ onChangePoints, onChangeModePoints, editMode, onChangeEditMode, allPoints, mode, lastModePoint, onChangeLastModePoint, selectedMode, onChangeSelectedMode }) {
  const { t } = useTranslation();

  const handlePointClick = (newMode) => {
    if (newMode) {
      onChangeSelectedMode(newMode);
      onChangeModePoints(newMode);
    }
  };

  const handleEditIConClick = () => {
    onChangeLastModePoint(mode);
    onChangeEditMode(true);
    onChangeModePoints('EDIT');
  };
  const handleCancelEditIconClick = () => {
    onChangeModePoints(lastModePoint);
    onChangeSelectedMode(lastModePoint);
    onChangeEditMode(false);
  };

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const theme = useTheme();
  const widescreen = useMediaQuery(theme.breakpoints.up('lg'), { noSsr: true });

  const customFontSizeSx = (theme) => ({
    fontSize: 14,
    [theme.breakpoints.down('sm')]: {
      fontSize: 13
    }
  });

  const buttonGroupTypePoints = [
    {
      id: 'ADD_BLUE',
      content:
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1}}>
          <AddIcon /><Typography sx={customFontSizeSx(theme)}  >{t('originPoints')}</Typography>
        </Box>
    },
    {
      id: 'ADD_RED',
      content:
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <AddIcon /><Typography sx={customFontSizeSx(theme)} >{t('finalPoints')}</Typography>
        </Box>
    },
  ];

  const handleButtonColor = (pointMode) => {
    if (pointMode.includes('RED')) {
      return {
        '& .ButtonGroup-button': editMode ? '' : {
          '&.Mui-selected': {
            border: theme => `2px solid ${theme.palette.secondary.main}`,
            backgroundColor: 'common.white',
            '&:hover': {
              border: theme => `2px solid ${theme.palette.secondary.main}`,
              backgroundColor: 'common.white',
            },
          },
          '&.Mui-disabled': {
            border: 'success.main'
          }
        },
        '& .ButtonGroup-buttonContent': editMode ? '' : {
          color: 'secondary.main'
        }
      };

    } else {
      return {
        '& .ButtonGroup-button': editMode ? '' : {
          '&.Mui-selected': {
            backgroundColor: theme => `${theme.palette.common.white} !important`,
            border: theme => `2px solid ${theme.palette.primary.main}`,
            '&:hover': {
              border: theme => `2px solid ${theme.palette.primary.main}`,
              backgroundColor: theme => `${theme.palette.common.white}`,
            },
          }
        },
        '& .ButtonGroup-buttonContent': editMode ? '' : {
          color: theme => `${theme.palette.primary.main}`
        }
      };
    }
  };


  const customSx = {
    ...handleButtonColor(selectedMode),
  };

  const itemsEditMode = [
    {
      id: 'EDIT',
      content: <Box sx={{ display: 'flex', alignItems: 'center', gap:1 }}>
        <EditLocationOutlinedIcon fontSize='small' />
        {widescreen && <Typography fontSize={14}>{t('move')}</Typography>}
      </Box>
    },
    {
      id: 'REMOVE',
      content: <Box sx={{ display: 'flex', alignItems: 'center',gap:1 }}>
        <DeleteOutlineOutlinedIcon fontSize='small'/>
        {widescreen && <Typography fontSize={14}>{t('remove')}</Typography>}
      </Box>
    }
  ];

  return (
    <>
      <ButtonGroup
        disabled={editMode}
        variant='outlined'
        color={grey[900]}
        items={buttonGroupTypePoints}
        selectedItemId={selectedMode}
        onItemClick={handlePointClick}
        sx={customSx}
      />
      <Box sx={{display:'flex', flexDirection: 'column', gap: 1, mt: 2}}>
        <Box sx={{ display: 'flex', flexDirection: widescreen ? 'column' : 'row', alignItems: 'space-between', gap: widescreen ? 1 : 4, marginTop : widescreen ? 5 : 0}}>
          {widescreen && <Typography variant='body2' sx={{ color: 'grey.600', fontStyle: 'italic' }}>{t('editDescription')}</Typography>}
          <Button
            onClick={editMode ? handleCancelEditIconClick : handleEditIConClick}
            startIcon={editMode ? <CloseOutlinedIcon /> : <EditOutlinedIcon />}
            size='medium'
            color='primary'
            sx={{ color: 'common.white', width: widescreen ? '100%' : '70%', mt:0 }}
            variant='contained'
            fullWidth={widescreen}
            disabled={!(allPoints.blue.length || allPoints.red.length || editMode)}
          >
            {editMode ? t('exitEdit') : t('edit')}
          </Button>
          {
            editMode && <ButtonGroup
              variant='outlined'
              items={itemsEditMode}
              selectedItemId={mode}
              onItemClick={handlePointClick}
              color={grey[900]}
              fullWidth='true'
            />
          }
        </Box>

        <Button
          variant='outlined'
          color='secondary'
          fullWidth={widescreen}
          sx={{ mt: widescreen ? 4 : 2, width: '100%'}}
          onClick={handleOpenModal}
          disabled={(!(allPoints.blue.length || allPoints.red.length))}>
          {widescreen ? t('removeButton') : t('shortRemoveButton') }
        </Button>
      </Box>

      {
        openModal && <DeletePointsModal
          onChangeStateModal={setOpenModal}
          onChangePoints={onChangePoints}
        />
      }
    </>
  );
}

PointsSidePanels.propTypes = {
  onChangePoints: PropTypes.func.isRequired,
  onChangeModePoints: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  onChangeEditMode: PropTypes.func.isRequired,
  allPoints: PropTypes.shape({
    red: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      lng: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
      name: PropTypes.string
    })).isRequired,
    blue: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      lng: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
      name: PropTypes.string
    })).isRequired,
  }).isRequired,
  mode: PropTypes.string.isRequired,
  lastModePoint: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null])
  ]),
  onChangeLastModePoint: PropTypes.func.isRequired,
  selectedMode: PropTypes.string.isRequired,
  onChangeSelectedMode: PropTypes.func.isRequired
};

export default PointsSidePanels;
