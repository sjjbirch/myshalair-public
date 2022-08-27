import { Box, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getShowCase } from "../../../services/litterServices";
// import { useGlobalState } from "../../../utils/stateContext";
import DogCard from "../../DogsRoute/Dogcard/DogCard";


const LitterDetails = () => {
  // sets up needed hooks
  const params = useParams();
  const navigate = useNavigate();

  // sets up page state
  const [litter, setLitter] = useState([]);
  const [images, setImages] = useState([]);
  const [sire, setSire] = useState([]);
  const [bitch, setBitch] = useState([]);
  const [puppies, setPuppies] = useState([]);

  // makes get to '/showcase/id' using params.id as id on component mount and when params and navigate updates, then if reply.status is 200 assigns returned data to states
  useEffect(() => {
    getShowCase(params.id)
      .then(reply => {
        if (reply.status === 200) {
          setLitter(reply.data.litter);
          setImages(reply.data.images);
          setSire(reply.data.sire);
          setBitch(reply.data.bitch);
          setPuppies(reply.data.puppies);
        }
      })
      .catch(e => {
        console.log(e);
        // if errors just redirects to 404, didn't have time figure out proper solution
        navigate('404');
      });
  }, [params, navigate]);

  return (
    <>
      <Box component={Paper} sx={{
        ml: 'auto',
        mr: 'auto',
        maxWidth: "md",
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid xs={12} sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h3">{litter.lname}</Typography>
          </Grid>
          <Grid xs={12} sx={{ width: { xs: '100&', sm: '75%', md: '50%' } }}>
            <Box component='img' src={images[0]} sx={{ height: '100%', width: '100%', objectFit: 'contain' }} />
          </Grid>
          <Grid container sx={{ display: 'flex', justifyContent: 'space-evenly' }} component={Paper}>
            <Grid xs={12}>
              <Typography variant="h4" sx={{ textAlign: "center", py: 2 }} component={Paper}>Parentage</Typography>
            </Grid>
            <Grid xs={12} sm={5} sx={{ textAlign: 'center', p: 1, my: 2 }} component={Paper}>
              <Typography variant="h5" sx={{ py: 2, my: 1 }} component={Paper}>
                Sire
              </Typography>
              <DogCard dog={sire} />
            </Grid>
            <Grid xs={12} sm={5} sx={{ textAlign: 'center', p: 1, my: 2, display: 'flex', flexDirection: 'column' }} component={Paper}>
              <Typography variant="h5" sx={{ py: 2, my: 1 }} component={Paper}>
                Dam
              </Typography>
              <DogCard dog={bitch} />
            </Grid>
          </Grid>
          <Grid container xs={12} sx={{ display: 'flex', justifyContent: 'space-evenly' }} component={Paper}>
            <Grid xs={12}>
              <Typography variant="h6" sx={{ textAlign: "center", py: 2 }} component={Paper}>Puppies</Typography>
            </Grid>
            {puppies.map((puppy, index) => {
              return (
                <Grid xs={12} sm={4} key={index} sx={{ display: 'flex', flexDirection: 'column', m: 2 }} component={Paper}>
                  <DogCard dog={puppy} />
                </Grid>
              );
            })}
          </Grid>
          {images.length > 1
            && <Grid container xs={12} component={Paper} sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <Grid xs={12}>
                <Typography variant="h4" sx={{ textAlign: "center", py: 2 }} component={Paper}>Gallery</Typography>
              </Grid>
              {images.map((image, index) => {
                return index !== 0
                  && <Grid key={index} xs={6} sm={3} sx={{ p: 1 }}>
                    <Box component='img' src={image} sx={{ height: '100%', width: '100%', objectFit: 'contain' }} />
                  </Grid>;
              })}
            </Grid>}
        </Grid>
      </Box>
    </>
  );
};

export default LitterDetails;