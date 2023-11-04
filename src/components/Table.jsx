import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { format } from 'date-fns';
import { useState } from 'react';

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
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function DataTable({ data }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('timestamp');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 900 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {data.length > 0
                ? Object.keys(data[0]).map((key) => (
                    <TableCell key={key} sortDirection={orderBy === key ? order : false}>
                      <TableSortLabel
                        active={orderBy === key}
                        direction={orderBy === key ? order : 'asc'}
                        onClick={(event) => handleRequestSort(event, key)}
                      >
                        {key.toUpperCase()}
                      </TableSortLabel>
                    </TableCell>
                  ))
                : ['Timestamp', 'Path', 'Response Time', 'Status Code', 'Error'].map(
                    (header) => <TableCell key={header}>{header}</TableCell>
                  )}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length > 0 ? (
              stableSort(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.timestamp}>
                    <TableCell align="left" sx={{ width: '100px' }}>
                      {format(new Date(row.timestamp), 'MM/dd/yy h:mma').toLowerCase()}
                    </TableCell>
                    <TableCell align="left" sx={{ width: '100px' }}>
                      {row.path}
                    </TableCell>
                    <TableCell align="left" sx={{ width: '50px' }}>
                      {row.response_time}
                    </TableCell>
                    <TableCell align="left" sx={{ width: '50px' }}>
                      {row.status_code}
                    </TableCell>
                    <TableCell align="left" sx={{ width: '100px' }}>
                      {row.error}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5} align="center">
                  No records to display
                </TableCell>
              </TableRow>
            )}
            {emptyRows > 0 && data.length > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
