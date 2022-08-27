import { Box, Paper, Typography, Container, TableRow, TableCell, Collapse, Button, TablePagination, Dialog, useMediaQuery, useTheme, DialogTitle, DialogContent, DialogContentText, DialogActions, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import { useGlobalState, Litter, CustomTable, LitterApplicationManage } from "../../../utils/componentIndex";
import { getLitterApps, patchLitterApp } from "../../../services/litterServices";
import { Link, useLocation, useNavigate } from "react-router-dom";

const LitterManage = () => {
  const { store, dispatch } = useGlobalState();
  const { litterList, applicationForms, userList, dogList, updatingApp } = store;
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const fullscreen = useMediaQuery(theme.breakpoints.down('md'));


  const [litters, setLitters] = useState([]);
  const [waitList, setWaitList] = useState([]);
  const [selectedLitter, setSelectedLitter] = useState({ select_litter: '' });

  const [openApp, setOpenApp] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  // on mount or when litterList updates, assigns all litters without id of 1 to litters state
  useEffect(() => {
    setLitters(litterList.filter(litter => litter.id !== 1));
  }, [litterList]);

  // on component mount or when applicationForms updates, checks if applicationForms has any values and assignes them to waitList if true
  useEffect(() => {
    if (applicationForms.length > 0) {
      setWaitList(applicationForms);
    }
  }, [applicationForms]);

  // allows for scrolling through paginated table
  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  // allows for increasing the number of rows allowed in paginated table
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // sets id of selected litter to selectedLitter state
  const handleSelect = (e) => {
    const { name, value } = e.target;

    setSelectedLitter({
      [name]: parseInt(value)
    });
  };

  // finds selected litter via selected_litter in selectedLitter state, then checks if updatingApp exists in global State and that selectedLitter has selected_litter value.
  const handleLitterSelect = () => {
    const chosenLitter = litters.find(litter => litter.id === selectedLitter.select_litter);
    if (updatingApp && selectedLitter.select_litter) {
      // makes patch request to '/litter_applications/:id' where updatingApp.id is the :id and the data consits of the updatingApp object, a litter_id key which the id from selectedLitter and a fulfillstate update to 1
      patchLitterApp(updatingApp.id, { ...updatingApp, litter_id: selectedLitter.select_litter, fulfillstate: 1 })
        .then(app => {
          if (app.status === 200) {
            // if response.status === 200 makes get request to back for updated litter applications and refreshes global state
            getLitterApps()
              .then(reply => {
                dispatch({
                  type: 'setLitterApplications',
                  data: reply
                });
              })
              .catch(e => {
                console.log(e);
              });
            // closes dialog
            setOpenDialog(!openDialog);
            // navigates to current path and triggers alert
            navigate(location.pathname, { state: { alert: true, location: location.pathname, severity: "success", title: `${app.status} Success`, body: `Application ${app.data.id} assigned to ${chosenLitter.lname}` } });
            // clears selectedLitter state
            setSelectedLitter({ select_litter: '' });
          }
        })
        .catch(e => console.log(e));
    }
  };

  // closes dialog
  const handleCancel = () => {
    setOpenDialog(!openDialog);
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
        <Typography variant="h4" component="h1">Manage Litters</Typography>
        <Box component={Paper} sx={{
          m: 2,
          p: 2
        }}>

          <Typography variant="h6" component="span" onClick={() => setOpenApp(!openApp)}>{openApp ? <KeyboardArrowDown /> : <KeyboardArrowRight />} Wait List</Typography>
          <Collapse
            in={openApp}
            unmountOnExit>
            <LitterApplicationManage handleOpenDialog={setOpenDialog} openDialog={openDialog} litterApps={waitList} />
          </Collapse>

        </Box>
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(!openDialog)}
          fullScreen={fullscreen}
        >
          <DialogTitle>Assign Application</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <DialogContentText>
                  Assign application {updatingApp && updatingApp.id} to an open litters
                </DialogContentText>
              </Grid>
              <Grid xs={12}>
                {/* displays puppies an a table list */}
                <FormControl fullWidth>
                  <InputLabel id="select_litter_label">Select Litter</InputLabel>
                  <Select
                    name="select_litter"
                    id="select_litter"
                    label="SelectLitter"
                    aria-labelledby="select_litter_label"
                    onChange={handleSelect}
                    value={selectedLitter.select_litter}
                  >
                    {litterList.filter(litter => litter.status === 1).map((litter, index) => {

                      return (
                        <MenuItem key={index} value={litter.id}>{litter.lname}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleLitterSelect()}>Approve Application</Button>
            <Button onClick={() => handleCancel()}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <Typography variant="h6" component="span" sx={{ py: 2 }}>Litters</Typography>
        <Box sx={{

        }}>
          <CustomTable
            head={
              <>
                <TableCell />
                <TableCell align='center'>
                  <Typography>Litter Status</Typography>
                </TableCell>
                <TableCell align='center'>
                  <Typography>Litter Name</Typography>
                </TableCell>
                <TableCell align='center'>
                  <Typography>Litter Breeder</Typography>
                </TableCell>
                <TableCell align='center'>
                  <Typography>Litter Sire</Typography>
                </TableCell>
                <TableCell align='center'>
                  <Typography>Litter Dam</Typography>
                </TableCell>
                <TableCell align='center'>
                  <Typography>Expected Date</Typography>
                </TableCell>
                <TableCell align='center'>
                  <Typography>Delivered Date</Typography>
                </TableCell>
              </>
            }
            body={
              <>
                {(litters.length > 0 && userList.length > 0 && dogList.length > 0) && litters.sort((a, b) => a.id - b.id)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((litter, index) => {
                    const breeder = Object.values(userList).find(breeder => breeder.id === litter.breeder_id);
                    const sire = Object.values(dogList).find(sire => sire.id === litter.sire_id);
                    const bitch = Object.values(dogList).find(bitch => bitch.id === litter.bitch_id);
                    return (
                      <Litter key={index} litter={litter} breeder={breeder} sire={sire} bitch={bitch} />
                    );
                  })}
                {page > 0 && (
                  <TableRow style={{ height: 47 * Math.max(0, (1 + page) * rowsPerPage - litters.length) }}>
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
                    count={litters.length}
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
        <Container sx={{ display: "flex", alignContent: "flex-start", pt: 2 }}>
          <Link to="/litters/create">
            <Button variant="contained">
              New Litter
            </Button>
          </Link>
        </Container>
      </Box>
    </>
  );
};

export default LitterManage;