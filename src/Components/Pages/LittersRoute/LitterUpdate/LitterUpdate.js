import { Box, Paper, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Container, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, TableSortLabel, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, useMediaQuery, useTheme, InputBase, OutlinedInput, Collapse, Switch, FormControlLabel } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from 'moment';
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useGlobalState } from "../../../utils/componentIndex";
import { getLitter, patchLitter, postNewPuppies } from "../../../services/litterServices";
import { getDogs, patchDog } from "../../../services/dogsServices";

// TODO, include link to full dogs edit page

const LitterUpdateForm = () => {
  const params = useParams();
  const { store, dispatch } = useGlobalState();
  const { userList, dogList } = store;
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const fullscreen = useMediaQuery(theme.breakpoints.down('md'));

  // initial state of form data
  const initialFormData = {
    id: '',
    lname: "",
    breeder_id: '',
    bitch_id: '',
    sire_id: '',
    edate: '',
    adate: '',
    pdate: '',
    esize: '',
    asize: '',
    status: '',
    puppies: '',
  };
  // initial state of puppies, acts as default
  const initialPuppyData = {
    realname: '',
    colour: '',
    sex: '',
  };
  // defines the state for the form and puppies
  const [formData, setFormData] = useState(initialFormData);
  const [puppyData, setPuppyData] = useState([]);
  const [validBreeders, setValidBreeders] = useState([]);
  const [validSires, setValidSires] = useState([]);
  const [validBitches, setValidBitches] = useState([]);
  // definess the state for any of the newly made/edited puppies
  const [newPuppyData, setNewPuppyData] = useState([]);

  // controls the dialog and puppy controls
  const [dialogOpen, setDialogOpen] = useState(false);
  const [puppiesOpen, setPuppiesOpen] = useState(false);
  const [notional, setNotional] = useState(false);

  // used to manage whether component is mounted or not
  const mounted = useRef();

  // on page mount makes get request for specified litter
  useEffect(() => {
    if (params.id === '1') {
      navigate('..', { state: { alert: true, location: '.', severity: "warning", title: "Inaccessable", body: `This litter is not accessable` } });
    } else if (!mounted.current) {
      getLitter(params.id)
        .then(litter => {
          console.log("litter", litter);
          // spreads litter into a new object to make it mutable
          let updatingLitter = {
            ...litter,
            breeder: userList.find(user => user.id === litter.breeder_id),
            sire: dogList.find(dog => dog.id === litter.sire_id),
            bitch: dogList.find(dog => dog.id === litter.bitch_id)
          };
          // clears out null values and replaces them with an empty string
          Object.keys(updatingLitter).forEach((key) => {
            if (updatingLitter[key] === null) {
              updatingLitter[key] = '';
            }
          });
          // assigns newly mutated object to formData
          setFormData({
            ...updatingLitter,
          });
          // checks if puppies where attached, if so assigns them to puppyData
          if (litter.puppies) {
            setPuppyData([...litter.puppies]);
          }
          if (litter.status === 3) {
            setNotional(!notional);
          }

          // write if to check if litter breeder is no longer valid and add them back in
          setValidBreeders([...userList.filter(user => user)]);
          // if to check if litter sire is retired, if true add back in
          if (updatingLitter.sire.retired === true) {
            setValidSires([...dogList.filter(dog => dog.sex === 1 && dog.retired === false), updatingLitter.sire]);
          } else {
            setValidSires(dogList.filter(dog => dog.sex === 1 && dog.retired === false));
          }
          if (updatingLitter.bitch.retired === true) {
            setValidBitches([...dogList.filter(dog => dog.sex === 2 && dog.retired === false), updatingLitter.bitch]);
          } else {
            setValidBitches(dogList.filter(dog => dog.sex === 2 && dog.retired === false));
          }
        })
        .catch(e => {
          console.log(e);
          navigate('/litters/manage', { state: { alert: true, location: '/litters/manage', severity: "error", title: e.response.status, body: `${e.response.statusText} ${e.response.data.message}` } });
        });
      mounted.current = true;
    }

  }, [mounted, params, dogList, navigate, notional, userList]);

  // triggers when the newpuppy state is changed
  useEffect(() => {
    // checks if there is new data in the puppy state, is yes runs
    if (newPuppyData.length > 0) {
      // itters over the newpuppy state
      newPuppyData.forEach(puppy => {
        // finds the original iteration of the newpuppy
        const originalPup = puppyData.find(pup => pup.id === puppy.id);
        // spreads the puppy state into a new mutable variable
        let newPuppies = [...puppyData];
        // splices in the new puppy inplace of its old itteration
        newPuppies.splice(newPuppies.indexOf(originalPup), 1, puppy);
        // sets the new puppy list to the puppy and form state
        setPuppyData(newPuppies);
        setFormData({
          ...formData,
          puppies: newPuppies
        });
        // cleans the newpuppy state for any future calls
        setNewPuppyData([]);
      });
    };
  }, [newPuppyData, puppyData, formData]);

  // formats recieved date
  const handleDate = (e, name) => {
    const date = moment(e).format('YYYY-MM-DD');
    const newDate = {
      target: {
        name: name,
        value: date
      }
    };
    handleInput(newDate);
  };

  // adds an empty array to puppyData
  const handleAddPuppy = () => {
    setPuppyData([...puppyData, { ...initialPuppyData }]);
  };

  // TO-DO introduce delete option

  // handles the input for puppies
  const handlePuppyInput = (e, index) => {
    const { name, value } = e.target;
    // spreads puppyData into new array inorder to mutate values
    const newPuppyData = [...puppyData];
    // located and alters the object containing the specifc puppies data that is being altered
    newPuppyData.splice(index, 1, {
      ...newPuppyData[index],
      [name]: value
    });
    // updates puppyData state with new data
    setPuppyData([
      ...newPuppyData
    ]);
  };

  // updates puppies on the backend
  const handleUpdate = () => {
    // filters out puppies that already exist on the back
    const newPuppies = puppyData.filter((pup) => {
      return !Object.keys(pup).some(key => key === "id");
    });
    // filters out puppies that don't on the back
    const oldPuppies = puppyData.filter((pup) => {
      return Object.keys(pup).some(key => key === "id");
    });
    // checks if there are any new puppies
    if (newPuppies.length > 0) {
      // formats new puppy data so backend can read it
      const updatedPuppies = {
        id: formData.id,
        dogs: [
          ...newPuppies
        ]
      };
      // makes a post request to backend, creates new puppies
      postNewPuppies(updatedPuppies)
        .then(puppies => {
          // if returnes with statuss 201, will add newly created puppies to the newpuppy state
          if (puppies.status === 201) {
            setNewPuppyData([
              ...newPuppyData,
              ...puppies.data.dogs
            ]);
          }
        })
        .catch((e) => {
          // catches any errors and triggers an alert
          console.log(e.response);
          navigate(location.pathname, { state: { alert: true, location: location.pathname, severity: "error", title: e.response.status, body: `${e.response.statusText} ${e.response.data.message}` } });
        });
    }
    // checks of there are any old puppies
    if (oldPuppies.length > 0) {
      // itters over list of old puppies
      oldPuppies.forEach((puppy) => {
        // locates its version in formData
        const originalPup = formData.puppies.find(pup => pup.id === puppy.id);
        // compares if there are any differences, if true, makes post to update puppy on back
        if (JSON.stringify(puppy) !== JSON.stringify(originalPup)) {
          patchDog(puppy.id, puppy)
            .then(dog => {
              // if returned with status 200 adds any updated puppies to the newpuppy state
              if (dog.status === 200) {
                console.log(dog);
                setNewPuppyData([
                  ...newPuppyData,
                  dog.data
                ]);
              }
            })
            .catch(e => {
              console.log(e.response);
              // catches any errors and triggers an alert
              navigate(location.pathname, { state: { alert: true, location: location.pathname, severity: "error", title: e.response.status, body: `${e.response.statusText} ${e.response.data.message}` } });
            });
        }
      });
    }
    // closes dialog
    setDialogOpen(!dialogOpen);
  };

  // closes dialog and deletes any new puppies
  const handleCancel = () => {
    setPuppyData([...formData.puppies]);
    setDialogOpen(!dialogOpen);
  };

  // handles general input for rest of form, consider breaking down into seperate more specific functions
  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "esize" || name === 'asize') {
      let fixedValue = 1;
      if (Boolean(parseInt(e.target.value))) {
        fixedValue = parseInt(e.target.value);
      } else {
        fixedValue = 0;
      }
      if (fixedValue > 13) fixedValue = 13;
      if (fixedValue < 0) fixedValue = 0;

      setFormData({
        ...formData,
        [name]: fixedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // controls if litter is notionall or not
  const handleChangeNotional = (e) => {
    setNotional(!notional);
    if (e.target.checked) {
      setFormData({
        ...formData,
        status: 3
      });
    } else {
      setFormData({
        ...formData,
        status: 1
      });
    }
    navigate(location.pathname, { state: { alert: true, location: location.pathname, severity: "warning", title: `Changing Litter Notionality to ${notional}`, body: `Updating existing litter's notionality can result in unforseen complications` } });
  };

  // handles form submit, making a patch request to backend to update litter then makes get to fetch new doglist
  const handleSubmit = (e) => {
    e.preventDefault();
    patchLitter(formData.id, formData)
      .then(reply => {
        if (reply.status === 200) {
          getDogs()
            .then(dogs => {
              dispatch({
                type: "updateDogList",
                data: dogs
              });

            })
            .catch(e => console.log(e));
          dispatch({
            type: "updateSpecificLitter",
            data: reply.data.litter
          });
          navigate('/litters/manage', { state: { alert: true, location: '/litters/manage', severity: "success", title: "Success", body: `Litter successfully updated` } });
        }
      })
      .catch((e) => {
        console.log(e.toJSON());
        navigate(location.pathname, { state: { alert: true, location: location.pathname, severity: "error", title: e.response.status, body: `${e.response.statusText} ${e.response.data.message}` } });
      });
    // todo, add redirect if patch is successful
  };

  return (
    <>
      <Box component="form" onSubmit={(e) => handleSubmit(e)} sx={{
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        maxWidth: "md",
        ml: 'auto',
        mr: 'auto',
      }}>
        {console.log(formData)}
        {console.log(puppyData)}
        {console.log(newPuppyData)}
        <Paper sx={{ padding: 4 }}>
          <FormControlLabel
            control={<Switch checked={notional} onChange={handleChangeNotional} />}
            label="Set Litter to Notional"
          />
          <Grid container spacing={2} sx={{ justifyContent: 'space-around' }}>
            <Grid xs={12} sx={{ mb: 3 }}>
              <Typography variant="h4" component="h1" sx={{ textAlign: "center" }}>Update {formData.lname}</Typography>
            </Grid>
            <Grid xs={12}>
              {/* input for litter name */}
              <FormControl fullWidth >
                <TextField name="lname" required={!notional} id="lname-input" label="Litter Name" onChange={handleInput} value={formData.lname} />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              {/* selection field to choose litters breeder */}
              <FormControl fullWidth>
                <InputLabel id="breeder_label">Select Breeder</InputLabel>
                <Select
                  name="breeder_id"
                  id="breeder_id"
                  required
                  label="breeder_label"
                  onChange={handleInput}
                  value={formData.breeder_id}
                >
                  {validBreeders.length > 0 && validBreeders.map(breeder => {
                    return (
                      <MenuItem key={breeder.id} value={breeder.id}>{breeder.username} {!breeder.breeder && "(No Longer Breeding)"}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              {/* selection field to choose litters bitch */}
              <FormControl fullWidth>
                <InputLabel id="bitch_label">Select Bitch</InputLabel>
                <Select
                  name="bitch_id"
                  fullWidth
                  required
                  id="bitch_id"
                  label="bitch_label"
                  onChange={handleInput}
                  value={formData.bitch_id}
                >
                  {validBitches.length > 0 && validBitches.map(dog => {
                    return (
                      <MenuItem key={dog.id} value={dog.id}>{dog.callname} {dog.retired && "(Retired)"}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              {/* selection field to choose litters sire */}
              <FormControl fullWidth>
                <InputLabel id="sire_label">Select Sire</InputLabel>
                <Select
                  name="sire_id"
                  fullWidth
                  required
                  id="sire_id"
                  label="sire_label"
                  onChange={handleInput}
                  value={formData.sire_id}
                >
                  {validSires.length && validSires.map(dog => {
                    return (
                      <MenuItem key={dog.id} value={dog.id}>{dog.callname} {dog.retired && "(Retired)"}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <FormControl fullWidth>
                {/* date picker to the predicted date */}
                <DatePicker
                  name="pdate"
                  id="pdate_picker"
                  label="Select Predicted Delivery Date"
                  ampm
                  required
                  inputFormat="DD/MM/YYYY"
                  mask="__/__/____"
                  views={['year', 'month', 'day']}
                  value={formData.pdate}
                  onChange={(e) => { handleDate(e, "pdate"); }}
                  onAccept={(e) => { handleDate(e, "pdate"); }}
                  renderInput={(params) => <TextField {...params} helperText="dd/mm/yyyy"></TextField>}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              {/* date picker for the expected date */}
              <FormControl fullWidth>
                <DatePicker
                  name="edate"
                  id="edate_picker"
                  label="Select Expected Delivery Date"
                  ampm
                  inputFormat="DD/MM/YYYY"
                  mask="__/__/____"
                  views={['year', 'month', 'day']}
                  value={formData.edate}
                  onChange={(e) => { handleDate(e, "edate"); }}
                  onAccept={(e) => { handleDate(e, "edate"); }}
                  renderInput={(params) => <TextField {...params} helperText="dd/mm/yyyy"></TextField>}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              {/* date picker for the actual date */}
              <FormControl fullWidth>
                <DatePicker
                  name="adate"
                  id="adate_picker"
                  label="Select Actual Delivery Date"
                  ampm
                  inputFormat="DD/MM/YYYY"
                  mask="__/__/____"
                  views={['year', 'month', 'day']}
                  value={formData.adate}
                  onChange={(e) => { handleDate(e, "adate"); }}
                  renderInput={(params) => <TextField {...params} helperText="dd/mm/yyyy"></TextField>}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={5} >
              {/* input field for the expected size */}
              <FormControl fullWidth sx={{ display: "flex", alignItems: "center" }} >
                <TextField name="esize" id="esize-input" label="Expected Litter Size" onChange={handleInput} value={formData.esize} type="text" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
              </FormControl>
            </Grid>
            {/* <Grid xs={12} sm={5}> */}
            {/* input field for the actual size, not sure if needed */}
            {/* <FormControl fullWidth sx={{ display: "flex", alignItems: 'center' }}>
                <TextField name="asize" id="asize-input" label="Actual Litter Size" onChange={handleInput} value={formData.asize} type="text" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
              </FormControl> */}
            {/* </Grid> */}
            {/* checks if actual date has been entered if not, renders nothing*/}
            {formData.adate.length < 1 ?
              null
              :

              <>
                {/* provides dropdown functionality by clicking on manage puppies title */}
                <Grid xs={12} sx={{ display: "flex", justifyContent: 'center' }}>
                  <Typography onClick={() => setPuppiesOpen(!puppiesOpen)} variant="h6">{puppiesOpen ? <KeyboardArrowDown /> : <KeyboardArrowRight />}Manage Puppies</Typography>
                </Grid>
                <Collapse
                  in={puppiesOpen}
                  timeout="auto"
                  unmountOnExit
                >
                  <Grid xs={12}>
                    {/* button to open up manage puppies dialog */}
                    <Box sx={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                      <Button variant="outlined" name="open_puppy_dialog" onClick={() => setDialogOpen(!dialogOpen)}>
                        Manage Puppies
                      </Button>
                    </Box>
                  </Grid>
                  {/* dialog, allows puppies to be added and renamed, future: removed */}
                  <Dialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(!dialogOpen)}
                    fullScreen={fullscreen}
                  >
                    <DialogTitle>Manage Puppies</DialogTitle>
                    <DialogContent>
                      <Grid container spacing={2}>
                        <Grid xs={12}>
                          <DialogContentText>
                            Add puppies to or remove from litter.
                          </DialogContentText>
                        </Grid>
                        <Grid xs={12}>
                          <Box>
                            <Button variant="outlined" name="add_puppy" onClick={handleAddPuppy}>
                              Add Puppy
                            </Button>
                          </Box>
                        </Grid>
                        <Grid xs={12}>
                          {/* displays puppies an a table list */}
                          <TableContainer component={Paper}>
                            <Table size='small' sx={{ minWidth: 550 }} >
                              <TableHead >
                                <TableRow>
                                  <TableCell align="center">
                                    <TableSortLabel>Name</TableSortLabel>
                                  </TableCell>
                                  <TableCell align="center">Colour</TableCell>
                                  <TableCell align="center">Sex</TableCell>
                                  <TableCell />
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {puppyData.map((dog, index) => (
                                  <TableRow key={index}>
                                    <TableCell align="center">
                                      <InputBase name="realname" id="dog_realname_id" required onChange={(e) => handlePuppyInput(e, index)} placeholder="enter realname" value={puppyData[index].realname}
                                      />
                                    </TableCell>
                                    {/* <TableCell align="center">
                                      <InputBase name="callname" id="calllname_id" required onChange={(e) => handlePuppyInput(e, index)} placeholder="enter callname" value={puppyData[index].callname}
                                      />
                                    </TableCell> */}
                                    {/* here we want to add the puppies colour once its ready */}
                                    <TableCell>
                                      <Select
                                        name="colour"
                                        displayEmpty
                                        fullWidth
                                        required
                                        label='select colour'
                                        id="dog_colour"
                                        onChange={(e) => handlePuppyInput(e, index)}
                                        value={puppyData[index].colour}
                                        input={<OutlinedInput />}
                                        renderValue={(selected) => {
                                          if (selected === 1) {
                                            return (<em>Male</em>);
                                          } else if (selected === 2) {
                                            return (<em>Female</em>);
                                          } else {
                                            return (<em>Select Colour</em>);
                                          }
                                        }}
                                      >
                                        {/* <MenuItem value={1}>Male</MenuItem>
                                        <MenuItem value={2}>Female</MenuItem> */}
                                      </Select>
                                    </TableCell>
                                    <TableCell>
                                      <Select
                                        name="sex"
                                        displayEmpty
                                        fullWidth
                                        required
                                        label='select sex'
                                        id="dog_sex"
                                        onChange={(e) => handlePuppyInput(e, index)}
                                        value={puppyData[index].sex}
                                        input={<OutlinedInput />}
                                        renderValue={(selected) => {
                                          if (selected === 1) {
                                            return (<em>Male</em>);
                                          } else if (selected === 2) {
                                            return (<em>Female</em>);
                                          } else {
                                            return (<em>Select Sex</em>);
                                          }
                                        }}
                                      >
                                        <MenuItem value={1}>Male</MenuItem>
                                        <MenuItem value={2}>Female</MenuItem>
                                      </Select>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => handleUpdate()}>Update Pupppies</Button>
                      <Button onClick={() => handleCancel()}>Cancel Edits</Button>
                    </DialogActions>
                  </Dialog>
                  <Grid xs={12}>
                    {/* another table to view all puppies in list no ability to edit */}
                    <TableContainer component={Paper} sx={{ width: '100%' }}>
                      <Table size='small' sx={{ minWidth: 650 }} >
                        <TableHead >
                          <TableRow>
                            <TableCell align="center">
                              <TableSortLabel>Name</TableSortLabel>
                            </TableCell>
                            <TableCell align="center">Colour</TableCell>
                            <TableCell align="center">Sex</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {puppyData.map((dog, index) => (
                            <TableRow key={index}>
                              <TableCell align="center">
                                {dog.realname}
                              </TableCell>
                              <TableCell align="center">
                                {dog.callname}
                              </TableCell>
                              <TableCell align="center">
                                {dog.sex === 2 && "female"}
                                {dog.sex === 1 && "male"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Collapse>
              </>
            }
            <Grid xs={12}>
              <Container>
                <Button variant="contained" type='submit'>
                  Update Litter
                </Button>
                <Link to="..">
                  <Button variant="text">
                    Return
                  </Button>
                </Link>
              </Container>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default LitterUpdateForm;