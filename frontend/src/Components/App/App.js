import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
// imports required services for dispatch
import { getDogs } from '../services/dogsServices';
// centralises all majour imports into one index file
import {
  // shared components
  Header,
  NavBar,
  AlertComponent,
  // pages
  Home,
  About,
  DogsManage,
  DogCreationForm,
  DogUpdateForm,
  DogsReorder,
  DogDetails,
  DisplayDogs,
  // LitterApplicationsManage,
  LitterApplicationForm,
  // LitterApplicationManage,
  // LitterApplicationDetails,
  LitterManage,
  LitterCreationForm,
  LitterUpdateForm,
  LitterDetails,
  LitterApplications,
  SignInForm,
  SignUpForm,
  // SignUpRedirect,
  NotFound,
  // state
  useGlobalState,
  SignOut,
  ProfileView,
  ShowCase,
  DogIndex,
  LitterIndex,
  LitterGallery,
  SignUpConfirm,
} from '../utils/componentIndex';
// Custom components which blocks unautherised acces to its chilren. Any unautherised access is rerouted to '/'. AdminRoute blocks any user which isn't an admin and SecuredRoute blocks any user that isn't signed in
import { AdminRoute, SecuredRoute } from '../utils/PrivateRouter';
// some basic styling
import { Box, Container } from '@mui/material';

const App = () => {
  const { store, dispatch } = useGlobalState();
  const { dogList, loggedInUser } = store;
  const location = useLocation();
  const { state } = location;

  // Inputs: 
  //    dispatch: function
  //    dogList: array
  //    loggedInUser: object
  // Function: runs contents on component mount or if dogList, dispatch or loggedInUser updates
  // Used for: makes sure dogList and loggedInUser global state remain as up to date as possible
  useEffect(() => {
    if (dogList.length === 0) {
      // Outputs: backend response from get request to '/dogs/'
      // Function: makes backend get request to dogs#index
      // Used for: keeping dogList updated with the latest scoped iteration
      getDogs()
        .then(dogs => {
          // Inputs: 
          //   type: string
          //   data: array
          // Function: uses type to switch to a matching case and saves the provided data to dogList in globalState
          // Used for: Populates the dogList which is the root that all dog based features reply upon
          dispatch({
            type: "setDogList",
            data: dogs
          });
        })
        .catch(e => console.log(e));
    }
    if (loggedInUser.length === 0 && Boolean(sessionStorage.getItem('user'))) {
      // Inputs:
      //   type: string
      //   data: object
      // Function: uses type to switch to a matching case and save provided data to loggedInUser in globalState
      // Used for: managing the users state and authorisation
      dispatch({
        type: 'setLoggedInUser',
        data: JSON.parse(sessionStorage.getItem('user'))
      });
    }
  }, [dogList, dispatch, loggedInUser]);



  return (
    <>
      {/* wraps whole application in a box that ensures its always the width of the window */}
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* renders custom alert component when location.state containes alert which is set to true */}
        {state && state.alert ?
          <>
            {/* ensures alert is rendered absolutely so it appears ontop of application */}
            <Box sx={{ width: '100%', position: 'sticky', top: 0, zIndex: '2' }}>

              {/* custom alert component that uses material ui's alert components to display a user friendly alert, fills fields with values passed through location.state */}
              <Box sx={{ position: 'absolute', width: '100%' }}>
                <AlertComponent location={state.location} severity={state.severity} title={state.title} body={state.body} />
              </Box>
            </Box>
          </>
          :
          null}
        {/* renders the header which contains the Myshalair logo*/}
        <Header data-testid="header" />
        {/* renders navbar, which is the main form of navigation */}
        <NavBar />
        {/* Wraps main application in a container which which has a top margin of 5% if window is less than the 'md' break point or 25 if window is more */}
        <Container sx={{ mt: { xs: '5%', md: '25px' }, pb: '2.5rem' }}>
          {/* The routes component from React Routing, controls navigation throughout the application */}
          <Routes>
            {/* sets the route that renders the Home component */}
            <Route path="/" element={<Home />} />
            {/* sets the route that renders the About component */}
            <Route path="about" element={<About />} />
            {/* sets the route dogs */}
            <Route path="dogs" element={<DogIndex />} >
              {/* routes anyone who tries to access dogs to dogs/mange */}
              <Route index element={<Navigate to={'manage'} replace={true} />} />
              {/* sets the route that renders the DogsManage component */}
              <Route path="manage" element={
                <AdminRoute>
                  <DogsManage />
                </AdminRoute>
              } />
              {/* sets the route that renders DogCreationForm component */}
              <Route path="create" element={
                <AdminRoute>
                  <DogCreationForm />
                </AdminRoute>} />
              {/* sets the route that renders DogUpdateForm component */}
              <Route path=":id/edit" element={
                <AdminRoute>
                  <DogUpdateForm />
                </AdminRoute>} />
              {/* sets the route that renders the DisplayDogs component with a id prop of all */}
              <Route path="display/all" element={
                <AdminRoute>
                  <DisplayDogs id={'all'} />
                </AdminRoute>} />
              {/* sets the route that renders the DogsReorder component */}
              <Route path="re_order" element={
                <AdminRoute>
                  <DogsReorder />
                </AdminRoute>
              } />
              {/* maps the 3 values to the route that renders the DisplayDogs component, used for showing filtered lists to public */}
              {['male', 'female', 'retired'].map((path, index) => {
                return (
                  <Route path={`display/${path}`} element={
                    // <DogsReorder id={path} />
                    <DisplayDogs id={path} />
                  } key={index} />
                );
              })}
              {/* sets the route that renders DogDetails component, uses :id param to control which dog is providing details */}
              <Route path="display/:id" element={<DogDetails />} />
            </Route>
            {/* sets default route for litters */}
            <Route path="litters" element={<LitterIndex />}>
              {/* automatically routes path: "/litters" to "/litters/apply" */}
              <Route index element={<Navigate to={'/litters/apply'} replace={true} />} />
              {/* sets the route for litter manage component and uses AdminRoute to block non admin users*/}
              <Route path="manage" element={
                <AdminRoute>
                  <LitterManage />
                </AdminRoute>} />
              {/* sets the route for litter creation component and uses AdminRoute to block non admin users*/}
              <Route path="create" element={
                <AdminRoute>
                  <LitterCreationForm />
                </AdminRoute>
              } />
              {/* sets the route for litter application component and uses SecuredRoute to redirect non signed in users*/}
              <Route path="apply" element={
                <SecuredRoute>
                  <LitterApplicationForm />
                </SecuredRoute>} />
              {/* <Route path="applications" element={
                <AdminRoute>
                  <LitterApplicationManage />
                </AdminRoute>
              } /> */}
              {/* sets the route for the litter showcase component, is used to show off litters */}
              <Route path="browse" element={<ShowCase />} />
              {/* sets the route for the litter gallery component, used to display all the main images for litters */}
              <Route path="showcase" element={<LitterGallery />} />
              {/* sets the route to access LitterDetails component to view a break down of each litter */}
              <Route path=":id" element={
                <LitterDetails />
              } />
              {/* sets the route for litter update component and uses AdminRoute to reroute non admin users*/}
              <Route path=":id/edit" element={
                <AdminRoute>
                  <LitterUpdateForm />
                </AdminRoute>
              } />
              {/* sets the default route for the litter applications component, uses ArminRoute to reroute non admin users*/}
              <Route path=":id/applications" element={
                <AdminRoute>
                  <LitterApplications />
                </AdminRoute>} />
              {/* sets path for litter applications manafement page and uses AdminRoute to manage autherisation */}
              {/* <Route path="manage" element={
                <AdminRoute>
                  <LitterApplicationsManage />
                </AdminRoute>
              } /> */}
              {/* <Route index element={
                  <AdminRoute>
                    <LitterApplications />
                  </AdminRoute>
                } />
              </Route> */}
            </Route>

            {/* sets the default route for user components */}
            <Route path='user'>
              {/* sets the route for the profile view component */}
              <Route path=":id" element={
                <SecuredRoute>
                  <ProfileView />
                </SecuredRoute>
              } />
              {/* route for sign in form */}
              <Route path="signin" element={<SignInForm />} />
              {/* route for signup form */}
              <Route path="signup" >
                <Route index element={<SignUpForm />} />
                {/* <Route path="redirect" element={<SignUpRedirect />} /> */}
              </Route>
              {/* route to sign out */}
              <Route path="signOut" element={
                <SignOut />
              } />
            </Route>
            {/* route to process and confirm user confirmations */}
            <Route path="users/confirmation" element={<SignUpConfirm />} />
            {/* sets path to render 404 page when attempting to access a route that does not exist */}
            <Route path="*" element={<Navigate to="404" />} />
            <Route path="404" element={<NotFound />} />
          </Routes>
        </Container>
      </Box>
    </>
  );
};

export default App;


//   Inputs: what args does the function take and what type are each of them.
// Outputs: what are the names of the things the function might return, what type are they, what conditions lead to one return or another.
// Function: what does the function do with the inputs to turn them into the outputs, the control flow and the functions
// Called by: list all functions that call this function
// Used for: what feature(s) does this support at the userspace level