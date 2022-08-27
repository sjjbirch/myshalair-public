import { Box, Typography, Paper, TableCell, TableRow } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import { useEffect, useState } from "react";
import { getLitterApp } from "../../../services/litterServices";
import { CustomTable, DogCard, useGlobalState } from "../../../utils/componentIndex";
import { colours } from "../../../utils/helpers/generalTools";

const LitterApplicationDetails = (props) => {
  const { store } = useGlobalState();
  const { litterList, userList } = store;

  const [applicationDetails, setApplicationDetais] = useState([]);
  const [allocatedPuppy, setAllocatedPuppy] = useState([]);
  const [children, setChildren] = useState([]);
  const [pets, setPets] = useState([]);

  // on component mount, or props, applicationDetails, litterList and userList update, checks if props.id matches the applicationDetails id, if it doesn't makes get to back with id and fills state on status 200
  useEffect(() => {
    if (props.id !== applicationDetails.id) {
      getLitterApp(props.id)
        .then(litterApp => {

          if (litterApp.status === 200) {
            const { data } = litterApp;
            // checks for sex preferance and provides strings accordingly
            const sexPref = data.litterApplication.sex_preference === 1
              ? "Male"
              : data.litterApplication.sex_preference === 2
                ? "Female"
                :
                "No Preferance";
            // checks for collour preferance, and assings values accordingly
            const colourPref = data.litterApplication.colour_preference !== null
              ? colours.find(colour => colour.id === data.litterApplication.colour_preference).colour
              : colours[0].colour;
            setApplicationDetais({
              ...data.litterApplication,
              sex_preference: sexPref,
              colour_preference: colourPref,
              litter: litterList.find(litter => litter.id === data.litterApplication.litter_id),
              user: userList.find(user => user.id === data.litterApplication.user_id)
            });
            setChildren(data.litterApplication.children || []);
            setPets(data.litterApplication.pets || []);
            setAllocatedPuppy(data.allocatedPuppy || []);
          }
        })
        .catch(e => console.log(e));
    }

  }, [props, applicationDetails, litterList, userList]);

  return (
    <>
      {/* <ThemeProvider theme={customTheme}> */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ml: 'auto',
        mr: 'auto',
        maxWidth: "sm",
      }}>
        <Paper sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', p: 4 }}>
          <Grid container spacing={2} >
            <Grid xs={12} sx={{ mb: 3 }}>
              <Typography variant="h3" component="h1" sx={{ textAlign: "center" }}>Litter Application {applicationDetails.id}</Typography>
            </Grid>
            <Grid xs={12}>
              <Typography textAlign='center'>Submitted by: {applicationDetails.user && applicationDetails.user.username}</Typography>
            </Grid>
            <Grid xs={12} sm={6}>
              <Typography textAlign='center'>Yard area: {applicationDetails.yardarea}m²</Typography>
            </Grid>
            <Grid xs={12} sm={6}>
              <Typography textAlign='center'>Fence height: {applicationDetails.yardfenceheight}m</Typography>
            </Grid>
            <Grid xs={12} sm={6}>
              <Typography textAlign='center'>Sex preference: {applicationDetails.sex_preference}</Typography>
            </Grid>
            <Grid xs={12} sm={6}>
              <Typography textAlign='center'>Colour preference: {applicationDetails.colour_preference}</Typography>
            </Grid>
            {allocatedPuppy.length !== 0
              && <>
                <Grid xs={12}>
                  <Typography variant="h5" textAlign='center'>Puppy:</Typography>
                </Grid>
                <Grid xs={12}>
                  <DogCard dog={allocatedPuppy} />
                </Grid>
              </>}
            {children.length > 0
              && <>
                <Grid xs={12}>
                  <Typography variant="h5" textAlign='center'>Children:</Typography>
                </Grid>
                <Grid xs={12}>
                  <Grid xs={12}>
                    <CustomTable
                      head={
                        <>
                          <TableCell align="center">
                            Number
                          </TableCell>
                          <TableCell align="center">
                            Age
                          </TableCell>
                        </>
                      }
                      body={
                        <>
                          {children.map((child, index) => (
                            <TableRow key={index}>
                              <TableCell align="center">
                                {index + 1}
                              </TableCell>
                              <TableCell align="center">
                                {child.age}
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      }
                    />
                  </Grid>
                </Grid>
              </>
            }
            {pets.length > 0
              && <>
                <Grid xs={12}>
                  <Typography variant="h5" textAlign='center'>Pets:</Typography>
                </Grid>
                <Grid xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                  <Grid xs={12}>
                    <CustomTable
                      head={
                        <>
                          <TableCell align="center" sx={{ p: 0 }}>
                            Number
                          </TableCell>
                          <TableCell align="center">Age</TableCell>
                          <TableCell align="center">Type</TableCell>
                          <TableCell align="center">Breed</TableCell>
                          <TableCell align="center">Desexed</TableCell>
                        </>
                      }
                      body={<>
                        {pets.map((pet, index) => (
                          <TableRow key={index}>
                            <TableCell align="center">
                              {index + 1}
                            </TableCell>
                            <TableCell align="center">
                              {pet.age}
                            </TableCell>
                            <TableCell align="center">
                              {pet.pettype}
                            </TableCell>
                            <TableCell align="center">
                              {pet.petbreed}
                            </TableCell>
                            <TableCell align="center">
                              {pet.desexed
                                ? "Yes"
                                : "No"
                              }
                            </TableCell>
                          </TableRow>
                        ))}
                      </>}
                    />
                  </Grid>
                </Grid>
              </>
            }
            {/* </>
                :
                null} */}
          </Grid>
        </Paper>
      </Box>
      {/* </ThemeProvider> */}
    </>
  );
};

export default LitterApplicationDetails;;