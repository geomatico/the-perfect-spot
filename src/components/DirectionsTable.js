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

const DirectionsTable = ({directions, onDirectionHighlight, onDeleteDirectionHightlight}) => {
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
      directions && directions.length &&
      <Table sx={{minWidth: 300}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell key={'empty'} align="right"></TableCell>
            {
              locations.map((location, i) => <TableCell key={location + i} align="right">
                <Typography sx={{fontWeight: 'bold', color: 'primary.main'}}>{columnNames[i]?.toUpperCase()}</Typography>
              </TableCell>)
            }
            <TableCell key={'average'} align="right">{t('averageTime')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {directions.map((row, i) => (
            <TableRow
              onMouseEnter={() => onDirectionHighlight(i)}
              onMouseOut={onDeleteDirectionHightlight}
              key={row.name + Math.random()}
              sx={{'&:last-child td, &:last-child th': {border: 0}, '&:hover': {bgcolor: 'grey.200'}, bgcolor: i==isSmallest ? 'secondary.main': undefined}}
            >
              <TableCell component="th" scope="row">
                <Stack>
                  <Typography sx={{fontWeight: 'bold', color: 'secondary.main'}}>{rowNames[i]?.toUpperCase()}</Typography>
                  <Typography variant='body2' sx={{color: grey[500], fontStyle: 'italic'}}>{row.name}</Typography>
                </Stack>
              </TableCell>
              {
                row.data.map((d) => (
                  <TableCell key={d} align="right">{
                    d.map((x, i ) => (
                      <span key={x}>{x + (i === 0 ? 'km' : 'min')}<br/></span>
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
  directions: PropTypes.array.isRequired,
  onDirectionHighlight: PropTypes.func.isRequired,
  onDeleteDirectionHightlight: PropTypes.func.isRequired
};

export default DirectionsTable;