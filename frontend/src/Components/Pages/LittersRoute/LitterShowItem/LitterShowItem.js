import { Box, Typography, Stack, Paper, Button } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import { useEffect, useState } from "react";
import { getShowCase } from "../../../services/litterServices";
import { Link } from "react-router-dom";


const LitterShowItem = ({ litter }) => {

  const [showItem, setShowItem] = useState([]);
  const [showImages, setShowImages] = useState([]);
  const [showSire, setShowSire] = useState([]);
  const [showBitch, setShowBitch] = useState([]);
  const [showPuppies, setShowPuppies] = useState([]);

  // on component mount and when litter updates checks if litter is present and makes get to litter showcase/:id usng litter.id as :id, then populates state with response
  useEffect(() => {
    if (litter) {
      getShowCase(litter.id)
        .then(reply => {
          if (reply.status === 200) {
            setShowItem(reply.data.litter || []);
            setShowImages(reply.data.images || []);
            setShowSire(reply.data.sire || []);
            setShowBitch(reply.data.bitch || []);
            setShowPuppies(reply.data.puppies || []);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }, [litter]);

  return (
    <Box
      component={Paper}
      sx={{
        mt: 2,
        ml: 'auto',
        mr: 'auto',
        maxWidth: "md",
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
    >
      <Box>
        <Grid container spacing={2} sx={{
          overflow: 'hidden',
          px: 2,
          pt: 2
        }}>
          <Grid xs={12} sm={6}>
            {showImages.length > 0
              && <Box component='img' src={showImages[0]} sx={{ height: '100%', width: '100%', objectFit: 'contain' }} />}
          </Grid>
          <Grid container xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', pb: 2 }}>
            <Grid sx={{ py: 2, textAlign: 'center' }}>
              <Typography variant="h4">{showItem.lname}</Typography>
            </Grid>
            <Grid container xs={12} spacing={2}>
              <Grid xs={12} sm={6}>
                <Typography variant="h6">Sire:</Typography>
                <Typography>{showSire.realname}</Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="h6">Dam:</Typography>
                <Typography>{showBitch.realname}</Typography>
              </Grid>
            </Grid>
            <Grid xs={12}>
              <Typography variant="h6">Puppies</Typography>
              <Stack sx={{ textAlign: 'center' }}>
                {showPuppies.map((puppy, index) => {
                  return (
                    <Typography key={index}>{puppy.realname}</Typography>
                  );
                })}
              </Stack>
            </Grid>
            <Grid>
              <Link to={`/litters/${showItem.id}`}>
                <Button variant="outlined">View</Button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LitterShowItem;