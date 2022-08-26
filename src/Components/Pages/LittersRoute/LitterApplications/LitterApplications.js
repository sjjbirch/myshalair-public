import { Box, Container, Typography, Button, Paper, Stack, List, ListItem, TableBody, ListItemText, IconButton } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { getLitter, patchLitter } from "../../../services/litterServices";
import { CustomTable, LitterApplicationManage, useGlobalState } from "../../../utils/componentIndex";
import { updateItemInArray } from "../../../utils/helpers/findOriginal";

// Add app id field for identifyier, and include fufill state
// management for unproccseed, approved and rejected

const LitterApplications = () => {
  const params = useParams();
  const { store, dispatch } = useGlobalState();
  const { userList, dogList, litterList } = store;

  const [litterDetail, setLitterDetail] = useState([]);
  const [litterApplications, setLitterApplications] = useState([]);
  const [availablePuppies, setAvailablePups] = useState([]);

  useEffect(() => {
    getLitter(params.id)
      .then(litter => {
        console.log(litter);
        setLitterDetail({
          ...litter,
          breeder: userList.find((user) => user.id === litter.breeder_id),
          sire: dogList.find((sire) => sire.id === litter.sire_id),
          bitch: dogList.find((bitch) => bitch.id === litter.bitch_id),
        });
        if (litter.litterApplications) {
          setLitterApplications(litter.litterApplications);
        }
        if (litter.puppies && litter.unassigned.length > 0) {
          setAvailablePups(litter.puppies.filter(puppy => litter.unassigned.includes(puppy.id)));
        }
      })
      .catch(e => console.log(e));
  }, [dogList, userList, params]);

  const handleOpenOrClose = (newStatus) => {
    const litter = {
      ...litterDetail,
      status: newStatus
    };
    patchLitter(litter.id, litter)
      .then(litter => {
        console.log(litter);
        // on success dispatches new litter list to update global state
        if (litter.status === 200) {
          dispatch({
            type: 'updateLitterList',
            data: updateItemInArray(litter.data.litter, litterList)
          });
        };
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <>
      {litterDetail.length !== 0
        && <Box sx={{
          mr: 'auto',
          ml: 'auto',
          maxWidth: 'md',
        }}>
          <Grid container component={Paper} sx={{
            display: 'flex',
            flexDirection: 'column',
            py: 2
          }}>
            {console.log(litterDetail)}
            {console.log(litterApplications)}
            {console.log(availablePuppies)}
            <Grid xs={12} >
              <Typography variant="h3" align="center">
                {litterDetail.lname} Applications
              </Typography>
            </Grid>
            <Grid container xs={12} sx={{ display: 'flex', justifyContent: 'space-around', py: 2 }}>
              <Grid xs={5} sx={{ textAlign: 'center' }}>
                <Typography variant="h5">Available Puppies</Typography>
                <List component={Paper}>
                  {availablePuppies.map((puppy, index) => {
                    return (
                      <ListItem key={index} sx={{ justifyContent: 'center' }}>
                        <Typography >{puppy.realname}</Typography>
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
              <Grid xs={12} sx={{ textAlign: 'center' }}>
                <LitterApplicationManage litterApps={litterApplications} puppies={availablePuppies} />
              </Grid>
            </Grid>
            <Grid xs={12} container columnSpacing={2} sx={{ px: 2 }}>
              <Grid xs="auto">
                <Link to="/litters/manage">
                  <Button variant="contained">
                    Return to Manage Litters
                  </Button>
                </Link>
              </Grid>
              <Grid xs="auto">
                {(litterDetail.status === 1
                  && <Link to="/litters/manage">
                    <Button variant="contained" color="error" onClick={() => handleOpenOrClose(2)}>
                      Close Litter
                    </Button>
                  </Link>)
                  ||
                  (litterDetail.status === 2
                    && <Link to="/litters/manage">
                      <Button variant="contained" onClick={() => handleOpenOrClose(1)}>
                        Open Litter
                      </Button>
                    </Link>)}
              </Grid>
            </Grid>
          </Grid>
        </Box>}
    </>
  );
};

export default LitterApplications;