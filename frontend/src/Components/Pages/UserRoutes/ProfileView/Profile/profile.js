import { Box, Typography } from '@mui/material';
import Grid from "@mui/material/Unstable_Grid2/";

const Profile = (props) => {
  const { user } = props;

  return (
    <>
      <Grid xs={12}>
        <Box sx={{ py: 1, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h4">{user.username}</Typography>
        </Box>
      </Grid>
      <Grid xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
          {user.breeder && <Typography>Breeder</Typography>}{user.admin && <Typography>Admin</Typography>}
        </Box>
      </Grid>
      <Grid xs={12}>
        <Box>
          Email: {user.email}
        </Box>
      </Grid>
      <Grid xs={12}>
        <Box>
          Phonenumber: {user.phonenumber}
        </Box>
      </Grid>
      <Grid xs={12}>
        <Box>
          Fullname: {user.firstname} {user.lastname}
        </Box>
      </Grid>
      <Grid xs={12}>
        <Box>
          Address: {user.address1} {user.address2} {user.state} {user.postcode}
        </Box>
      </Grid>
    </>
  );
};

export default Profile;