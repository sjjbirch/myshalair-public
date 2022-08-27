import { Box, Paper, Button, Stack, useMediaQuery, useTheme, Collapse, IconButton } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getUser } from "../../../services/authServices";
import { EditForm, Profile, useGlobalState, ViewApplications, ViewDogs, ViewLitters } from "../../../utils/componentIndex";

const ProfileView = () => {
  const params = useParams();
  const { id } = params;
  const { store } = useGlobalState();
  const { loggedInUser } = store;
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const [user, setUser] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [litters, setLitters] = useState([]);

  const [pageRender, setPageRender] = useState("profile");
  const [open, setOpen] = useState(false);

  // on component mount and when user, loggegInUser and naviage updates, checks if user has any values, if it doesn't makes get to '/users/:id' using id as id and populates state with response
  useEffect(() => {
    if (user.length === 0) {
      getUser(id)
        .then(reply => {
          if (reply.status === 200) {
            setUser(reply.data.user);
            setApplications(reply.data.applications);
            setDogs(reply.data.dogs);
            setLitters(reply.data.bred_litters);
          }
        })
        .catch(e => {
          console.log(e);
          // navigates to 404 if any errors
          navigate('/404');
        });
      // alternatively if user has values it checks if it is the same as loggedInUser, if not assigns loggedInUser to user state
    } else if (user !== [] && user !== loggedInUser) {
      setUser(loggedInUser);
    }

  }, [id, user, loggedInUser, navigate]);

  // handles profile switching by taking in a string and setting setOpen to the opposite of its current value (almost always switching true to false)
  const handleProfileSwitch = (page) => {
    setPageRender(page);
    setOpen(!open);
  };

  // list of profile buttons to be rendered inorder to avoid retyping the same code, also trigger above function on click
  const ProfileButtons = () => {
    return (
      <>
        <Button onClick={() => handleProfileSwitch("profile")}> Profile</Button>
        <Button onClick={() => handleProfileSwitch("applications")}>View Applications</Button>
        <Button onClick={() => handleProfileSwitch("dogs")}>View Dogs</Button>
        {(user.breeder || user.admin) && <Button onClick={() => handleProfileSwitch("litters")}>View Litters</Button>}
        <Button onClick={() => handleProfileSwitch("edit")}>Edit Profile</Button>
      </>
    );
  };

  return (
    <>
      <Box component={Paper}>
        <Grid container>
          {mobile
            ? <>
              <Collapse in={open} >
                <Box component={Paper} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <ProfileButtons />
                </Box>
              </Collapse>
            </>
            : <>
              <Grid xs={3}>
                <Stack>
                  <ProfileButtons />
                </Stack>
              </Grid>
            </>}
          <Grid container xs={12} sm={9} component={Paper} sx={{ p: 2 }} spacing={1}>
            {mobile && <IconButton onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowRight />}
            </IconButton>}
            {/* switch that controls the current rendered page basd on pageRender state */}
            {(() => {
              switch (pageRender) {
                case "profile": return <Profile user={user} />;
                case "applications": return <ViewApplications apps={applications} user={user} />;
                case "dogs": return <ViewDogs dogs={dogs} user={user} />;
                case "litters": return <ViewLitters litters={litters} user={user} />;
                case "edit": return <EditForm user={user} handleProfileSwitch={handleProfileSwitch} />;
                default: return <Profile user={user} />;
              }
            })()}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ProfileView;

// admin: true
// breeder: null
// created_at: "2022-08-23T05:34:42.964Z"
// id: 1
// jti: "8eb76f05-7e10-42d2-9210-efacad28fa6f"
// updated_at: "2022-08-23T05:37:01.579Z"