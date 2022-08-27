import { Table, TableBody, TableRow, TableCell, IconButton, Typography, Collapse, Box, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { assignPuppy, getLitterApps, patchLitterApp } from "../../../services/litterServices";
import { useGlobalState } from "../../../utils/stateContext";
import LitterApplicationDetails from "../LitterApplicationDetails/LitterApplicationDetails";

const LitterApplication = (props) => {
  const { app, user } = props;
  const { store, dispatch } = useGlobalState();
  const { loggedInUser } = store;
  const navigate = useNavigate();
  const location = useLocation();

  const [puppySelect, setPuppySelect] = useState({ selected_puppy_id: '' });
  const [open, setOpen] = useState(false);

  // function containing a switch statement to process numerical values into their string counterparts
  const fulFillState = (state) => {
    switch (state) {
      case 1: {
        return "Approved";
      }
      case 2: {
        return "Rejected";
      }
      case 3: {
        return "Completed";
      }
      default: {
        return "Unprocessed";
      }
    }
  };

  // function that takes in the application's fulfillstate and a string
  const handleAcceptOrReject = (state, action) => {
    // if action's value is not assign it simply makes a patch to the back containing the updated state and reinforcing that the application belongs to waitlist, wwhich litter_id is 1
    if (action !== "assign") {
      patchLitterApp(app.id, { ...app, fulfillstate: state, litter_id: 1 })
        .then(app => {

          // onsuccess makes get for updated litter applitions list and updates state with new data
          if (app.status === 200) {
            getLitterApps()
              .then(reply => {
                dispatch({
                  type: "setApplicationForms",
                  data: reply
                });
              })
              .catch(e => {
                console.log(e);
              });
            // closes application dropdown and navigates to current location to trigger alert
            setOpen(!open);
            navigate(location.pathname, { state: { alert: true, location: location.pathname, severity: "success", title: `${app.status} Success`, body: `Application ${app.data.id} has been ${action}` } });
          }
        })
        .catch(e => {
          console.log(e);
          // it any errors, console logs them and navigates to currentl location to trigger alert with error info
          navigate(location.pathname, { state: { alert: true, location: location.pathname, severity: "error", title: `${e.response.status} ${e.response.data.success}`, body: `${e.response.data.message}; ${e.response.statusTxt}` } });
        });
      // if fulfillstate is 1 and handleOpenDialog function has been provided via props from litterManage, triggers provided function and updates global state to contain application, then closes dropdown
    } else if (state === 1 && props.handleOpenDialog) {
      const { handleOpenDialog, openDialog } = props;
      handleOpenDialog(!openDialog);
      dispatch({
        type: 'setUpdatingApp',
        data: app
      });
      setOpen(!open);
    }
  };

  // sets selected puppy id to puppySelect state
  const handlePuppySelect = (e) => {
    const { name, value } = e.target;

    setPuppySelect({
      [name]: value
    });
  };

  // assigns puppySelect state and id of app to postForm object then makes patch to backend with said object
  const handlePuppySubmit = (e) => {
    e.preventDefault();
    const postForm = {
      ...puppySelect,
      id: app.id
    };
    assignPuppy(postForm)
      .then(reply => {

        // on reply status 200 makes get request to back for updated application forms list, and assings reply to global state
        if (reply.status === 200) {
          getLitterApps()
            .then(reply => {
              dispatch({
                type: "setApplicationForms",
                data: reply
              });
            });
          // navigates to current location and triggers success alert
          navigate(location.pathname, { state: { alert: true, location: location.pathname, severity: 'success', title: `${reply.status} Success`, body: `${reply.data.message}` } });
          // closes the dropdown containing application controls
          setOpen(!open);
          // resets selectPuppy state
          setPuppySelect({
            selected_puppy_id: ''
          });
        }
      })
      .catch(e => {
        console.log(e);
        // if any errors, console logs them then navigates to current location and triggers alert containing error info
        navigate(location.pathname, { state: { alert: true, location: location.pathname, severity: 'error', title: `${e.response.status} ${e.response.data.success}`, body: `${e.response.data.message}` } });
      });
  };

  return (
    <>
      <TableRow onClick={() => setOpen(!open)}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
          </IconButton>
        </TableCell>
        <TableCell align="center" padding="none">
          <Typography>{app.id}</Typography>
        </TableCell>
        <TableCell align="center" padding="none">
          <Typography>{user && user.username}</Typography>
        </TableCell>
        <TableCell align="center" padding="none">
          <Typography>{app.yardarea} m²</Typography>
        </TableCell>
        <TableCell align="center" padding="none">
          <Typography>{app.yardfenceheight} m</Typography>
        </TableCell>
        <TableCell align="center" padding="none">
          <Typography>{app.priority}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography>
            {fulFillState(app.fulfillstate)}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ pb: 0, pt: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 1 }}>
              <Table size="small">
                <TableBody>
                  {loggedInUser.admin
                    && <>
                      <TableRow sx={{ display: 'flex' }}>
                        {/* <TableCell align="left" size="small" >
                      <Link to={`./${app.id}`}>
                        <Button variant="contained" color="success">
                          View
                        </Button>
                      </Link>
                    </TableCell> */}
                        {/* <TableCell align="left" size="small">
                      <Link to={`/litters/${appLitter.id}/applications/${app.id}/manage`}>
                        <Button variant="contained" color="warning">
                          Manage
                        </Button>
                      </Link>
                    </TableCell> */}
                        {app.fulfillstate !== null ?
                          <>
                            {app.fulfillstate === 2 ? //rejected
                              <TableCell align="left" size="small">
                                <Button variant="contained" color="info" onClick={() => handleAcceptOrReject(1, "approved")}>
                                  Approve
                                </Button>
                              </TableCell>
                              :
                              app.fulfillstate === 1 ? //approved
                                <>
                                  {props.handleOpenDialog
                                    && <TableCell align="left" size="small">
                                      <Button variant="contained" color="info" onClick={() => handleAcceptOrReject(1, "assign")}>
                                        Assign
                                      </Button>
                                    </TableCell>}
                                  {app.litter_id === 1
                                    ? <TableCell align="left" size="small">
                                      <Button variant="contained" color="error" onClick={() => handleAcceptOrReject(2, "rejected")}>
                                        Reject
                                      </Button>
                                    </TableCell>
                                    : <TableCell align="left" size="small">
                                      <Button variant="contained" color="info" onClick={() => handleAcceptOrReject(2, "returned to waitlist")}>
                                        Return to Waitlist
                                      </Button>
                                    </TableCell>}
                                </>
                                :
                                null
                            }
                          </>
                          : //unprocessed
                          <>
                            <TableCell align="left" size="small">
                              <Button variant="contained" color="info" onClick={() => handleAcceptOrReject(1, "approved")}>
                                Approve
                              </Button>
                            </TableCell>
                            <TableCell align="left" size="small">
                              <Button variant="contained" color="error" onClick={() => handleAcceptOrReject(2, "rejected")}>
                                Reject
                              </Button>
                            </TableCell>
                          </>
                        }
                      </TableRow>
                      {(app.litter_id !== 1 && app.fulfillstate !== 3)
                        && <>
                          <TableRow>
                            <TableCell>
                              <Box component="form">
                                <FormControl fullWidth>
                                  <InputLabel id="puppy_label">Assign Puppy</InputLabel>
                                  <Select
                                    name="selected_puppy_id"
                                    fullWidth
                                    required
                                    id="puppy_label"
                                    label="Assign Puppy"
                                    onChange={handlePuppySelect}
                                    value={puppySelect.selected_puppy_id}
                                  >
                                    {props.puppies && props.puppies.map((puppy, index) => {
                                      return (
                                        <MenuItem key={index} value={puppy.id}>{puppy.realname}</MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Button variant="contained" color="success" onClick={handlePuppySubmit}>
                                  Confirm Puppy Assignment
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        </>}
                    </>}
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ p: 2 }}>
              <LitterApplicationDetails id={app.id} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default LitterApplication;