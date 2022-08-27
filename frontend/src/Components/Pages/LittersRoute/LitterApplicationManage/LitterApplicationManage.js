import { Box, Button, Paper, TableCell, TableRow, Typography, TablePagination } from "@mui/material";
import { useEffect, useState } from "react";
import { useGlobalState, LitterApplication, CustomTable } from "../../../utils/componentIndex";

const LitterApplicationManage = (props) => {
  const { litterApps } = props;
  const { store } = useGlobalState();
  const { userList, applicationForms } = store;

  const [applications, setApplications] = useState([]);
  const [waitList, setWaitList] = useState([]);

  const [filter, setFilter] = useState('none');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // on component mount or on litterAppss, applicationForms, applications update, checks if litterApps is prescent, if true assings litterApps to applications state, else checks if applicationForms are equal to existing applications state, if they aren't assigns applicationForms to application state instead
  useEffect(() => {
    if (litterApps) {
      setApplications(litterApps);
    } else if (applicationForms !== applications) {
      setApplications(applicationForms);
    }
  }, [litterApps, applicationForms, applications]);

  // on component mount or applications, waitList and filter update checks if applications and waitList aren't the same and that filter is set to 'none', if true, sets waitList state to applications state
  useEffect(() => {
    if (applications !== waitList && filter === 'none') {
      setWaitList(applications);
    }
  }, [applications, waitList, filter]);

  // on component mount or filter and applications update checks if filter is not 'none', and filters applications based on new filter, if filter is still 'none' assigns unfiltered applications to waitlist
  useEffect(() => {
    if (filter !== 'none') {
      setWaitList(applications.filter(form => form.fulfillstate === filter));
    } else {
      setWaitList(applications);
    }
  }, [filter, applications]);

  // handles page change for pagination
  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  // handles rows per page change for pagination
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // controls filter state, if passed status is the same as current filter, it will set it to 'none', else it will set the filter to the provided value
  const handleFilter = (status) => {
    if (status === filter) {
      setFilter('none');
    } else {
      setFilter(status);
    }
    setPage(0);
  };

  return (
    <>
      <Box component={Paper} sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: "center",
        p: 2
      }}>
        <Typography variant="h4" component="h1">Manage Litter Applications</Typography>
        <Box sx={{
          py: 2
        }}>
          <Box sx={{ py: 2 }}>
            <Typography>Filter Application Status</Typography>
            <Box>
              {/* buttons that trigger filter changes */}
              <Button onClick={() => handleFilter(null)}>Unprocessed</Button>
              <Button onClick={() => handleFilter(1)}>Approved</Button>
              <Button onClick={() => handleFilter(2)}>Rejected</Button>
            </Box>
          </Box>
          {/* custom table component */}
          <CustomTable
            head={
              <>
                <TableCell />
                <TableCell align='center'>
                  <Typography>Application Id</Typography>
                </TableCell>
                <TableCell align='center'>
                  <Typography>User</Typography>
                </TableCell>
                <TableCell align='center'>
                  <Typography>Yard Area</Typography>
                </TableCell>
                <TableCell align='center'>
                  <Typography>Fence Height</Typography>
                </TableCell>
                <TableCell align='center'>
                  <Typography>Priority</Typography>
                </TableCell>
                <TableCell align='center'>
                  <Typography>Status</Typography>
                </TableCell>
              </>
            }
            body={
              <>
                {/* sorts waitlist by priority, then by id, then slices list to make it itterable via pagination before mapping it to the LitterApplication component */}
                {/* Also finds the user an application was posted by and passes the found object */}
                {waitList.sort((a, b) => (a.priority - b.priority || a.id - b.id))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((form, index) => {

                    const user = userList.find(user => user.id === form.user_id);
                    return (
                      <LitterApplication key={index} id={form.id} app={form} user={user} {...props} />
                    );
                  })}
                {page > 0 && (
                  <TableRow style={{ height: 47 * Math.max(0, (1 + page) * rowsPerPage - waitList.length) }}>
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
                    count={waitList.length}
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
        </Box>
      </Box>
    </>
  );
};

export default LitterApplicationManage;