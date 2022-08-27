import { Button, Table, TableBody, TableCell, TableRow, Collapse, IconButton, Box } from "@mui/material";
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { useState } from "react";
import { useGlobalState } from "../../../utils/stateContext";
import { patchDog } from "../../../services/dogsServices";
import { updateItemInArray } from "../../../utils/helpers/generalTools";

const Dog = (props) => {
  // setting up required hooks
  const { store, dispatch } = useGlobalState();
  const navigate = useNavigate();
  const location = useLocation();

  // destructuring objects to make required variables eaiser to access
  const { dogList, loggedInUser } = store;
  const { dog } = props;

  // used for asyncronius updating of the open state
  const [open, setOpen] = useState(false);

  // Inputs: action: string
  // Function: uses
  //    action to switch between 2 cases, switching a dogs retired or display value between true or false
  //    then removes main_image, ownername and breedername by creating a new object containing everthing but those 3 values
  //    then makes patch request to backedend using patchDogs()
  // Called by: 2 Buttons, one for managing retire and the other for managing display
  // Used for: allowing admins to manage dogs retired or display values
  const handleUpdateDog = (action) => {
    let newDog;
    switch (action) {
      case "retire": {
        newDog = {
          ...dog,
          retired: !dog.retired
        };
        break;
      }
      case "hide": {
        newDog = {
          ...dog,
          display: !dog.display
        };
        break;
      }
      default: {
        newDog = {
          ...dog
        };
      }
    };
    const { main_image, ownername, breedername, ...newestDog } = newDog;
    // Inputs: 
    //    dog.id: integer
    //    newestDog: object
    // Outputs: backend response to patch request
    // Function: 
    //    makes a patch request to '/dogs/dog.id' with the provided object.
    //    takes response passes it the dispatch() function
    // Called by: handleUpdateDog()
    // Used for: updating a dog with new information on the backend
    patchDog(dog.id, newestDog)
      .then(dog => {
        if (dog.status === 200) {
          // Inputs: 
          //    type: integer
          //    data: array
          // Function: uses type to switch to a matching case and saves data to dogList in globalState
          // Called by: patchDog()
          // Used for: allows an admin to update a dogs data on the front end
          dispatch({
            type: 'setDogList',
            data: updateItemInArray(newDog, dogList)
          });
        }
      })
      .catch(e => {
        console.log(e);
        // Inputs:
        //    target: string
        //    options: object
        //        state: object
        //            alert: boolean
        //            location: string
        //            severity: string
        //            title: string
        //            body: string
        // Outputs: navigates to target page and saves provided options to react-router browser
        // Function: uses useNavigate() hook provided by react-router to navigate to target path and save provided options to react-router browser which can be accessed with the useLocation() hook also provided by react-router
        // Called by: catch()
        // Used for: automatically navigating the page to protect certain routes or simply trigger an alery by making use of the browser state, an object stored within the options object of react-router
        navigate(location.pathname, { state: { alert: true, location: location.pathname, severity: "error", title: e.response.status, body: `${e.response.statusText} ${e.response.data.message}` } });
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
          {dog.realname}
        </TableCell>
        <TableCell align="center" padding="none">
          {dog.callname}
        </TableCell>
        <TableCell align="center" padding="none">
          {dog.owner_id ? dog.ownername : `Not Provided`}
        </TableCell>
        <TableCell align="center" padding="none">
          {dog.breedername ? dog.breedername : "Not Provided"}
        </TableCell>
        <TableCell align="center">
          {dog.dob ?
            <>{moment(dog.dob).format('DD/MM/YYYY')}</>
            :
            "Not Provided"
          }
        </TableCell>
        <TableCell align="center" padding="none">
          {dog.retired ?
            "Retired"
            :
            "Not Retired"
          }
        </TableCell>
        {loggedInUser.admin
          && <>
            <TableCell align="center" padding="none">
              {dog.display ?
                "Displaying"
                :
                "Hidden"
              }
            </TableCell>
            <TableCell align="center">
              {dog.position}
            </TableCell>
          </>}
      </TableRow>
      <TableRow>
        <TableCell sx={{ pb: 0, pt: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 1 }}>
              <Table size="small">
                <TableBody>
                  <TableRow sx={{ display: 'flex' }}>
                    <TableCell align="left" size="small" >
                      <Link to={`/dogs/display/${dog.id}`}>
                        <Button variant="contained" color="success">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                    {loggedInUser.admin
                      && <>
                        <TableCell align="left" size="small">
                          <Link to={`/dogs/${dog.id}/edit`}>
                            <Button variant="contained" color="warning">
                              Edit
                            </Button>
                          </Link>
                        </TableCell>
                        {/* <TableCell align="left" size="small">
                          <Button variant="contained" color="error">
                            Delete
                          </Button>
                        </TableCell> */}
                        <TableCell align="left" size="small">
                          <Button variant="contained" color="primary" onClick={() => handleUpdateDog("retire")}>
                            {dog.retired ? "Unretire Dog" : "Retire Dog"}
                          </Button>
                        </TableCell>
                        <TableCell align="left" size="small">
                          <Button variant="contained" color="primary" onClick={() => handleUpdateDog("hide")}>
                            {dog.display ? "Hide Dog" : "Unhide Dog"}
                          </Button>
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

export default Dog;