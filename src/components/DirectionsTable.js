import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import ModalEditPoint from './ModalEditPoint';
import Box from '@mui/material/Box';

import {grey, red} from '@mui/material/colors';
import {lighten} from '@mui/material';

import {useTranslation} from 'react-i18next';

const DirectionsTable = ({calculatedRoutes, allPoints, onChangeHover, onChangeIdHoverPoint,onChangeNearestRedPoint, onChangePoints}) => {
  
  const{t} = useTranslation();
  const [openModal,setOpenModal] = useState(null);
  const [indexSelectPoint,setIndexSelectPoint] = useState(null);
  const [modeEditPoint, setModeEditPoint] = useState(null);
  const bluePoints = allPoints.blue ? allPoints.blue.map(point =>point): [] ;

  calculatedRoutes.forEach(function (element) {
    let sum = 0;
    for( var i = 0; i < element.data.length; i++ ){
      sum += parseInt( element.data[i][1], 10 );
    }
    let avg = sum/element.data.length;
    element.data.avg = Math.round( avg * 10)/10;
  });
  

  let dir = calculatedRoutes.map(d => (d.data.avg));
  let shortestRouteIndex = dir.indexOf(Math.min(...dir));
  useEffect(()=>{
    onChangeNearestRedPoint(shortestRouteIndex >= 0 ? shortestRouteIndex : null);
  },[shortestRouteIndex]);
  const handleCellHover = (redId) =>{
    onChangeHover(true);
    onChangeIdHoverPoint(redId);
  };

  const handleCellLeave = () => {
    onChangeHover(false);
    onChangeIdHoverPoint(undefined);
  };
  const handleClickIcon = (index,mode)=>{
    setModeEditPoint(mode);
    setIndexSelectPoint(index);
    setOpenModal(true);
  };
  const handleCloseModal = ()=>{
    setOpenModal(false);
  };
  const rowNames = allPoints.red ? allPoints.red.map(point => point.name) : [];
  return <>
    {
      calculatedRoutes && calculatedRoutes.length > 0 && allPoints.blue.length  && allPoints.red.length &&
      <Table sx={{minWidth: 300}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell key={'empty'} align="right"></TableCell>
            {
              bluePoints.map((bluePoint, index) => <TableCell key={index} align="right">
                <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                  <IconButton onClick={()=>handleClickIcon(index,'blue')} size='small'>
                    <EditIcon sx={{color: 'primary.main'}} fontSize='small'/>
                  </IconButton>
                  <Typography sx={{fontWeight: 'bold', color: 'primary.main'}}>
                    {bluePoint.name?.toUpperCase()}
                  </Typography>
                </Box>
              </TableCell>)
            }
            <TableCell key={'average'} align="right">{t('averageTime')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {calculatedRoutes.map((row, index) => (
            <TableRow onMouseEnter={()=>handleCellHover(allPoints.red[index].id)} onMouseLeave={()=> handleCellLeave()}
              key={index}
              sx={{'&:hover': index === shortestRouteIndex ? {bgcolor: lighten(red[50],0.75)} : {bgcolor: 'grey.200'}  , border: index === shortestRouteIndex ? theme => `2px solid ${theme.palette.secondary.dark}`: undefined}}
            >
              <TableCell component="th" scope="row">
                <Stack>
                  <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <IconButton onClick={()=>handleClickIcon(index,'red')} size='small'>
                      <EditIcon sx= {{ color: index=== shortestRouteIndex ? theme => theme.palette.secondary.dark : theme => theme.palette.secondary.main}} fontSize='small'/>
                    </IconButton>
                    <Typography sx={{fontWeight: 'bold', color: index === shortestRouteIndex ? 'secondary.dark': 'secondary.main'}}>
                      {rowNames[index]?.toUpperCase()}
                    </Typography>
                  </Box>
                  <Typography variant='body2' sx={{color: index === shortestRouteIndex ? 'secondary.dark': grey[500], fontStyle: 'italic'}}>{row.name}</Typography>
                </Stack>
              </TableCell>
              {
                row.data.map((data) => (
                  <TableCell  key={data} align="right">{
                    data.map((value, index ) => (
                      <span key={value}>{value + (index === 0 ? 'km' : 'min')}<br/></span>
                    ))
                  }</TableCell>
                ))
              }
              <TableCell component="th" scope="row" align="center">
                {row.data.avg} min
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    }
    { openModal && <ModalEditPoint 
      allPoints={allPoints}
      onChangePoints={onChangePoints}
      indexPointSelect={indexSelectPoint}
      onClose={handleCloseModal} 
      mode={modeEditPoint} />
    }
  </>;
};

DirectionsTable.propTypes = {
  calculatedRoutes: PropTypes.array.isRequired,
  allPoints: PropTypes.shape({
    red: PropTypes.arrayOf(PropTypes.shape({
      id:  PropTypes.string.isRequired,
      lng: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
      name: PropTypes.string
    })).isRequired,
    blue: PropTypes.arrayOf(PropTypes.shape({
      id:  PropTypes.string.isRequired,
      lng: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
      name: PropTypes.string
    })).isRequired,
  }).isRequired,
  onChangeNearestRedPoint: PropTypes.func.isRequired,
  onChangeHover: PropTypes.func.isRequired,
  onChangeIdHoverPoint: PropTypes.func.isRequired,
  onChangePoints: PropTypes.func.isRequired
};

export default DirectionsTable;