import { FormControl, InputLabel, Container, Paper, Typography, TextField, Select, MenuItem, Button, Box, RadioGroup, FormControlLabel, Radio, FormLabel } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import { useEffect, useState } from "react";
import { useGlobalState } from "../../../utils/componentIndex";
import { useLocation, useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { getDog, patchDog, getDogs } from "../../../services/dogsServices";
import { colours, healthTestKeys, healthTestValues } from "../../../utils/helpers/generalTools";

// can't update litter of dog due to to lack of support from back

const DogUpdateForm = () => {
  const { store, dispatch } = useGlobalState();
  const { litterList } = store;
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const fd = require('form-data-extended');

  // sets the initial data of the component
  const initialFormData = {
    callname: "",
    realname: "",
    sex: '',
    description: '',
    colour: '',
    chipnumber: '',
  };
  // sets initial state of application
  const [formData, setFormData] = useState(initialFormData);
  const [dog, setDog] = useState([]);
  const [healthTestData, setHealthTestData] = useState(healthTestKeys);
  const [litterData, setLitterData] = useState({ litter_id: '' });
  const [validLitterList, setValidLitterList] = useState([]);
  const [dogColours, setDogColours] = useState([]);

  // on component mount, params update and litterList update, makes get request for a dog, if response status is 200, and assigns specific values to the form state, healthtest state, litterdata state and validlitterlist state, also saves the whole data object to dog state
  useEffect(() => {
    if (dog.length === 0) {
      getDog(params.id)
        .then(dog => {

          if (dog.status === 200) {
            const { data } = dog;
            setDog(data);
            let dogColour = data.dog.colour;
            if (dogColour === 0) {
              dogColour = '';
            }
            setFormData({
              ...formData,
              id: data.dog.id,
              realname: data.dog.realname,
              callname: data.dog.callname,
              sex: data.dog.sex,
              description: data.dog.description || '',
              colour: dogColour,
              chipnumber: data.dog.chipnumber || '',
            });
            setHealthTestData({
              ...healthTestData,
              pra: data.healthtest.pra,
              fn: data.healthtest.fn,
              aon: data.healthtest.aon,
              ams: data.healthtest.ams,
              bss: data.healthtest.bss,
            });
            if (data.litter) {
              setValidLitterList([
                data.litter,
                ...litterList.filter(litter => litter.status === 3)
              ]);
              setLitterData({ litter_id: data.litter.id });
            } else {
              setValidLitterList(litterList.filter(litter => litter.status === 3));
            }
          }
        })
        .catch(e => console.log(e)); // console logs any errors
      // finds litters with a status of 3, meaning they are nomial
      // setValidLitterList([
      //   ...validLitterList,
      //   ...litterList.filter(litter => litter.status === 3)
      // ]);
      setDogColours(colours); // assigns colours to dogColours state
    }
  }, [litterList, params.id, dog, formData, healthTestData]);

  // handles the forms general input by desctructuring name and value from triggering event target
  const handleInput = (e) => {
    const { name, value } = e.target;

    // runs custom form state update if name is 'sex'
    if (name === 'sex') {
      setFormData({
        ...formData,
        [name]: parseInt(value)
      });
      // runs custom form state update if name is 'litter_id'
    } else if (name === 'litter_id') {
      setLitterData({ [name]: value });
      setFormData({
        ...formData,
        litter: {
          [name]: value
        }
      });
    }
    else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // handles input for health tests
  const handleHealthTestInput = (e) => {
    const { name, value } = e.target;
    setHealthTestData({
      ...healthTestData,
      [name]: parseInt(value)
    });
    setFormData({
      ...formData,
      healthtest: {
        [name]: value
      }
    });
  };

  // handles image uploads
  const handleImageUpload = (e) => {
    e.preventDefault();
    const { name, files } = e.target;

    // assigns image file if name is 'main_image'
    if (name === 'main_image') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
      // assigns array of images if name is 'gallery_images'
    } else if (name === 'gallery_images') {
      setFormData({
        ...formData,
        [name]: [...files]
      });
    }
  };

  // on form submit, creates empty dog object, filters out any empty strings and assigns the rest to the dog object. once done converts object into FormData format and patches to back
  const handleSubmit = (e) => {
    e.preventDefault();

    let dog = {
      // healthtest: { ...healthTestData }
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
    patchDog(params.id, postForm)
      .then(dog => {

        // if reply.status === 200 makes get request to back and refreshes dogList with reply
        if (dog.status === 200) {
          getDogs()
            .then(dogs => {
              dispatch({
                type: 'setDogList',
                data: dogs
              });
            })
            .catch(e => console.log(e));
          // resets form values
          setFormData(initialFormData);
          setHealthTestData(healthTestKeys);
          // navigates back to dogs manage and alerts user of successful creation
          navigate('/dogs/manage', { state: { alert: true, location: "/dogs/manage", severity: "success", title: `${dog.status} Success`, body: `${dog.data.callname} Updated` } });
        }
      })
      .catch(e => {
        console.log(e);
        // navigates to current page and alerts user of any errors
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
            <Typography variant="h3" component="h1" sx={{ textAlign: "center" }}>{dog.dog && `Update ${dog.dog.callname}`}</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField name="realname" required fullWidth id="realname" label="Dog's Real Name" autoFocus onChange={handleInput} value={formData.realname} />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField name="callname" required fullWidth id="callname" label="Dog's Call Name" onChange={handleInput} value={formData.callname} />
          </Grid>
          <Grid xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <FormControl>
              <FormLabel id="dog-sex-label" >Select Sex</FormLabel>
              <RadioGroup
                row
                name="sex"
                label='Select Sex'
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
              <InputLabel id="colour_label">Select Colour</InputLabel>
              <Select
                name="colour"
                fullWidth
                id="colour"
                labelId="colour_label"
                label="Select Colour"
                onChange={handleInput}
                value={formData.colour}
              >
                {dogColours.map((colour, index) => {
                  return colour.id !== 0 && <MenuItem key={index} value={colour.id}>{colour.colour}</MenuItem>;
                }
                )}
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
                    <MenuItem key={index} value={litter.id}>{litter.lname} {litter.status !== 3 && "(Non Notional)"}</MenuItem>
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
                Update Dog
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
  );
};

export default DogUpdateForm;