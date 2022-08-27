import { Button, Typography, Table, TableBody, TableCell, TableRow, Collapse, IconButton, Box } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Link } from "react-router-dom";
import moment from "moment";
import { useState } from "react";
import { patchLitter } from "../../../services/litterServices";
import { useGlobalState } from "../../../utils/stateContext";
import { updateItemInArray } from "../../../utils/helpers/generalTools";

const Litter = (props) => {
  const { litter, breeder, sire, bitch } = props;
  const { store, dispatch } = useGlobalState();
  const { litterList, loggedInUser } = store;

  const [open, setOpen] = useState(false);

  // updates status of litter to either open or close
  const handleStatus = (status) => {
    // creates new Object with updated litter info
    const newLitter = {
      ...litter,
      "status": status
    };
    updateLitterList(newLitter);
  };

  // takes in newLitter object and makes patch to backend
  const updateLitterList = (newLitter) => {
    // makes patch to backend to update litter
    patchLitter(litter.id, newLitter)
      .then(litter => {

        // on success updates litterList state with output of updateItemInArray function
        if (litter.status === 200) {
          dispatch({
            type: 'updateLitterList',
            data: updateItemInArray(newLitter, litterList)
          });
        };
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <>
      <TableRow>

        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {loggedInUser.admin
          && <TableCell align='center' padding="none">
            <Typography>{(() => {
              switch (litter.status) {
                case 3: return "Notional";
                case 1: return "Open";
                case 2: return "Close";
                default: return "No Status";
              }
            })()}</Typography>
          </TableCell>}
        <TableCell align='center' padding="none">
          <Typography>{litter.lname}</Typography>
        </TableCell>
        <TableCell align='center'>
          <Typography >{breeder.username}</Typography>
        </TableCell>
        <TableCell align='center'>
          <Typography>{sire.callname}</Typography>
        </TableCell>
        <TableCell align='center' padding="none">
          <Typography >{bitch.callname}</Typography>
        </TableCell>
        <TableCell align='center' padding="none">
          {litter.edate ?
            <Typography>{moment(litter.edate).format('DD/MM/YYYY')}</Typography>
            :
            <Typography>Not Provided</Typography>
          }
        </TableCell>
        <TableCell align='center' >
          {litter.adate ?
            <Typography>{moment(litter.adate).format('DD/MM/YYYY')}</Typography>
            :
            <Typography>Not Provided</Typography>
          }
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ pb: 0, pt: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 1 }}>
              <Table size="small">
                <TableBody>
                  <TableRow sx={{ display: 'flex' }}>
                    <TableCell align="left" size="small" >
                      <Link to={`/litters/${litter.id}`}>
                        <Button variant="contained" color="success">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                    {loggedInUser.admin
                      && <>
                        <TableCell align="left" size="small">
                          <Link to={`/litters/${litter.id}/edit`}>
                            <Button variant="contained" color="warning">
                              Edit
                            </Button>
                          </Link>
                        </TableCell>
                        {litter.status === 3 ?
                          null
                          :
                          <TableCell align="left" size="small">
                            {litter.status === 2 ?
                              <Button variant="contained" color="info" onClick={() => handleStatus(1)}>
                                Open
                              </Button>
                              :
                              <Button variant="contained" color="error" onClick={() => handleStatus(2)}>
                                Close
                              </Button>}
                          </TableCell>
                        }
                        <TableCell align="left" size="small">
                          <Link to={`/litters/${litter.id}/applications`}>
                            <Button variant="contained">
                              View/Manage Applications
                            </Button>
                          </Link>
                        </TableCell>
                      </>}
                  </TableRow>
                </TableBody>
              </Table>
            </Box>

          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );

};

export default Litter;