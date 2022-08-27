import { FormControl, InputLabel, Container, Paper, Typography, TextField, Select, MenuItem, Button, Box, RadioGroup, FormControlLabel, Radio, FormLabel } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import { useEffect, useState } from "react";
import { useGlobalState } from "../../../utils/componentIndex";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { postDog } from "../../../services/dogsServices";
import { colours, healthTestKeys, healthTestValues } from "../../../utils/helpers/generalTools";

const DogCreationForm = () => {
  // sets up required hooks
  const { store, dispatch } = useGlobalState();
  const navigate = useNavigate();
  const location = useLocation();
  // creates fd function that converts objects passed to it into FormData
  const fd = require('form-data-extended');

  // destructuring object to make required variables eaiser to access
  const { litterList, dogList } = store;

  // sets form initial data for formData state
  const initialFormData = {
    callname: "",
    realname: "",
    // retired: false,
    sex: '',
    description: '',
    colour: '',
    chipnumber: '',
  };
  // sets initial states
  const [formData, setFormData] = useState(initialFormData);
  const [healthTestData, setHealthTestData] = useState(healthTestKeys);
  const [litterData, setLitterData] = useState({ litter_id: '' });
  const [validLitterList, setValidLitterList] = useState([]);
  const [dogColours, setDogColours] = useState([]);

  // Inputs: litterList: array
  // Function: runs contents on component mount and when litterList updates
  // Used for: pupulating validLitterList and dogColours state
  useEffect(() => {
    setValidLitterList(
      litterList.filter(litter => litter.status === 3)
    );
    setDogColours(colours);
  }, [litterList]);

  // Inputs: event: object
  // Function: 
  //    destructures out name and value from the event object target,
  //    uses name to conditionally alter how provided value is saved to formData
  //    if name is "sex" converts value to int before saving, if "litter_id" save value in a nested object, else just save value as provided, in all cases name is used to match value with any pre-existing keys
  // Used for: saving information filled in by input fields
  const handleInput = (e) => {
    const { name, value } = e.target;
    // provides unique logic iff the name of the event target is sex
    if (name === 'sex') {
      setFormData({
        ...formData,
        [name]: parseInt(value)
      });
      // provides unique logic if the name of the event target is litter_id
    } else if (name === "litter_id") {
      setLitterData({
        [name]: value
      });
      setFormData({
        ...formData,
        litter: {
          [name]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Inputs: event: object
  // Outputs: updated healthTestData and formData states
  // Function: desctructures out the name and value from event target and saves to healthTestData and a nested healthtest object in formData
  // Used for: managing inputs for healthtest
  const handleHealthTestInput = (e) => {
    const { name, value } = e.target;

    setHealthTestData({
      ...healthTestData,
      [name]: value
    });
    setFormData({
      ...formData,
      healthtest: {
        ...formData.healthtest,
        [name]: value
      }
    });
  };

  // Inputs: event: object
  // Outputs: updated formData
  // Function: destructures out name and files from event target and uses name to decide how to save files to formData, either as a single file in the case of "main_image" or array in the case of "gallery_images"
  // Used for: manageing inputs for image uploads
  const handleImageUpload = (e) => {
    e.preventDefault();
    const { name, files } = e.target;

    // if name is main_image, saves single file to state
    if (name === 'main_image') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
      // if name is gallery_images, saves array of files to state
    } else if (name === 'gallery_images') {
      setFormData({
        ...formData,
        [name]: [...files]
      });
    }
  };


  // Function: creates empty dog object, then itterates over formData and only saving key value pares to dog if the value isn't an empty string, then converts dog into FormData before making a post to the backend to create new dog
  // Used for: creating new dogs
  const handleSubmit = (e) => {
    e.preventDefault();

    let dog = {
      // healthtest: { ...healthTestData },
    };
    Object.entries(formData).forEach((item) => {

      if (item[1] === '') {
        return;
      } else {
        dog = {
          ...dog,
          [item[0]]: item[1]
        };
      }
    });
    const postForm = fd({ dog });
    // Inputs:postForm: FormData
    // Outputs: backend response
    // Function: makes post request to '/lazy_dog_create/' with postForm attached, then checks if response status === 201 and if updates dogList with new dog via dispatch if true.
    // Used for: what feature(s) does this support at the userspace level
    postDog(postForm)
      .then(dog => {
        if (dog.status === 201) {
          // on success adds dog to dogList
          dispatch({
            type: 'setDogList',
            data: [...dogList, dog.data.dog]
          });
          // clears form and health test data
          setFormData(initialFormData);
          setHealthTestData(healthTestKeys);
          // routes user back to dogs manage and alerts them to successful creation
          navigate('/dogs/manage', { state: { alert: true, location: "/dogs/manage", severity: "success", title: `${dog.status} Success`, body: `${dog.data.dog.callname} Created` } });
        }
      })
      .catch(e => {
        // navigates to current page and alerts user of any errors
        console.log(e);
        navigate(location.pathname, { state: { alert: true, location: location.pathname, severity: "error", title: `${e.response.status} Error`, body: `${e.response.statusText}` } });
      });
  };


  return (
    <Box component="form" onSubmit={(e) => handleSubmit(e)} sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Paper sx={{ padding: 4 }}>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid xs={12} sx={{ mb: 3 }}>
            <Typography variant="h3" component="h1" sx={{ textAlign: "center" }}>Create New Dog</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField name="realname" required fullWidth id="realname" label="Dog's Real Name" autoFocus onChange={handleInput} value={formData.realname} />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField name="callname" required fullWidth id="callname" label="Dog's Call Name" onChange={handleInput} value={formData.callname} />
          </Grid>
          <Grid xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <FormControl>
              <FormLabel id="dog-sex-label" >Select Dog's Sex</FormLabel>
              <RadioGroup
                row
                name="sex"
                label="Select Dog's Sex"
                required
                aria-labelledby="dog-sex-label"
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
              <InputLabel id="colour_label">Select Dog's Colour</InputLabel>
              <Select
                name="colour"
                fullWidth
                id="colour"
                labelId="colour_label"
                label="Select Colour"
                onChange={handleInput}
                value={formData.colour}
              >
                {dogColours.length > 0 && dogColours.map((colour, index) => {
                  return colour.id !== 0 && <MenuItem key={index} value={colour.id}>{colour.colour}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="litter_label">Add to Notional Litter</InputLabel>
              <Select
                name="litter_id"
                id="litter_id"
                label="Add to Notional Litter"
                onChange={handleInput}
                value={litterData.litter_id}
              >
                {validLitterList.length > 0 && validLitterList.map((litter, index) => {
                  return (
                    <MenuItem key={index} value={litter.id}>{litter.lname}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField name='chipnumber' id="chipnumber" label="Enter Dog's Microchip Number" fullWidth onChange={handleInput} value={formData.chipnumber} />
          </Grid>
          <Grid xs={12}>
            <TextField name='description' id="description" label="Enter Dog's Description" multiline minRows={3} fullWidth onChange={handleInput} value={formData.description} />
          </Grid>
          <Grid xs={12}>
            <Typography variant="h5" component="h1" sx={{ textAlign: "center" }}>Health Test</Typography>
          </Grid>

          {Object.entries(healthTestData).map((healthTest, index) => {
            return (
              <Grid key={index} xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel htmlFor={`${healthTest[0]}_id`}>{healthTest[0].toUpperCase()}</InputLabel>
                  <Select
                    name={healthTest[0]}
                    id={`${healthTest[0]}_id`}
                    label={healthTest[0]}
                    onChange={handleHealthTestInput}
                    value={healthTest[1]}
                  >
                    {healthTestValues.map((test, index) => {
                      return (
                        <MenuItem key={index} value={test.id}>{test.status}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
            );
          })}
          {/* <Grid xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel htmlFor="pra_id">PRA</InputLabel>
              <Select
                name="pra"
                id="pra_id"
                label="PRA"
                onChange={handleHealthTestInput}
                value={healthTestData.pra}
              >
                {healthTestValues.map((test, index) => {
                  return (
                    <MenuItem key={index} value={test.id}>{test.status}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField name="fn" id="fn_id" label="FN" fullWidth onChange={handleHealthTestInput} value={healthTestData.fn} />
            <FormControl fullWidth>
              <InputLabel id="litter_label">Add to Notional Litter</InputLabel>
              <Select
                name="litter_id"
                id="litter_id"
                label="Add to Notional Litter"
                onChange={handleInput}
                value={formData.litter_id}
              >
                {validLitterList.length > 0 && validLitterList.map((litter, index) => {
                  return (
                    <MenuItem key={index} value={litter.id}>{litter.lname}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField name="aon" id="aon_id" label="AON" fullWidth onChange={handleHealthTestInput} value={healthTestData.aon} />
            <FormControl fullWidth>
              <InputLabel id="litter_label">Add to Notional Litter</InputLabel>
              <Select
                name="litter_id"
                id="litter_id"
                label="Add to Notional Litter"
                onChange={handleInput}
                value={formData.litter_id}
              >
                {validLitterList.length > 0 && validLitterList.map((litter, index) => {
                  return (
                    <MenuItem key={index} value={litter.id}>{litter.lname}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField name="ams" id="ams_id" label="AMS" fullWidth onChange={handleHealthTestInput} value={healthTestData.ams} />
            <FormControl fullWidth>
              <InputLabel id="litter_label">Add to Notional Litter</InputLabel>
              <Select
                name="litter_id"
                id="litter_id"
                label="Add to Notional Litter"
                onChange={handleInput}
                value={formData.litter_id}
              >
                {validLitterList.length > 0 && validLitterList.map((litter, index) => {
                  return (
                    <MenuItem key={index} value={litter.id}>{litter.lname}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField name="bss" id="bss_id" label="BSS" fullWidth onChange={handleHealthTestInput} value={healthTestData.bss} />
            <FormControl fullWidth>
              <InputLabel id="litter_label">Add to Notional Litter</InputLabel>
              <Select
                name="litter_id"
                id="litter_id"
                label="Add to Notional Litter"
                onChange={handleInput}
                value={formData.litter_id}
              >
                {validLitterList.length > 0 && validLitterList.map((litter, index) => {
                  return (
                    <MenuItem key={index} value={litter.id}>{litter.lname}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid> */}
          <Grid xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button variant="contained" component="label">
              Upload Main Image
              <input hidden name="main_image" accept="image/*" type="file" id="image" multiple onChange={handleImageUpload} />
            </Button>
          </Grid>
          {formData.main_image &&
            <Grid xs={12}>
              <Typography sx={{ pl: 1, textAlign: 'center' }}> {formData.main_image.name} </Typography>
            </Grid>
          }
          <Grid xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button variant="contained" component="label">
              Upload Images for Gallery
              <input hidden name="gallery_images" accept="image/*" type="file" id="image" multiple onChange={handleImageUpload} />
            </Button>
          </Grid>
          {formData.gallery_images &&
            <Grid xs={12}>
              <Typography sx={{ pl: 1, textAlign: 'center' }}> {formData.gallery_images.map(file => {
                return `${file.name}, `;
              })}</Typography>
            </Grid>
          }
          <Grid xs={12}>
            <Container>
              <Button variant="contained" type='submit'>
                Create Dog
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
    </Box >
  );
};

export default DogCreationForm;