import React, { useEffect, useState } from 'react';
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
import {grey, red} from '@mui/material/colors';
import {lighten, useMediaQuery, useTheme} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import {useTranslation} from 'react-i18next';

const DirectionsTable = ({calculatedRoutes, allPoints, onChangeHover, onChangeIdHoverPoint,onChangeNearestRedPoint, onChangePoints, editMode}) => {
  
  const{t} = useTranslation();
  const [editedPointNames, setEditedPointNames] = useState(allPoints);
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
  const handleEditPoint = (name,index,mode) =>{
 
    const pointsUpdated = mode=== 'red' ? editedPointNames.red.map((point,i)=>{
      if (i === index) {
        return {
          ...point , 
          name: name
        };
      }
      return point;
    }) : editedPointNames.blue.map((point,i)=>{
      if (i === index) {
        return {
          ...point , 
          name: name
        };
      }
      return point;
    });
    mode==='red'? setEditedPointNames({
      ...editedPointNames,red: pointsUpdated
    }) : setEditedPointNames({
      ...editedPointNames,blue: pointsUpdated
    });
  };

  useEffect(()=>{
    if (!editMode) {
      onChangePoints(editedPointNames);
      
    }
  },[editMode,onChangePoints,editedPointNames]);

  useEffect(()=>{
    setEditedPointNames(allPoints);
  },[allPoints]);
  
  const rowNames = allPoints.red ? allPoints.red.map(point => point.name) : [];
  const theme = useTheme();
  const widescreen = useMediaQuery(theme.breakpoints.up('lg'), { noSsr: true });
  
  return <>
    {
      calculatedRoutes && calculatedRoutes.length > 0 && allPoints.blue.length  && allPoints.red.length && widescreen &&
      <Table sx={{minWidth: 300}} size='small'>
        <TableHead>
          <TableRow>
            <TableCell key={'empty'} align="right"></TableCell>
            {
              bluePoints.map((bluePoint, index) => <TableCell key={index} align="right">
                <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
               
                  { 
                    editMode ? 
                      <TextField  size='small' value={editedPointNames.blue[index]?.name.toUpperCase()} variant='outlined' onChange={(e)=>handleEditPoint(e.target.value,index,'blue')}/>
                      : <Typography sx={{fontWeight: 'bold', color: 'primary.main'}}>
                        {bluePoint.name?.toUpperCase()}
                      </Typography>
                  }
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
                        <TextField color='secondary' size='small' value={editedPointNames.red[index]?.name.toUpperCase()} variant='outlined' onChange={(e)=>handleEditPoint(e.target.value,index,'red')}/>
                        : <Typography sx={{fontWeight: 'bold', color: index === shortestRouteIndex ? 'secondary.main': grey[500]}}>
                          {rowNames[index]?.toUpperCase()}
                        </Typography>
                    }
                  </Box>
                  <Typography variant='body2' sx={{color: index === shortestRouteIndex ? 'secondary.main': grey[500], fontStyle: 'italic'}}>{row.name}</Typography>
                </Stack>
              </TableCell>
              {
                row.data.map((data) => (
                  <TableCell  key={data} align="right">{
                    data.map((value, index ) => (
                      <span key={value}>{value + (index === 0 ? ' km' : ' min')}<br/></span>
                    ))
                  }</TableCell>
                ))
              }
              <TableCell>
                <Box style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2}}>
                  <Typography>{row.data.avg} min</Typography>
                  <AccessTimeIcon fontStyle='small' color='grey[400]'/>
                </Box>
              </TableCell>
            </TableRow>
          ))}
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
  editMode: PropTypes.bool.isRequired
};

export default DirectionsTable;