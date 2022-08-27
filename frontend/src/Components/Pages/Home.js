import temp_avatar from '../Shared/Assests/Temp Avatar.jpg';
import { Container, Typography, Paper, Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { DogCard, useGlobalState } from '../utils/componentIndex';

const Home = () => {
  const { store } = useGlobalState();
  const { dogList } = store;

  // takes in an array of dogs, sorts based on position then selects the 4 highest positon which are set to display
  const topDogs = (dogs) => {
    const orderedDogs = dogs.sort((a, b) => a.position - b.position);
    let displayDogs = [];
    let n = 0;
    orderedDogs.forEach((dog) => {
      if (dog.display && n < 4) {
        n = n + 1;
        displayDogs = [
          ...displayDogs,
          dog
        ];
      }
    });
    return displayDogs;
  };

  return (
    <>
      <Container>
        {/* Main Body Introduction */}
        <Grid container spacing={3} alignItems="center">
          <Grid sm={6}>
            <Box component="img" src={temp_avatar} sx={{ maxWidth: { xs: "100%", lg: "75%" }, maxHeight: '100%', alignSelf: 'center' }} />
          </Grid>
          <Grid sm={6}>
            <Typography variant="p" component="div">
              According to the caption on the bronze marker placed by the Multnomah Chapter of the Daughters of the American Revolution on May 12, 1939, “College Hall (is) the oldest building in continuous use for Educational purposes west of the Rocky Mountains. Here were educated men and women who have won recognition throughout the world in all the learned professions.”
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <Container sx={{ my: 2 }} component={Paper}>
        <Box>
          <Typography variant="h5" sx={{ textAlign: 'center', py: 2 }}>Top Dogs</Typography>
          {/* Cards for display items */}
          <Grid container spacing={3} justifyContent="center" >
            {topDogs(dogList).length === 4 && topDogs(dogList).map((dog, index) => {
              return (
                <Grid key={index} xs={10} sm={5} md={5} lg={3}>
                  <DogCard dog={dog} />
                </Grid>);
            })}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Home;