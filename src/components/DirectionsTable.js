import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import {useTranslation} from 'react-i18next';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { grey,green} from '@mui/material/colors';
import { lighten } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import ModalEditPoint from './ModalEditPoint';
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
                <Typography sx={{fontWeight: 'bold', color: 'primary.main'}}><Button onClick={()=>handleClickIcon(index,'blue')} size={'small'} ><EditIcon  fontSize={'small'}  /></Button> {bluePoint.name?.toUpperCase()}</Typography>
              </TableCell>)
            }
            <TableCell key={'average'} align="right">{t('averageTime')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {calculatedRoutes.map((row, index) => (
            <TableRow onMouseEnter={()=>handleCellHover(allPoints.red[index].id)} onMouseLeave={()=> handleCellLeave()}
              key={index}
              sx={{'&:hover': index === shortestRouteIndex ? {bgcolor: lighten(green[400],0.75)} : {bgcolor: 'grey.200'}  , border: index === shortestRouteIndex ? theme => `2px solid ${theme.palette.success.light}`: undefined}}
            >
              <TableCell component="th" scope="row">
                <Stack>
                  <Typography sx={{fontWeight: 'bold', color: index === shortestRouteIndex ? 'success.main': 'secondary.main'}}><Button onClick={()=>handleClickIcon(index,'red')} size={'small'} ><EditIcon sx= {{ color: index=== shortestRouteIndex ? theme => theme.palette.success.main : theme => theme.palette.secondary.main}} fontSize={'small'} /></Button> {rowNames[index]?.toUpperCase()}</Typography>
                  <Typography variant='body2' sx={{color: index === shortestRouteIndex ? 'success.main': grey[500], fontStyle: 'italic'}}>{row.name}</Typography>
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