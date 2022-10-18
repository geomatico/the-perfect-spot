import React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import {useParams} from 'react-router-dom';

const DirectionsTable = ({directions}) => {

  const {originPoints: strOriginPoints} = useParams();

  const locations = strOriginPoints ? JSON.parse(strOriginPoints) : [];

  // no nos mateis
  const nombres = ['Mi casa', 'Gimnasio', 'Centro médico'];

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
