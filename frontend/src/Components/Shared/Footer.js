import { Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <Box sx={{ mt: 'auto' }}>
        <Grid container justifyContent="space-evenly" alignItems="center">
          <Grid item>
            <Link to={`/`}>
              <Typography varient="p" container="div">
                Home
              </Typography>
            </Link>
            <Link to={`/about`}>
              <Typography varient="p" container="div">
                About Us
              </Typography>
            </Link>
            <Link to={`/contactForm`}>
              <Typography varient="p" container="div">
                Contact Us
              </Typography>
            </Link>
            <Link to={`/signIn`}>
              <Typography varient="p" container="div">
                Sign In/Sign Up
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link to={`/dogs/all`}>
              <Typography varient="p" container="div">
                All Dogs
              </Typography>
            </Link>
            <Link to={`/dogs/males`}>
              <Typography varient="p" container="div">
                Male Dogs
              </Typography>
            </Link>
            <Link to={`/dogs/females`}>
              <Typography varient="p" container="div">
                Female Dogs
              </Typography>
            </Link>
            <Link to={`/dogs/retired`}>
              <Typography varient="p" container="div">
                Retired Dogs
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link to={`/dogs/all`}>
              <Typography varient="p" container="div">
                Litter Adoption Form
              </Typography>
            </Link>
            <Link to={`/dogs/male`}>
              <Typography varient="p" container="div">
                Litter Schedule
              </Typography>
            </Link>
            <Link to={`/dogs/female`}>
              <Typography varient="p" container="div">
                Litter Showcase
              </Typography>
            </Link>
            <Link to={`/dogs/all`}>
              <Typography varient="p" container="div">
                Shows
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Footer;