// import { Box, Typography, Paper } from "@mui/material";
// import Grid from "@mui/material/Unstable_Grid2";
// import DogCard from "../Dogcard/DogCard";


// const ViewPedigree = ({ dog }) => {

//   const FamilyElement = (dog) => {
//     console.log(dog);
//     return (
//       <>
//         <Grid xs={12} container sx={{ display: 'flex', justifyContent: 'center' }}>
//           <Grid xs={6} id={dog.sire.id}>
//             {dog.sire.id !== 'unrecorded'
//               ? <>
//                 <DogCard dog={dog.sire} />
//                 {FamilyElement(dog.sire)}
//               </>
//               : <Grid xs={12} component={Paper}>
//                 <Typography variant="h5">{dog.sire.id}</Typography>
//               </Grid>}
//           </Grid>
//           <Grid xs={6} id={dog.bitch.id}>
//             {console.log(dog.bitch.callname)}
//             {dog.bitch.id !== 'unrecorded'
//               ? <>
//                 <DogCard dog={dog.bitch} />
//                 {FamilyElement(dog.bitch)}
//               </>
//               : <Grid xs={12} component={Paper}>
//                 <Typography variant="h5">{dog.bitch.id}</Typography>
//               </Grid>}
//           </Grid>
//         </Grid>
//       </>
//     );
//   };

//   return (
//     <>
//       <Box sx={{
//         width: '100%',
//         maxWidth: 'md',
//         mr: 'auto',
//         ml: 'auto',
//         display: 'flex',
//         flexDirection: 'column'
//       }}>
//         {console.log(dog)}
//         <Grid container sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
//           {FamilyElement(dog)}
//         </Grid>
//       </Box>
//     </>
//   );
// };

// export default ViewPedigree;