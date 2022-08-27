import { Box, TableCell, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { CustomTable } from "../../../../utils/componentIndex";
import LitterApplication from "../../../LittersRoute/LitterApplication/LitterApplication";


const ViewApplications = ({ apps, user }) => {

  return (
    <>
      <Grid xs={12}>
        <Box>
          <Typography variant="h5" sx={{ textAlign: "center", py: 2 }}>Submitted Applications</Typography>
          {apps
            ? <CustomTable
              head={
                <>
                  <TableCell />
                  <TableCell align="center">
                    Application Number
                  </TableCell>
                  <TableCell align="center">
                    Applying User
                  </TableCell>
                  <TableCell align="center">
                    Yard Area
                  </TableCell>
                  <TableCell align="center">
                    Fence Height
                  </TableCell>
                  <TableCell align="center">
                    Priority
                  </TableCell>
                  <TableCell align="center">
                    Fulfill State
                  </TableCell>
                </>
              }
              body={
                <>
                  {apps.map((app, index) => {
                    return (
                      <LitterApplication key={index} app={app} user={user} />
                    );
                  })}
                </>
              }
            />
            : <Typography>You have no litter applications</Typography>
          }
        </Box>
      </Grid>
    </>
  );
};

export default ViewApplications;