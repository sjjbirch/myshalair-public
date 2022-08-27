import { Box, Paper, Typography, Container, TableRow, TableCell, Button, TablePagination, TableSortLabel, IconButton, TextField } from "@mui/material";
import { visuallyHidden } from '@mui/utils';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { useEffect, useState } from "react";
import { useGlobalState, Dog, CustomTable } from "../../../utils/componentIndex";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getDogByChip } from "../../../services/dogsServices";
// import { getUsers } from "../../../services/authServices";

const DogsManage = () => {
  const { store } = useGlobalState();
  const { dogList } = store;
  const navigate = useNavigate();
  const location = useLocation();

  // sets page initial state
  const [dogs, setDogs] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [chipSearch, setChipSearch] = useState({});

  // on component mount and dogList update, sets dogs state to dogList
  useEffect(() => {
    setDogs(dogList);
  }, [dogList]);

  // handles input for chipnumber search by destructuring out name and value from passed event target and saving to chipsearch state
  const handleSearch = (e) => {
    const { name, value } = e.target;
    setChipSearch({
      ...chipSearch,
      [name]: value
    });
  };

  // makes post to '/find-dog' and saves retured dog to dogs state then navigates to current page inorder to trigger alert
  const handleSearchSubmit = () => {
    getDogByChip(chipSearch)
      .then(reply => {

        if (reply.status === 200) {
          setDogs([reply.data.dog]);
          navigate(location.pathname, { state: { alert: true, location: location.pathname, severity: 'success', title: `${reply.status} Dog Found`, body: `Dog found with microchip number ${reply.data.dog.chipnumber}` } });
        }
      })
      .catch(e => {
        // on error console logs error then navigates to current page inorder to trigger allert with error details
        console.log(e);
        navigate(location.pathname, { state: { alert: true, location: location.pathname, severity: 'error', title: `${e.response.status} No Dog Found`, body: `${e.response.data.message}` } });
      });
  };

  // called by getComparator, is provided values for a and b which are then ordered dependant on value of orderBy
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  // calls descendingComparator and passes it the values of a, b, and orderBy, then inters output if order value is 'desc'
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // updates the page value for pagination
  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  // controls the number of rows that appear per page
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // updates sorting state based on passed property value, (string that matches key values of data)
  const createSortHandler = (property) => (e) => {
    // checks if orderBy is already equal to propery value and that order is already asc
    const isAsc = orderBy === property && order === 'asc';
    // if either of the top 2 checks return false order state remains 'asc', if both are true, will switch order state to 'desc'
    setOrder(isAsc ? 'desc' : 'asc');
    // sets orderBy state to the value of property
    setOrderBy(property);
  };

  // simple reset function to reset dogs, order and orderBy state to values present on mount
  const handleFilterReset = () => {
    setOrderBy("id");
    setOrder('asc');
    setDogs(dogList);
  };

  // calculates missing entries to keep table the same size
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dogs.length) : 0;

  // array of values to become header to redice repeated code
  const headCells = [
    {
      id: 'realname',
      numeric: false,
      disablePadding: false,
      label: "Dog's Name"
    },
    {
      id: 'callname',
      numeric: false,
      disablePadding: false,
      label: "Call Name"
    },
    {
      id: 'ownername',
      numeric: false,
      disablePadding: false,
      label: 'Owner'
    },
    {
      id: 'breedername',
      numeric: false,
      disablePadding: false,
      label: 'Breeder'
    },
    {
      id: 'dob',
      numeric: false,
      disablePadding: false,
      label: 'Date of Birth'
    },
    {
      id: 'retired',
      numeric: false,
      disablePadding: false,
      label: 'Retired Status'
    },
    {
      id: 'display',
      numeric: false,
      disablePadding: false,
      label: 'Display Status'
    },
    {
      id: 'position',
      numeric: false,
      disablePadding: false,
      label: 'Display Order'
    }
  ];


  return (
    <>
      <Paper sx={{ display: 'flex' }}>
        <Container sx={{ justifyContent: 'center', textAlign: "center", mt: 4 }}>
          <Typography variant="h4" component="h1">Manage Dogs</Typography>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
            <TextField variant="standard" sx={{ mx: 1 }} label="search chip number" name="chipnumber" onChange={handleSearch} /><Button variant="outlined" sx={{ mx: 1 }} onClick={handleSearchSubmit}>Search</Button>
          </Box>
          <CustomTable
            head={
              <>
                <TableCell
                  align="center"
                >
                  <IconButton
                    onClick={handleFilterReset}
                  >
                    <FilterAltOffIcon />
                  </IconButton>
                </TableCell>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'center'}
                    padding={headCell.disablePadding ? 'none' : 'normal'}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={createSortHandler(headCell.id)}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </>
            }
            body={
              <>
                {dogs.sort(getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((dog, index) => {
                    return (
                      <Dog key={index} dog={dog} />
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 47 * emptyRows }}>
                  </TableRow>
                )}
              </>
            }
            footer={
              <>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    colSpan={8}
                    count={dogs.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': { m: 0 } }}
                  />
                </TableRow>
              </>
            }
          />
          <Box sx={{ display: "flex", alignContent: "flex-start" }}>
            <Link to="/dogs/create">
              <Button variant="contained" sx={{ m: 1 }}>
                New Dog
              </Button>
            </Link>
            <Link to="/dogs/re_order">
              <Button variant="contained" sx={{ m: 1 }}>
                Manage Dog's Positions
              </Button>
            </Link>
          </Box>
        </Container>
      </Paper>
    </>
  );
};

export default DogsManage;