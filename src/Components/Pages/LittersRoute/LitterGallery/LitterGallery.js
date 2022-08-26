import { Box, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import { getBest } from "../../../services/litterServices";

const LitterGallery = () => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    if (imageList.length === 0) {
      getBest()
        .then(reply => {
          console.log(reply);
          setImageList(reply.data.images);
        })
        .catch(e => console.log(e));
    }
  }, [imageList]);

  return (
    <>
      <Box component={Paper} sx={{
        maxWidth: 'md',
        ml: 'auto',
        mr: 'auto',
        px: 4,
      }}>
        <Typography variant="h3" sx={{ textAlign: 'center', py: 2 }}>Gallery</Typography>
        <Grid container spacing={2} sx={{
          display: 'flex',
          justifyContent: 'center',
          pb: 2,
          '--Grid-borderWidth': '1px',
          borderTop: 'var(--Grid-borderWidth) solid',
          borderColor: 'divider',
          '& > div': {
            borderLeft: 'var(--Grid-borderWidth) solid',
            borderRight: 'var(--Grid-borderWidth) solid',
            borderBottom: 'var(--Grid-borderWidth) solid',
            borderColor: 'divider',
          },
        }} >
          {imageList.length > 0 && imageList.map((image, index) => {
            return (
              <Grid key={index} xs={12} sm={4}>
                <Box component="img" src={image} sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
};

export default LitterGallery;