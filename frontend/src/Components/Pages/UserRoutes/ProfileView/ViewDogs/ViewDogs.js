import { Box, TableCell, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { CustomTable, Dog, useGlobalState } from "../../../../utils/componentIndex";

const ViewDogs = ({ dogs, user }) => {
  const { store } = useGlobalState();
  const { loggedInUser } = store;

  return (
    <>
      <Grid xs={12}>
        <Box>
          <Typography variant="h5" sx={{ textAlign: "center", py: 2 }}>Owned Dogs</Typography>
          {dogs
            ? <CustomTable
              head={
                <>
                  <TableCell />
                  <TableCell align="center">
                    Real Name
                  </TableCell>
                  <TableCell align="center">
                    Call Name
                  </TableCell>
                  <TableCell align="center">
                    Owner
                  </TableCell>
                  <TableCell align="center">
                    Breeder
                  </TableCell>
                  <TableCell align="center">
                    Date of Birth
                  </TableCell>
                  <TableCell align="center">
                    Retired Status
                  </TableCell>
                  {loggedInUser.admin
                    && <TableCell align="center">
                      Position
                    </TableCell>}
                </>
              }
              body={
                <>
                  {dogs.map((dog, index) => {
                    return (
                      <Dog key={index} dog={dog} user={user} />
                    );
                  })}
                </>
              }
            />
            : <Typography>You have no dogs</Typography>
          }
        </Box>
      </Grid>
    </>
  );
};

export default ViewDogs;