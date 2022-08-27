import { Container, Box, Paper, Typography, TextField, FormControl, Button, InputAdornment, IconButton } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { signUp } from "../../../services/authServices";
import { Link } from "react-router-dom";

const SignUpForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialFormData = {
    username: "",
    email: "",
    password: "",
    password_confirmation: '',
    phonenumber: '',
    firstname: '',
    lastname: '',
    address1: '',
    address2: '',
    postcode: "",
    showPassword: false,
    showPasswordConfirmation: false
  };
  const [formData, setFormData] = useState(initialFormData);

  // controls if passords are visibile or not
  const handleShowPassword = (name) => {
    if (name === "password") {
      setFormData({
        ...formData,
        showPassword: !formData.showPassword
      });
    } else if (name === "passwordConfirmation") {
      setFormData({
        ...formData,
        showPasswordConfirmation: !formData.showPasswordConfirmation
      });
    }
  };

  // prevents coping of password
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // manages form input by saving input values to state
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // on form submit checks if password and passord_confirmation match
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password === formData.password_confirmation) {
      // if true removes show controls and saves rest to user object to be submitted
      delete formData.showPassword;
      delete formData.showPasswordConfirmation;
      const submitForm = {
        user: {
          ...formData
        }
      };
      // makes post to /users/ with submitForm as data then resets form and navigates to root with alert
      signUp(submitForm)
        .then((user) => {
          setFormData(initialFormData);
          navigate("/", { state: { alert: true, location: '/', severity: 'warning', title: "Check Email", body: "Please check your emails for the account confirmation link" } });
        })
        .catch(e => {
          console.log(e.response);
          navigate("/", { state: { alert: true, location: '/', severity: 'error', title: `${e.response.status} Error`, body: `${e.response.data.message}` } });
        });
    } else {
      navigate(location.pathname, { state: { alert: true, location: location.pathname, severity: "error", title: "Password miss match", body: "password and password confirmation do not match" } });
    }
  };

  return (
    <>
      <Box component="form" onSubmit={(e) => handleSubmit(e)} sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ml: 'auto',
        mr: 'auto',
        maxWidth: "sm",
      }}>
        <Paper sx={{ px: 2 }}>
          <Grid container spacing={2} sx={{ justifyContent: 'center', py: 2 }}>
            <Grid xs={12}>
              <Typography variant="h4" component="h1" sx={{ textAlign: "center", py: 2 }}>Sign Up</Typography>
            </Grid>
            <Grid xs={12}>
              <FormControl fullWidth>
                <TextField name="username" required id="username_id" label="Username" onChange={handleInput} value={formData.name} />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <FormControl fullWidth>
                <TextField name="email" required id="email_id" label="Email" onChange={handleInput} value={formData.name} type="email" />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
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
            <Grid xs={12} sm={6}>
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
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField name="phonenumber" required id="phonenumber_id" label="Enter Phone Number" onChange={handleInput} value={formData.name} />
              </FormControl>
            </Grid>
            <Grid xs={12} container>
              <Grid xs={12}>
                <Typography variant="h5" sx={{ textAlign: 'center', py: 2 }}>Home Address Info</Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField name="firstname" required id="first_name_id" label="First Name" onChange={handleInput} value={formData.name} />
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField name="lastname" required id="last_name_id" label="Last Name" onChange={handleInput} value={formData.name} />
                </FormControl>
              </Grid>
              <Grid xs={12}>
                <FormControl fullWidth>
                  <TextField name="address1" id="address_l1_id" label="Address line 1" onChange={handleInput} value={formData.name} />
                </FormControl>
              </Grid>
              <Grid xs={12}>
                <FormControl fullWidth>
                  <TextField name="address2" id="address_l2_id" label="Address line 2" onChange={handleInput} value={formData.name} />
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField name="suburb" required id="suburb_id" label="Suburb/Town" onChange={handleInput} value={formData.name} />
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField name="postcode" required id="epostcode_id" label="Postcode" onChange={handleInput} value={formData.name} type="number" />
                </FormControl>
              </Grid>
            </Grid>
            <Grid xs={12}>
              <Container fluid="true">
                <Button variant="contained" type="submit">Sign Up</Button>
                <Link to="/user/signIn">
                  <Button variant="text">sign in</Button>
                </Link>
              </Container>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );

};

export default SignUpForm;