import temp_avatar from '../Shared/Assests/Temp Avatar.jpg';
import { Container, Grid, Typography } from '@mui/material';

const About = () => {
  return (
    <>
      <Container>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={5} >
            <Typography
              component="img"
              src={temp_avatar}
              width="100%"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography
              varient="p"
              component="div"
              src={temp_avatar}
            >
              The robot clicked disapprovingly, gurgled briefly inside its cubical interior and extruded a pony glass of brownish liquid. "Sir, you will undoubtedly end up in a drunkard's grave, dead of hepatic cirrhosis," it informed me virtuously as it returned my ID card. I glared as I pushed the glass across the table.
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              varient="p"
              component="div"
              src={temp_avatar}
            >
              Cake or pie? I can tell a lot about you by which one you pick. It may seem silly, but cake people and pie people are really different. I know which one I hope you are, but that's not for me to decide. So, what is it? Cake or pie?
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography
              component="img"
              src={temp_avatar}
              width="100%"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              varient="p"
              component="div"
              src={temp_avatar}
            >
              My visit to a slum area after the rainy season was a sad affair. The pits were still full of rain water. There was mud all around. The polluted water had caused various diseases. There was no home without a sick person. Small children suffered from stomach troubles. The govern�ment should immediately rush to the help of the sufferers in the slum area.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default About;