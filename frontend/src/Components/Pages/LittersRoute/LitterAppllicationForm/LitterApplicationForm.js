import { Box, Paper, Typography, FormControl, Container, Button, TextField, InputLabel, Select, InputAdornment, RadioGroup, FormLabel, FormControlLabel, Radio, TableRow, TableCell, IconButton, MenuItem } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { postApplication } from "../../../services/litterServices";
import { useGlobalState, CustomTable } from "../../../utils/componentIndex";
import { colours } from "../../../utils/helpers/generalTools";


// Criteria form must account for
//  where do you plan to have puppy sleeping,     
//  anything they feel might let me see that they would be a good pick for one of my pups,   I believe in the happiness of the pup first,

const LitterApplicationForm = () => {
  const { store, dispatch } = useGlobalState();
  const { loggedInUser, applicationForms } = store;
  const navigate = useNavigate();
  const location = useLocation();
  const mounted = useRef();

  const initialformData = {
    litter_id: 1,
    yardarea: 0,
    yardfenceheight: 0,
    user_id: 0,
    sex_preference: 0,
    colour_preference: '',
    child_age: '',
    pets_age: '',
    pets_type: '',
    pets_breed: '',
    desexed: '',
  };

  const [formData, setFormData] = useState(initialformData);
  const [childrenData, setChildrenData] = useState([]);
  const [petsData, setPetsData] = useState([]);
  const [children, setChildren] = useState(false);
  const [pets, setPets] = useState(false);
  const [colourPref, setColourPref] = useState([]);

  // adds the user's id to the contact form automaticallly
  useEffect(() => {
    if (!mounted.current) {
      setFormData({
        ...formData,
        user_id: loggedInUser.id,
      });
      setColourPref(colours);
      mounted.current = true;
    }

  }, [mounted, formData, loggedInUser]);

  // handles all form input
  const handleInput = (e) => {
    const { name, value, type } = e.target;
    // ensures provided values for child_age and pet_age are handled as integers
    if (name === "child_age" || name === "pets_age") {
      let fixedValue = 0;
      if (Boolean(parseInt(e.target.value))) {
        fixedValue = parseInt(e.target.value);
      } else {
        fixedValue = 0;
      }

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
    if (type === "button") {
      if (name === "add_child") {
        setChildrenData(
          [...childrenData, { age: formData.child_age }]
        );
      }
      if (name === "add_pet") {
        setPetsData(
          [...petsData,
          {
            age: formData.pets_age,
            pettype: formData.pets_type,
            petbreed: formData.pets_breed,
            desexed: Boolean(formData.desexed)
          }
          ]
        );
      }
      setFormData({
        ...formData,
        child_age: '',
        pets_age: '',
        pets_type: '',
        pets_breed: '',
        desexed: '',
      });
    };
  };

  // deletes child from childrenData
  const handleDeleteChild = (e, index) => {
    const newChildren = [...childrenData];
    newChildren.splice(index, 1);
    setChildrenData(
      newChildren
    );
  };
  // deletes pet from petsData
  const handleDeletePet = (e, index) => {
    const newPets = [...petsData];
    newPets.splice(index, 1);
    setPetsData(
      newPets
    );
  };

  // handles form submission
  const handleSubmit = (e) => {
    // blocks default behavious
    e.preventDefault();
    // spreads formData, childrenData and petsData into an appForm object for submission
    const appForm = {
      ...formData,
      children: [...childrenData],
      pets: [...petsData],
    };
    // makes post to backend with appForm, if response.status === 201 saves application to globalState
    postApplication(appForm)
      .then(application => {
        if (application.status === 201) {
          dispatch({
            type: "updateLitterApplications",
            data: [...applicationForms, application.data]
          });
          // clears formData
          setFormData(initialformData);
          // navigates to root and triggers alert
          navigate('/', { state: { alert: true, location: '/', severity: "success", title: "Success", body: `Application Submitted` } });
        }
      })
      .catch((e) => {
        console.log(e.response);
        // if any errors navigates to current page and triggers alert
        navigate(location.pathname, { state: { alert: true, location: location.pathname, severity: "error", title: e.response.status, body: `${e.response.statusText} ${e.response.data.message}` } });
      });
  };


  return (
    <Box component="form" onSubmit={(e) => handleSubmit(e)} sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      ml: 'auto',
      mr: 'auto',
      maxWidth: "sm",
    }}>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid xs={12} sx={{ mb: 3 }}>
            <Typography variant="h5" component="h1" sx={{ textAlign: "center" }}>Litter Application</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                name="yardarea"
                id="yardarea-id"
                label="Area of Yard"
                onChange={handleInput}
                value={formData.yardarea}
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                }}
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                name="yardfenceheight"
                id="yeardfenxeheight-id"
                label="Height of Fence"
                onChange={handleInput}
                value={formData.yardfenceheight}
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">m</InputAdornment>,
                }}
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <FormControl>
              <FormLabel htmlFor="sex_preference_label" >Select Preferred Sex</FormLabel>
              <RadioGroup
                row
                name="sex_preference"
                id="sex_preference"
                aria-labelledby="sex_preference_label"
                onChange={handleInput}
                value={formData.sex}
              >
                <FormControlLabel value={1} control={<Radio />} label="Male" />
                <FormControlLabel value={2} control={<Radio />} label="Female" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="colour_preference_label">Select Colour Preference</InputLabel>
              <Select
                name="colour_preference"
                fullWidth
                required
                id="colour_preference"
                label="colour_preference_label"
                aria-labelledby="colour_preference_label"
                onChange={handleInput}
                value={formData.colour_preference}
              >
                {colourPref.map((colour, index) => {
                  return (
                    <MenuItem key={index} value={colour.id}>{colour.colour}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12}>
            <FormControl sx={{ display: "flex", alignItems: 'center' }}>
              <FormLabel id="add-children-label">Do you have any children?</FormLabel>
              <RadioGroup
                row
                aria-labelledby="add-children-label"
                value={children}
                onChange={() => setChildren(!children)}
                name="add-children-group-radio"
              >
                <FormControlLabel value={true} control={<Radio />} label="Yes" />
                <FormControlLabel value={false} control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
          {children &&
            <>
              <Grid xs={12} sx={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                <FormControl>
                  <TextField name="child_age" id="child_age_id" label="Age" type="number" onChange={handleInput} value={formData.child_age} />
                </FormControl>
              </Grid>
              <Grid xs={12}>
                <Box sx={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                  <Button name="add_child" variant="outlined" onClick={handleInput}>
                    Add Child
                  </Button>
                </Box>
              </Grid>
              <Grid xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                <Grid xs={12} md={8}>
                  <CustomTable
                    head={
                      <>
                        <TableCell align="right" sx={{ p: 0 }}>
                          Number
                        </TableCell>
                        <TableCell align="center">Age</TableCell>
                        <TableCell />
                      </>
                    }
                    body={
                      <>
                        {childrenData.map((child, index) => (
                          <TableRow key={index}>
                            <TableCell align="right">
                              {index + 1}
                            </TableCell>
                            <TableCell align="center">
                              {child.age}
                            </TableCell>
                            <TableCell align="left" sx={{ p: 0 }}>
                              <IconButton
                                aria-label="delete"
                                size="small"
                                onClick={(e) => { handleDeleteChild(e, index); }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    }
                  />
                </Grid>
              </Grid>
            </>
          }
          <Grid xs={12}>
            <FormControl sx={{ display: "flex", alignItems: 'center' }}>
              <FormLabel id="add-pets-label">Do you have any pets?</FormLabel>
              <RadioGroup
                row
                aria-labelledby="add-pets-label"
                value={pets}
                onChange={() => setPets(!pets)}
                name="add-pets-group-radio"
              >
                <FormControlLabel value={true} control={<Radio />} label="Yes" />
                <FormControlLabel value={false} control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
          {pets &&
            <>
              <Grid xs={12} sm={6}>
                <TextField name="pets_age" fullWidth id="pets_age_id" label="Age" type="number" onChange={handleInput} value={formData.pets_age} />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField name="pets_type" fullWidth id="pets_type_id" label="Type of Pet" onChange={handleInput} value={formData.pets_type} />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField name="pets_breed" fullWidth id="pets_breed_id" label="Breed of Pet" onChange={handleInput} value={formData.pets_breed} />
              </Grid>
              <Grid xs={12} sm={6} sx={{ display: "flex", justifyContent: "center" }}>
                <FormControl>
                  <FormLabel htmlFor="pet_desexed_label" >Is Your Pet Desexed?</FormLabel>
                  <RadioGroup
                    row
                    name="desexed"
                    id="desexed"
                    aria-labelledby="pet_desexed_label"
                    onChange={handleInput}
                    value={formData.desexed}
                  >
                    <FormControlLabel value='yes' control={<Radio />} label="Yes" />
                    <FormControlLabel value='' control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid xs={12}>
                <Box sx={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                  <Button variant="outlined" name="add_pet" onClick={handleInput}>
                    Add Pet
                  </Button>
                </Box>
              </Grid>
              <Grid xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                <Grid xs={12}>
                  <CustomTable
                    head={
                      <>
                        <TableCell align="right" sx={{ p: 0 }}>
                          Number
                        </TableCell>
                        <TableCell align="center">Age</TableCell>
                        <TableCell align="center">Type</TableCell>
                        <TableCell align="center">Breed</TableCell>
                        <TableCell align="center">Desexed</TableCell>
                        <TableCell />
                      </>
                    }
                    body={<>
                      {petsData.map((pet, index) => (
                        <TableRow key={index}>
                          <TableCell align="right">
                            {index + 1}
                          </TableCell>
                          <TableCell align="center">
                            {pet.age}
                          </TableCell>
                          <TableCell align="center">
                            {pet.pettype}
                          </TableCell>
                          <TableCell align="center">
                            {pet.petbreed}
                          </TableCell>
                          <TableCell align="center">
                            {pet.desexed
                              ? 'Yes'
                              : 'No'
                            }
                          </TableCell>
                          <TableCell align="left" sx={{ p: 0 }}>
                            <IconButton
                              aria-label="delete"
                              size="small"
                              onClick={(e) => { handleDeletePet(e, index); }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>}
                  />
                </Grid>
              </Grid>
            </>
          }
          <Grid xs={12}>
            <Container sx={{ display: "flex", justifyContent: "center" }}>
              <Button variant="contained" type='submit'>
                Post Litter Application
              </Button>
            </Container>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default LitterApplicationForm;