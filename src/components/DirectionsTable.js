import React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import {useParams} from 'react-router-dom';

const DirectionsTable = ({directions}) => {
  console.log(directions);

  const {originPoints: strOriginPoints} = useParams();

  const locations = strOriginPoints ? JSON.parse(strOriginPoints) : [];

  directions.forEach(function (element) {

    let sum = 0;
    for( var i = 0; i < element.data.length; i++ ){
      sum += parseInt( element.data[i][1], 10 );

    }
    let avg = sum/element.data.length;
    element.data.avg = Math.round( avg * 10)/10;
  });

  // no nos mateis
  const nombres = ['Mis padres', 'Mi trabajo', 'Amigo', 'Médico', 'Gimnasio'];


  return <>
    {
      directions && directions.length &&
      <Table sx={{minWidth: 300}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell key={'empty'} align="right"></TableCell>
            {
              locations.map((location, i) => <TableCell key={location + i} align="right">{nombres[i]}</TableCell>)
            }
            <TableCell key={'average'} align="right">Tiempo medio</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {directions.map((row) => (
            <TableRow
              key={row.name + Math.random()}
              sx={{'&:last-child td, &:last-child th': {border: 0}}}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              {
                row.data.map(d => (
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
};

export default DirectionsTable;
