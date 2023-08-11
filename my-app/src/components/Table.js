import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {mockData} from "../mock-data";
import {EnhancedTableHead} from "./EnhancedTableHead";
import {SelectId} from "./SelectId";

let rows = [];
let counters = [];

function createData(id, counterId, name, time, value) {
  return {
    id,
    counterId,
    name,
    time,
    value
  };
}

const generateData = () => {
  mockData.MeterData.map((elem, index) => {
    elem.readings.forEach(x => {
      let data = Object.keys(x)[0]
      let counterId = elem.id;
      if(!counters.includes(counterId)){
        counters.push(counterId);
      }
      const hours = Object.keys(x[data]);
      hours.map(elem2 => {
        let elem2Element = x[data][elem2] * 0.001;
        rows = [...rows, createData(`${data}+${elem2Element}+${index}`, counterId, data, elem2, elem2Element)];
      })
    })
  })
}
generateData();
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('time');
  const [select, setSelect] = React.useState(0);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const visibleRows = React.useMemo(
      () =>
          stableSort(rows, getComparator(order, orderBy)).filter(row => {
            return select !== 0 ? row.counterId === select : true;
          }),
      [order, orderBy, select],
  );

  return (
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <SelectId options={counters} handleChange={setSelect}/>
          <TableContainer>
            <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={'medium'}
            >
              <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                      <TableRow
                          hover
                          tabIndex={-1}
                          key={row.id}
                          sx={{ cursor: 'pointer' }}
                      >
                        <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                        >
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.time}</TableCell>
                        <TableCell align="right">{row.value}</TableCell>
                      </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
  );
}
