import React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import {grey} from '@mui/material/colors';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StraightenIcon from '@mui/icons-material/Straighten';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
const DirectionsTable = ({directions, onDirectionHighlight, onDeleteDirectionHightlight,typeTransport}) => {
  const {originPoints: strOriginPoints} = useParams();
  const params = useParams();
  
  const{t} = useTranslation();

  const locations = strOriginPoints ? JSON.parse(strOriginPoints) : [];

  directions.forEach(function (element) {
    let sum = 0;
    for( var i = 0; i < element.data.length; i++ ){
      sum += parseInt( element.data[i][1], 10 );
    }
    let avg = sum/element.data.length;
    element.data.avg = Math.round( avg * 10)/10;
  });

  let dir = directions.map(d => (d.data.avg));
  let isSmallest = dir.indexOf(Math.min(...dir));
  console.log('isSmallest'+isSmallest);

  const columnNames = params?.originPointsNames ? JSON.parse(params.originPointsNames) : [];
  const rowNames = params?.pointsNames ? JSON.parse(params.pointsNames) : [];
  
  return <>
    {
      directions && directions.length > 0 &&
      <Table sx={{minWidth: 300}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell key={'empty'} align="right"></TableCell>
            {
              locations.map((location, i) => <TableCell key={location + i} align="right" sx={{maxWidth:150}}>
                <Typography sx={{fontWeight: 'bold', color: 'primary.main', wordWrap:'break-word'}}>{columnNames[i]?.toUpperCase()}</Typography>
              </TableCell>)
            }
            <TableCell key={'average'} align="right"  >
              <span>
                {typeTransport === 'foot-walking' && <DirectionsRunIcon /> }
                {typeTransport === 'cycling-regular' && <DirectionsBikeIcon /> }
                {typeTransport === 'driving-car' && <DirectionsCarIcon /> }
                {typeTransport === 'driving-hgv' && <DirectionsBusIcon /> }
              </span>
              {t('averageTime')}

            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {directions.map((row, i) => (
            <TableRow
              onMouseEnter={() => onDirectionHighlight(i)}
              onMouseOut={onDeleteDirectionHightlight}
              key={row.name + Math.random()}
              sx={{'&:last-child td, &:last-child th': {border: 0}, '&:hover': {bgcolor: 'grey.200'}, border: i==isSmallest ? '2px solid red': undefined}}
            >
              <TableCell component="th" scope="row">
                <Stack sx={{maxWidth:200, wordWrap:'break-word'}}>
                  <Typography sx={{fontWeight: 'bold', color: 'secondary.main',textAlign:'center'}}>{rowNames[i]?.toUpperCase()}</Typography>
                  <Typography variant='body2' sx={{color: grey[500], fontStyle: 'italic',textAlign:'center'}}>{row.name}</Typography>
                </Stack>
              </TableCell>
              {
                row.data.map((d) => (
                  <TableCell key={d} align="right">{
                    d.map((x, i ) => (
                      <span key={x} style={{display:'flex',alignItems:'center', justifyContent:'space-between'}}>
                        <span style={{marginRight:10}}>
                          {i === 0 && <StraightenIcon />}
                          {i === 1 && <AccessTimeIcon />}
                        </span>
                        {x + (i === 0 ? 'km' : 'min')}

                        <br/>  </span>
                    ))
                  }</TableCell>
                ))
              }
              <TableCell component="th" scope="row" align="center">
                <span style={{display:'flex', alignItems:'center', justifyContent:'center'}}> <AccessTimeIcon sx={{marginRight:1}}/>  {row.data.avg} min </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    }
  </>;
};

DirectionsTable.propTypes = {
  directions: PropTypes.array.isRequired,
  onDirectionHighlight: PropTypes.func.isRequired,
  onDeleteDirectionHightlight: PropTypes.func.isRequired,
  typeTransport: PropTypes.string.isRequired
};

export default DirectionsTable;