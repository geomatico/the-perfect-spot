import React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import {useTranslation} from 'react-i18next';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { grey} from '@mui/material/colors';

const DirectionsTable = ({calculatedRoutes, allPoints}) => {
  
  const{t} = useTranslation();

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
                <Typography sx={{fontWeight: 'bold', color: 'primary.main'}}>{bluePoint.name?.toUpperCase()}</Typography>
              </TableCell>)
            }
            <TableCell key={'average'} align="right">{t('averageTime')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {calculatedRoutes.map((row, index) => (
            <TableRow
              key={index}
              sx={{'&:hover': {bgcolor: 'grey.200'}, border: index === shortestRouteIndex ? '2px solid red': undefined}}
            >
              <TableCell component="th" scope="row">
                <Stack>
                  <Typography sx={{fontWeight: 'bold', color: 'secondary.main'}}>{rowNames[index]?.toUpperCase()}</Typography>
                  <Typography variant='body2' sx={{color: grey[500], fontStyle: 'italic'}}>{row.name}</Typography>
                </Stack>
              </TableCell>
              {
                row.data.map((data) => (
                  <TableCell key={data} align="right">{
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
  </>;
};

DirectionsTable.propTypes = {
  calculatedRoutes: PropTypes.array.isRequired,
  allPoints: PropTypes.shape({
    red: PropTypes.arrayOf(PropTypes.shape({
      lng: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
      name: PropTypes.string
    })).isRequired,
    blue: PropTypes.arrayOf(PropTypes.shape({
      lng: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
      name: PropTypes.string
    })).isRequired,
  }).isRequired
};

export default DirectionsTable;