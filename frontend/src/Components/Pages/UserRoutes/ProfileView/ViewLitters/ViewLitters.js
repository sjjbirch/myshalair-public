import { Box, TableCell, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import { CustomTable, Litter, useGlobalState } from "../../../../utils/componentIndex";

const ViewLitters = ({ litters, user }) => {
  const { store } = useGlobalState();
  const { dogList, loggedInUser } = store;

  return (
    <>
      <Grid xs={12}>
        <Box>
          <Typography variant="h5" sx={{ textAlign: "center", py: 2 }}>Bred Litters</Typography>
          {litters
            ? <CustomTable
              head={
                <>
                  <TableCell />
                  {loggedInUser.admin
                    && <TableCell align='center'>
                      Status
                    </TableCell>}
                  <TableCell align='center'>
                    Litter Name
                  </TableCell>
                  <TableCell align='center'>
                    Breeder
                  </TableCell>
                  <TableCell align='center'>
                    Sire
                  </TableCell>
                  <TableCell align='center'>
                    Dam
                  </TableCell>
                  <TableCell align='center'>
                    Expected Date
                  </TableCell>
                  <TableCell align='center'>
                    Delivered Date
                  </TableCell>
                </>
              }
              body={
                <>
                  {litters.map((litter, index) => {
                    const sire = dogList.find(dog => dog.id === litter.sire_id);
                    const bitch = dogList.find(dog => dog.id === litter.bitch_id);
                    return litter.id !== 1 && <Litter key={index} litter={litter} breeder={user} sire={sire} bitch={bitch} />;
                  })}
                </>
              }
            />
            : <Typography>You have bred no litters</Typography>
          }
        </Box>
      </Grid>
    </>
  );
};

export default ViewLitters;