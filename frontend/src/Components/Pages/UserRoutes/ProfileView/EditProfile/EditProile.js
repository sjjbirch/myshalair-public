import { Container, Box, Typography, TextField, FormControl, Button, } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { updateUser } from "../../../../services/authServices";
import { useGlobalState } from "../../../../utils/stateContext";

const EditForm = ({ user, handleProfileSwitch }) => {
  const { dispatch } = useGlobalState();
  const navigate = useNavigate();
  const location = useLocation();
  const mounted = useRef();

  const initialFormData = {
    username: "",
    email: "",
    firstname: '',
    lastname: '',
    address1: '',
    address2: '',
    suburb: '',
    phonenumber: '',
    postcode: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  // on component mount and when mounted, formData or user updates, checks if mounted.current is falsy, if true maps values of user object to formData
  useEffect(() => {
    if (!mounted.current) {
      let filteredUser = { ...formData };
      Object.entries(user).map(user => {
        if (user[1] === null) {
          return filteredUser = {
            ...filteredUser,
            [user[0]]: ''
          };
        } else {
          return filteredUser = {
            ...filteredUser,
            [user[0]]: user[1]
          };
        }
      });
      setFormData(filteredUser);
      mounted.current = true;
    }
  }, [mounted, formData, user]);

  // handles inputs by assigning passed values to formData
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // on form submit, spreads formData into user oject and makes patch request to '/users/:id' using formData.id as id and submitForm, which contains the user object, as data.
  const handleSubmit = (e) => {
    e.preventDefault();
    const submitForm = {
      user: {
        ...formData
      }
    };
    updateUser(formData.id, submitForm)
      .then(reply => {
        if (reply.status === 200) {
          // on status 200 updates sessionStorage and loggedInUser state with new data
          sessionStorage.setItem('user', JSON.stringify(reply.data));
          dispatch({
            type: "setLoggedInUser",
            data: reply.data
          });
          // returns back to main profile page and triggers alert via navigate
          handleProfileSwitch('profile');
          navigate(location.pathname, { state: { alert: true, location: location.pathname, severity: "success", title: `Success`, body: "Your details have been updated" } });
        }
      })
      .catch(e => {
        console.log(e);
        // if any errors triggers alert by navigating to current path
        navigate(location.pathname, { state: { alert: true, location: location.pathname, severity: "error", title: `Error`, body: "Your details could not be updated" } });
      });
  };

  return (
    <>
      <Grid xs={12}>
        <Box component="form" onSubmit={(e) => handleSubmit(e)} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          ml: 'auto',
          mr: 'auto',
          maxWidth: "sm",
        }}>
          <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            <Grid xs={12}>
              <FormControl fullWidth>
                <TextField name="username" required id="username_id" label="Username" onChange={handleInput} value={formData.username} />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <FormControl fullWidth>
                <TextField name="email" required id="email_id" label="Email" onChange={handleInput} value={formData.email} type="email" />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField name="phonenumber" required id="phonenumber_id" label="Phonenumber" onChange={handleInput} value={formData.phonenumber} />
              </FormControl>
            </Grid>
            {/* <Grid xs={12}>
            <FormControl fullWidth>
              <TextField
                name="password"
                required
                id="password_id"
                label="Password"
                type={formData.showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment:
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleShowPassword('password')}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                }}
                onChange={handleInput}
                value={formData.name}

              />
            </FormControl>
          </Grid>
          <Grid xs={12}>
            <FormControl fullWidth>
              <TextField
                name="password_confirmation"
                required
                id="password_confirmation_id"
                label="Enter Password Again"
                type={formData.showPasswordConfirmation ? 'text' : 'password'}
                InputProps={{
                  endAdornment:
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleShowPassword('passwordConfirmation')}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {formData.showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                }}
                onChange={handleInput}
                value={formData.name}

              />
            </FormControl>
          </Grid> */}
            <Grid xs={12} container>
              <Grid xs={12}>
                <Typography variant="h5" sx={{ textAlign: 'center', py: 2 }}>Address Info</Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField name="firstname" required id="first_name_id" label="First Name" onChange={handleInput} value={formData.firstname} />
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField name="lastname" required id="last_name_id" label="Last Name" onChange={handleInput} value={formData.lastname} />
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField name="address1" id="address_l1_id" label="Address line 1" onChange={handleInput} value={formData.address1} />
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField name="address2" id="address_l2_id" label="Address line 2" onChange={handleInput} value={formData.address2} />
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField name="suburb" required id="suburb_id" label="Suburb/Town" onChange={handleInput} value={formData.suburb} />
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField name="postcode" required id="epostcode_id" label="Postcode" onChange={handleInput} value={formData.postcode} type="number" />
                </FormControl>
              </Grid>
            </Grid>
            <Grid xs={12}>
              <Container fluid="true">
                <Button variant="contained" type="submit">Save Changes</Button>
              </Container>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </>
  );

};

export default EditForm;