import { Grid, FormControl, Input, InputLabel, FormHelperText, Container, Paper, FormGroup, Typography, TextField, Select, MenuItem, Button, Slider } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import moment from 'moment';
import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { getUsers } from "../services/authServices";
import { useGlobalState } from "../utils";

const LitterCreationForm = () => {
  const { store, dispatch } = useGlobalState();
  const { dogList, userList } = store;
  const defaultValues = {
    lname: "",
    breeder_id: '',
    bitch_id: '',
    sire_id: '',
    edate: '',
    adate: '',
    pdate: '',
    esize: 1,
  };
  const females = Object.entries(dogList).filter(dog => dog[1].sex = 2);
  const males = Object.entries(dogList).filter(dog => dog[1].sex = 1);
  const breeder = Object.entries(userList).filter(user => user[1].breeder = true);
  const [formValues, setFormValues] = useState(defaultValues);
  const [date, setDate] = useState();
  const ref = useRef();

  useEffect(() => {
    getUsers()
      .then(users => {
        dispatch({
          type: "setUserList",
          data: users
        });
      })
      .catch(e => console.log(e));
    setFormValues({
      ...formValues
    });
  }, []);

  const handleDate = (e, name) => {
    console.log(e);
    console.log(moment(e).format('YYYY-MM-DDTHH:mm'));
    const date = moment(e).format('YYYY-MM-DDTHH:mm');
    const newDate = {
      target: {
        name: name,
        value: date
      }
    };
    handleInput(newDate);
  };

  const consoleLog = (e, id) => {
    console.log("Event:", e, "ID", id);
  };

  const sliderValue = (value) => {
    return `${value} puppies`;
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    console.log(name, ":", value);
    if (name === "esize") {
      let fixedValue = 1;
      if (Boolean(parseInt(e.target.value))) {
        fixedValue = parseInt(e.target.value);
      } else {
        fixedValue = 1;
      }
      console.log(fixedValue);
      if (fixedValue > 24) fixedValue = 24;
      if (fixedValue < 1) fixedValue = 1;

      setFormValues({
        ...formValues,
        [name]: fixedValue,
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
    console.log("form:", formValues);
  };


  return (
    <Box component="form" sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Paper sx={{ padding: 4 }}>
        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Typography variant="h5" component="h1" sx={{ textAlign: "center" }}>Create Litter Entry</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField name="lname" fullWidth id="lname" label="Litter Name" autoFocus onChange={handleInput} value={formValues.name} />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="breeder_label">Select Breeder</InputLabel>
              <Select
                name="breeder_id"
                id="breeder_id"
                label="breeder_label"
                onChange={handleInput}
                value={formValues.breeder_id}
              >
                {breeder.map(breeder => {
                  return (
                    <MenuItem key={breeder[0]} value={breeder[1].id}>{breeder[1].username}</MenuItem>
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
                id="bitch_id"
                label="bitch_label"
                onChange={handleInput}
                value={formValues.bitch_id}
              >
                {females.map(dog => {
                  return (
                    <MenuItem key={dog[0]} value={dog[1].id}>{dog[1].callname}</MenuItem>
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
                id="sire_id"
                label="sire_label"
                onChange={handleInput}
                value={formValues.sire_id}
              >
                {males.map(dog => {
                  return (
                    <MenuItem key={dog[0]} value={dog[1].id}>{dog[1].callname}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <DateTimePicker
                name="pdate"
                id="pdate_picker"
                label="Select Predicted Delivery Date"
                ampm
                inputFormat="DD/MM/YYYY HH:mm"
                mask="__/__/____ __:__"
                views={['year', 'month', 'day', 'hours', 'minutes']}
                minTime={moment('0:0', 'HH:mm')}
                maxTime={moment('23:59', 'HH:mm')}
                value={formValues.pdate}
                onChange={(e) => { handleDate(e, "pdate"); }}
                onAccept={(e) => { handleDate(e, "pdate"); }}
                renderInput={(params) => <TextField {...params} helperText="dd/mm/yyyy hh:mm(24 hour time)"></TextField>}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <DateTimePicker
                name="edate"
                ref={ref}
                id="edate_picker"
                label="Select Expected Delivery Date"
                ampm
                inputFormat="DD/MM/YYYY HH:mm"
                mask="__/__/____ __:__"
                views={['year', 'month', 'day', 'hours', 'minutes']}
                minTime={moment('0:0', 'HH:mm')}
                maxTime={moment('23:59', 'HH:mm')}
                value={formValues.edate}
                onChange={(e) => { handleDate(e, "edate"); }}
                onAccept={(e) => { handleDate(e, "edate"); }}
                renderInput={(params) => <TextField {...params} helperText="dd/mm/yyyy hh:mm(24 hour time)"></TextField>}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <DateTimePicker
                name="adate"
                id="adate_picker"
                label="Select Actual Delivery Date"
                ampm
                inputFormat="DD/MM/YYYY HH:mm"
                mask="__/__/____ __:__"
                views={['year', 'month', 'day', 'hours', 'minutes']}
                minTime={moment('0:0', 'HH:mm')}
                maxTime={moment('23:59', 'HH:mm')}
                value={formValues.adate}
                onChange={(e) => { handleDate(e, "adate"); }}
                renderInput={(params) => <TextField {...params} helperText="dd/mm/yyyy hh:mm(24 hour time)"></TextField>}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3} sx={{ display: "flex", justifyContent: "center" }}>
            <FormControl fullWidth>
              <TextField name="esize" id="esize-input" label="Expected Litter Size" onChange={handleInput} value={formValues.esize} type="number" />
              <Slider
                name="esize"
                id="esize-slider"
                label="esize-label"
                min={1}
                max={24}
                getAriaValueText={sliderValue}
                valueLabelDisplay="auto"
                onChange={handleInput}
                value={formValues.esize}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>

          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default LitterCreationForm;