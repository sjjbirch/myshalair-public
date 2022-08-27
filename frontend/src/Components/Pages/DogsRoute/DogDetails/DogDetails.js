import { Box, Paper, Typography } from '@mui/material';
import Grid from "@mui/material/Unstable_Grid2";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDog } from "../../../services/dogsServices";
import moment from 'moment';
import { useGlobalState } from '../../../utils/stateContext';
import DogCard from '../Dogcard/DogCard';
import { healthTestKeys, healthTestValues } from '../../../utils/helpers/generalTools';

const DogDetails = () => {
  // setting up required hooks
  const { store } = useGlobalState();
  const params = useParams();
  const navigate = useNavigate();

  // destructuring objects to make required variables easier to access
  const { dogList, loggedInUser } = store;

  // sets up states for DogDetails component
  const [dogDetails, setDogDetails] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [healthtest, setHealthtest] = useState([]);
  const [litter, setLittter] = useState([]);
  const [litters, setLitters] = useState([]);
  const [owner, setOwner] = useState([]);

  // const [viewPedigree, setViewPedigree] = useState(false);

  // Inputs:
  //    params: object
  //    dispatch: function
  // Function: runs contents on mount and if params or dispatch updates
  // Used for: updating component state on mount and when information changes
  useEffect(() => {
    // Inputs: params.id: integer
    // Outputs: backend response
    // Function: makes get request to '/dogs/:id' where id is the provided integer, then takes response and assigns the values to the various states
    // Used for: providing the details needed to populate the DogDetails component
    getDog(params.id)
      .then(res => {
        const { data } = res;
        setDogDetails(data.dog);
        setHealthtest(data.healthtest || []);
        setLitters(data.litters || []);
        setLittter(data.litter || []);
        setGallery(data.gallery_images || []);
        setOwner(data.owner_details || []);
      })
      .catch(e => {
        console.log(e);
        navigate('./404');
      });
  }, [params, navigate]);

  // Inputs: test:integer
  // Outputs: string
  // Function: checks if test is not null, if true searches healthTestValues array for matching id and returns the assosiated status string. If test is null just returns "Unknown string"
  // Used for: translates provided test integers from backend into their equivilant string value
  const healthTestAnalizer = (test) => {
    return test !== null ? healthTestValues.find(result => test === result.id).status : "Unknown";
  };

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
            <Typography variant="h3">{dogDetails.realname}</Typography>
          </Grid>
          <Grid xs={6} sx={{ textAlign: 'center' }}>
            {dogDetails.dob
              ? <>
                {/* uses moment to format provided dog dob value into a Jan 1st 2000 format */}
                <Typography >Born: {moment(dogDetails.dob).format('MMM Do YYYY')}</Typography>
              </>
              :
              <Typography>Not Provided</Typography>}
          </Grid>
          <Grid xs={6} sx={{ textAlign: 'center' }}>
            <Typography>
              Sex: {(dogDetails.sex === 1 && "Male") || (dogDetails.sex === 2 && "Female")}
            </Typography>
          </Grid>
          <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <Box sx={{ width: { xs: '100&', sm: '75%', md: '50%' } }}>
              <Box component='img' src={dogDetails.main_image} sx={{ width: '100%', objectFit: 'contain' }} />
            </Box>
          </Grid>
          <Grid xs={12} sx={{ textAlign: 'center', p: 2 }}>
            <Typography>
              {dogDetails.description}
            </Typography>
          </Grid>
          {/* <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" onClick={() => { setViewPedigree(!viewPedigree); }}>View Pedigree Breakdown</Button>
          </Grid>
          <Collapse in={viewPedigree} unmountOnExit>
            <Grid xs={12} sx={{ py: 2 }}>
              <ViewPedigree dog={dogDetails} />
            </Grid>
          </Collapse> */}
          {(loggedInUser.admin && owner !== [])
            && <Grid xs={12} container component={Paper} sx={{ py: 2, justifyContent: 'center' }}>
              <Grid xs="auto" sx={{ textAlign: 'center' }} component={Paper} >
                <Typography>Name: {owner.firstname} {owner.lastname}</Typography>
                <Typography>Username: {owner.username}</Typography>
                <Typography>Email: {owner.email}</Typography>
                <Typography>Phonenumber: {owner.phonenumber}</Typography>
                <Typography>Address: {owner.address1} {owner.address2}, {owner.suburb}, {owner.postcode}</Typography>
              </Grid>
            </Grid>}
          {healthtest.length !== 0
            && <Grid xs={12} container component={Paper} sx={{ py: 2 }}>
              <Grid xs={12}>
                <Typography variant="h4" sx={{ textAlign: 'center', py: 2 }} component={Paper}>Health Test</Typography>
              </Grid>
              <Grid xs={12} container sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                {Object.entries(healthTestKeys).map((key, index) => {
                  const testResult = Object.entries(healthtest).find(test => test[0] === key[0]);
                  return (
                    <Grid key={index} xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', p: 2 }}>
                      <Typography variant='h6'>{`${testResult[0].toUpperCase()}: `}&nbsp;</Typography>
                      <Typography variant='body1'>{healthTestAnalizer(testResult[1])}</Typography>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>}
          {litter.length !== 0
            && <Grid xs={12} container component={Paper} sx={{ display: 'flex', justifyContent: 'space-evenly', py: 2 }}>
              <Grid xs={12}>
                <Typography variant="h4" sx={{ textAlign: "center", py: 2 }} component={Paper}>Litter</Typography>
              </Grid>
              <Grid xs={12} container sx={{ display: 'flex', justifyContent: 'space-evenly', textAlign: 'center' }}>
                <Grid xs={12} sm={5}>
                  <Typography variant="h6">Sire</Typography>
                  <DogCard dog={dogList.find(dog => dog.id === litter.sire_id)} />
                </Grid>
                <Grid xs={12} sm={5}>
                  <Typography variant="h6">Dam</Typography>
                  <DogCard dog={dogList.find(dog => dog.id === litter.bitch_id)} />
                </Grid>
              </Grid>
            </Grid>}
          {litters.length > 0
            && <Grid xs={12} container sx={{ display: 'flex', justifyContent: 'space-evenly', py: 2 }} component={Paper}>
              <Grid xs={12}>
                <Typography variant="h4" sx={{ textAlign: "center", py: 2 }} component={Paper}>{(dogDetails.sex === 1 && "Sired") || (dogDetails.sex === 2 && "Damed")} Litters</Typography>
              </Grid>
              {litters.map((litter, index) => {
                return litter.id !== 1 &&
                  <Grid key={index} xs={12} sm={5} sx={{ textAlign: 'center', p: 1, my: 2 }} component={Paper}>
                    <Box>
                      <Box component='img' src={litter.main_image} sx={{ height: '100%', width: '100%', objectFit: 'contain' }} />
                    </Box>
                  </Grid>;

              })}
            </Grid>}
          {gallery.length > 0
            && <Grid xs={12} container sx={{ display: 'flex', justifyContent: 'space-evenly', py: 2 }} component={Paper}>
              <Grid xs={12}>
                <Typography variant="h6" sx={{ textAlign: "center", py: 2 }} component={Paper}>Dog's Gallery</Typography>
              </Grid>

              {gallery.map((image, index) => {
                return (
                  <Grid xs={12} sm={4} key={index} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', overflow: 'hidden', p: 1, m: 2 }}>
                    <Box component='img' src={image} sx={{ height: '100%', width: '100%', objectFit: 'contain' }} />
                  </Grid>
                );
              })}
            </Grid>}
          {/* {images.length > 1
              && <Grid container component={Paper} sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Grid xs={12}>
                  <Typography variant="h4" sx={{ textAlign: "center", py: 2 }} component={Paper}>Gallery</Typography>
                </Grid>
                {images.map((image, index) => {
                  return index !== 0
                    && <Grid key={index} xs={6} sm={3} sx={{ p: 1 }}>
                      <Box component='img' src={image} sx={{ height: '100%', width: '100%', objectFit: 'contain' }} />
                    </Grid>;
                })}
              </Grid>} */}
        </Grid>
      </Box>
    </>
  );
};

export default DogDetails;