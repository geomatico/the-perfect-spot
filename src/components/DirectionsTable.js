import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {red} from '@mui/material/colors';
import { lighten, useMediaQuery, useTheme} from '@mui/material';

import {useTranslation} from 'react-i18next';

const DirectionsTable = ({calculatedRoutes, allPoints, onChangeHover, onChangeIdHoverPoint,onChangeNearestRedPoint, onChangePoints, editMode, openButtonSheet, editedPointsName, onChangeEditedPointsName}) => {
  
  const{t} = useTranslation();
  const [editedPointNames, setEditedPointNames] = useState(allPoints);
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
  const handleEditPoint = (name,index,mode) =>{
 
    const pointsUpdated = mode=== 'red' ? editedPointsName.red.map((point,i)=>{
      if (i === index) {
        return {
          ...point , 
          name: name
        };
      }
      return point;
    }) : editedPointsName.blue.map((point,i)=>{
      if (i === index) {
        return {
          ...point , 
          name: name
        };
      }
      return point;
    });
    mode==='red'? onChangeEditedPointsName({
      ...editedPointsName,red: pointsUpdated
    }) : onChangeEditedPointsName({
      ...editedPointsName,blue: pointsUpdated
    });
  };

  useEffect(()=>{
    if (!editMode) {
      onChangePoints(editedPointsName);
      
    }
  },[editMode,onChangePoints,editedPointNames]);
  useEffect(()=>{
    onChangeEditedPointsName(allPoints);
  },[allPoints]);
  const theme = useTheme();
  const widescreen = useMediaQuery(theme.breakpoints.up('lg'), { noSsr: true });
  const customBorderSx = (index) =>{
    return{
      borderRight: index === shortestRouteIndex ? theme => `2px solid ${theme.palette.secondary.dark}`: undefined,
      borderLeft: index === shortestRouteIndex ? theme => `2px solid ${theme.palette.secondary.dark}`: undefined
    };
  };
  const rowNames = allPoints.red ? allPoints.red.map(point => point.name) : [];

  return <>
    {
      calculatedRoutes && calculatedRoutes.length > 0 && allPoints.blue.length  && allPoints.red.length && widescreen &&
      <Table sx={{minWidth: 300}} size='small'>
        <TableHead>
          <TableRow>
            <TableCell key={'empty'} align="right"></TableCell>
            {
              calculatedRoutes.map((row, index) => <TableCell  onMouseEnter={()=>handleCellHover(allPoints.red[index].id)} onMouseLeave={()=> handleCellLeave()} key={index} align="center" sx={{...customBorderSx(index),'&:hover': index === shortestRouteIndex ? {bgcolor: lighten(red[50],0.75)} : {bgcolor: 'grey.200'}, borderTop : index === shortestRouteIndex ? theme => `2px solid ${theme.palette.secondary.dark}`: undefined }} >
                <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
               
                  { editMode ? <TextField  size='small' value={editedPointNames?.red[index]?.name.toUpperCase()} variant='outlined' onChange={(e)=>handleEditPoint(e.target.value,index,'red')}/>: <Typography sx={{fontWeight: 'bold', color: 'secondary.main'}}>
                    {allPoints.red[index]?.name?.toUpperCase()}
                  </Typography>}
                </Box>
                <Typography>{row.name}</Typography>

              </TableCell>)
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {allPoints.blue.map((bluePoint, index) => (
            <TableRow
              key={index}
              sx={{}}
            >
              <TableCell component="th" scope="row">
                <Stack>
                  <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                    { editMode ? <TextField color='primary' size='small' value={editedPointNames.blue[index]?.name.toUpperCase()} variant='outlined' onChange={(e)=>handleEditPoint(e.target.value,index,'blue')}/>: <Typography sx={{fontWeight: 'bold', color: 'primary.main'}}>
                      {bluePoint.name?.toUpperCase()}
                    </Typography>}
                  </Box>         
                </Stack>
              </TableCell>
              
              {allPoints.red.map((redPoint, redIndex) => (
                <TableCell align='center' key={redIndex} sx={customBorderSx(redIndex)}>
                  {calculatedRoutes[redIndex]?.data[index]?.map((value, index) => (
                    <span key={value}>{value + (index === 0 ? 'km' : 'min')}<br /></span>
                  ))}
                </TableCell>
              ))}
             
            </TableRow>
          ))}
          <TableRow align='center'>
            <TableCell align="center">{t('averageTime')}</TableCell>
            {allPoints.red.map((redPoint, index) => ( 
              <TableCell key={index} align='center' sx={{...customBorderSx(index),borderBottom:index === shortestRouteIndex ? theme => `2px solid ${theme.palette.secondary.dark}`: undefined}}> {calculatedRoutes[index]?.data.avg + 'min'}  </TableCell>
            ))}
          </TableRow>
         
        </TableBody>
      </Table>
    }

    {
      calculatedRoutes && calculatedRoutes.length > 0 && allPoints.blue.length  && allPoints.red.length && !widescreen && openButtonSheet && <Table sx={{minWidth: 200}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell key={'empty'} align="center"></TableCell>
            {
              <TableCell key={1} align="center" >
                <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                
                  { editMode ? <TextField size='small' value={editedPointsName?.red[shortestRouteIndex]?.name.toUpperCase()} variant='outlined' onChange={(e)=>handleEditPoint(e.target.value,shortestRouteIndex,'red')}/>: <Typography sx={{fontWeight: 'bold', color: 'secondary.main'}}>
                    {allPoints.red[shortestRouteIndex]?.name?.toUpperCase()}
                  </Typography>}
                </Box>
                <Typography>{calculatedRoutes[shortestRouteIndex].name}</Typography>

              </TableCell>
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            allPoints.blue.map((bluePoint, index) => (
              <TableRow
                key={index}
                sx={{
                  bgcolor: index === shortestRouteIndex ? lighten(red[50], 0.55) : undefined,
                  outline: index === shortestRouteIndex ? theme => `2px solid ${theme.palette.secondary.main}` : undefined,
                  '&:hover': {
                    bgcolor: index === shortestRouteIndex ? lighten(red[50], 0.55) : 'grey.200',
                    outline: index === shortestRouteIndex ? theme => `2px solid ${theme.palette.secondary.main}` : undefined
                  }
                }}
              >
                <TableCell component="th" scope="row">
                  <Stack>
                    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                      { 
                        editMode ? 
                          <TextField color='primary' size='small' value={editedPointsName.blue[index]?.name.toUpperCase()} variant='outlined' onChange={(e)=>handleEditPoint(e.target.value,index,'blue')}/>
                          : <Typography sx={{fontWeight: 'bold', color: 'primary.main'}}>{bluePoint.name?.toUpperCase()}</Typography>
                      }
                    </Box>         
                  </Stack>
                </TableCell>


                <TableCell align='center' key={shortestRouteIndex} sx={customBorderSx(shortestRouteIndex)}>
                  {calculatedRoutes[shortestRouteIndex]?.data[index]?.map((value, index) => (
                    <span key={value}>{value + (index === 0 ? 'km' : 'min')}<br /></span>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          <TableRow align='center'>
            <TableCell align="center">{t('averageTime')}</TableCell>
            <TableCell key={shortestRouteIndex} align='center' sx={{...customBorderSx(shortestRouteIndex),borderBottom:shortestRouteIndex === shortestRouteIndex ? theme => `2px solid ${theme.palette.secondary.dark}`: undefined}}> {calculatedRoutes[shortestRouteIndex]?.data.avg + 'min'}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
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
  onChangePoints: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  openButtonSheet: PropTypes.bool.isRequired,
  editedPointsName: PropTypes.shape({
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
  onChangeEditedPointsName: PropTypes.func.isRequired,
};

export default DirectionsTable;