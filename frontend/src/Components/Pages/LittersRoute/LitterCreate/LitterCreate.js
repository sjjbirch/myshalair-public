import { Grid, FormControl, InputLabel, Container, Paper, Typography, TextField, Select, MenuItem, Button, Slider, FormControlLabel, Switch } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from 'moment';
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useGlobalState } from "../../../utils/componentIndex";
import { postLitter } from "../../../services/litterServices";
import { useLocation, useNavigate, } from "react-router";
import { Link } from "react-router-dom";


// TO-DO

const LitterCreationForm = () => {
  const { store, dispatch } = useGlobalState();
  const { userList, dogList, litterList } = store;
  const navigate = useNavigate();
  const location = useLocation();

  // sets form initial data
  const initialFormData = {
    lname: "",
    breeder_id: '',
    bitch_id: '',
    sire_id: '',
    edate: '',
    adate: '',
    pdate: '',
    esize: 1,
    status: 1,
  };

  // sets form initial state
  const [formData, setFormData] = useState(initialFormData);
  const [notional, setNotional] = useState(false);
  const [breeders, setBreeders] = useState([]);
  const [sires, setSires] = useState([]);
  const [bitches, setBitches] = useState([]);

  // assigns states of breeder, sires, and bitches to filtered lists where dogs are not retired and users are breeders
  useEffect(() => {
    setBreeders(userList.filter(user => user));
    setSires(dogList.filter(dog => dog.sex === 1 && dog.retired === false));
    setBitches(dogList.filter(dog => dog.sex === 2 && dog.retired === false));
  }, [userList, dogList]);

  // formats date input to use moment and passes it to handle input
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

  // sets aria value text
  const sliderValue = (value) => {
    return `${value} puppies`;
  };

  // controls notional switch by setting form status to 1 or 3 depending on false or true
  const handleChangeNotional = (e) => {
    setNotional(e.target.checked);
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
  };

  // general input handler
  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "esize") {
      let fixedValue = 1;
      if (Boolean(parseInt(e.target.value))) {
        fixedValue = parseInt(e.target.value);
      } else {
        fixedValue = 1;
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

  // on form submit makes post request form formData
  const handleSubmit = (e) => {
    e.preventDefault();
    postLitter(formData)
      .then((litter) => {
        // on success makes dispatch to update local litterList
        if (litter.status === 201) {
          dispatch({
            type: 'updateLitterList',
            data: [...litterList, litter.data]
          });
          // clears form data
          setFormData(initialFormData);
          // navigates back to litter manage and alerts user of successful creation
          navigate('/litters/manage', { state: { alert: true, location: "/litters/manage", severity: "success", title: "Litter Created", body: `Litter "${litter.data.lname}" was successfully created` } });
        }
      })
      .catch(e => {
        // navigates to current page and alerts user of any errors
        navigate(location.pathname, { state: { alert: true, location: location.pathname, severity: "error", title: e.response.status, body: e.response.statusText } });
      });
  };


  return (
    <Box component="form" onSubmit={(e) => handleSubmit(e)} sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Paper sx={{ padding: 4 }}>
        <FormControlLabel
          control={<Switch checked={notional} onChange={handleChangeNotional} />}
          label="Set Litter to Notional"
        />
        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Typography variant="h5" component="h1" sx={{ textAlign: "center" }}>Create Litter Entry</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField name="lname" required fullWidth id="lname" label="Litter Name" autoFocus onChange={handleInput} value={formData.name} />
          </Grid>
          <Grid item xs={12}>
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
                {Object.values(breeders).map(breeder => {
                  return (
                    <MenuItem key={breeder.id} value={breeder.id}>{breeder.username}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
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
                {Object.values(bitches).map(dog => {
                  return (
                    <MenuItem key={dog.id} value={dog.id}>{dog.callname}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
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
                {Object.values(sires).map(dog => {
                  return (
                    <MenuItem key={dog.id} value={dog.id}>{dog.callname}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <DatePicker
                name="pdate"
                id="pdate_picker"
                label="Select Planned Delivery Date"
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
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={6} sm={3} sx={{ display: "flex", justifyContent: "center" }}>
            <FormControl fullWidth>
              <TextField name="esize" id="esize-input" label="Expected Litter Size" onChange={handleInput} value={formData.esize} type="number" />
              <Slider
                name="esize"
                id="esize-slider"
                label="esize-label"
                min={1}
                max={13}
                getAriaValueText={sliderValue}
                valueLabelDisplay="auto"
                onChange={handleInput}
                value={formData.esize}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Container>
              <Button variant="contained" type='submit'>
                Create Litter
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

export default LitterCreationForm;