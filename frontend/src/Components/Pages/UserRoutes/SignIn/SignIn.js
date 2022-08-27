import { Container, Button, Grid, Box, Paper, Typography, FormControl, TextField, InputAdornment, IconButton } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from "react";
import { useNavigate } from "react-router";
import { useGlobalState } from "../../../utils/componentIndex";
import { signIn } from "../../../services/authServices";
import { Link } from "react-router-dom";

const SignInForm = () => {
  const { initialState, dispatch } = useGlobalState();
  const navigate = useNavigate();

  const initialFormData = {
    email: "",
    password: ""
  };
  const [formData, setFormData] = useState(initialFormData);

  // controls if password is being show or hidden
  const handleShowPassword = () => {
    setFormData({
      ...formData,
      showPassword: !formData.showPassword
    });
  };

  // prevents copying of password
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // on form submit spreads formData into user object which is contained in submitForm
  const handleSubmit = (e) => {
    e.preventDefault();
    const submitForm = {
      user: {
        ...formData
      }
    };
    //makes post to '/users/sign_in/' with submitForm as data
    signIn(submitForm)
      .then((user) => {
        // on status 200 assigns response to sessionStorage and clears globalState
        // if (user.status === 201) {
        sessionStorage.setItem("user", JSON.stringify(user.data));
        dispatch({
          type: "cleanState",
          payload: initialState
        });
        // clears form and navigates back to root while triggering alert
        setFormData(initialFormData);
        navigate("/", { state: { alert: true, location: '/', severity: 'success', title: `Welcome ${user.data.username}`, body: `You have successfully logged in` } });
      }
        // }
      )
      .catch(e => {
        console.log(e.response);
        navigate("/", { state: { alert: true, location: '/', severity: 'error', title: `${e.response.status} ${e.response.data.success}`, body: `${e.response.data.message}` } });
      });
  };

  // saves input from text fields to formState
  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAdminLogin = () => {
    setFormData({
      ...formData,
      email: "1@qwerty.com",
      password: "qwerty"
    });
  };

  const handleUserLogin = () => {
    setFormData({
      ...formData,
      email: "2@qwerty.com",
      password: "qwerty"
    });
  };

  return (
    <>
      <Box component="form" data-testid="form" onSubmit={(e) => handleSubmit(e)} sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ml: 'auto',
        mr: 'auto',
        maxWidth: "sm",
      }}>
        <Paper sx={{ padding: 4 }}>
          <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            <Grid item xs={12} sx={{ mb: 3 }}>
              <Typography variant="h5" component="h1" sx={{ textAlign: "center" }} data-testid="sign-in-title">Sign In</Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  name="email"
                  required id="email_id"
                  type="email"
                  label="Email"
                  onChange={handleInput}
                  value={formData.email}
                  inputProps={{ "data-testid": "sign-in-email" }} />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  name="password"
                  required
                  data-testid="password"
                  id="password_id"
                  label="Password"
                  onChange={handleInput}
                  value={formData.password}
                  type={formData.showPassword ? 'text' : 'password'}
                  inputProps={{ "data-testid": "sign-in-password" }}
                  InputProps={{
                    endAdornment:
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                  }}

                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Container fluid="true">
                <Button variant="contained" type="submit" data-testid="sign-in-submit">Sign In</Button>
                <Link to="/user/signUp">
                  <Button variant="text">sign up</Button>
                </Link>
              </Container>
            </Grid>
          </Grid>
        </Paper>
        <Button variant="contained" onClick={handleAdminLogin} type="submit">Log In Admin</Button>
        <Button variant="contained" onClick={handleUserLogin} type="submit">Log In User</Button>
      </Box>

    </>
  );

};

export default SignInForm;