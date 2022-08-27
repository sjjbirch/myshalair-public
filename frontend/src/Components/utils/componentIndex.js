// Import Utils
import { reducer, init } from './reducer';
import { StateProvider, useGlobalState } from './stateContext';
// Import Shared Components
import Header from '../Shared/Header';
import NavBar from '../Shared/Navbar';
import AlertComponent from '../Shared/Alert/GeneralAlert';
import CustomTable from '../Shared/CustomTable/CustomTable';
// Import Pages Components
import Home from '../Pages/Home';
import About from '../Pages/About';
import DogIndex from '../Pages/DogsRoute/DogIndex';
import DogsReorder from '../Pages/DogsRoute/DogsReorder/DogsReorder';
import DogCard from '../Pages/DogsRoute/Dogcard/DogCard';
import Dog from '../Pages/DogsRoute/Dog/Dog';
import DogsManage from '../Pages/DogsRoute/DogsManage/DogsManage';
import DogCreationForm from '../Pages/DogsRoute/DogsCreate/DogsCreate';
import DogUpdateForm from '../Pages/DogsRoute/DogsUpdate/DogsUpdate';
import DogDetails from '../Pages/DogsRoute/DogDetails/DogDetails';
import ViewPedigree from '../Pages/DogsRoute/DogPedigree/DogPedigree';
import DisplayDogs from '../Pages/DogsRoute/DogsDisplay/DogsDisplay';
import NotFound from '../Pages/NotFound';
import LitterIndex from '../Pages/LittersRoute/LitterIndex';
import LitterApplication from '../Pages/LittersRoute/LitterApplication/LitterApplication';
import Litter from '../Pages/LittersRoute/Litter/Litter';
import LitterManage from '../Pages/LittersRoute/LitterManage/LitterManage';
import LitterCreationForm from '../Pages/LittersRoute/LitterCreate/LitterCreate';
import LitterUpdateForm from '../Pages/LittersRoute/LitterUpdate/LitterUpdate';
import LitterDetails from '../Pages/LittersRoute/LitterDetails/LitterDetails';
import LitterApplications from '../Pages/LittersRoute/LitterApplications/LitterApplications';
import LitterApplicationForm from '../Pages/LittersRoute/LitterAppllicationForm/LitterApplicationForm';
import LitterApplicationManage from '../Pages/LittersRoute/LitterApplicationManage/LitterApplicationManage';
import LitterApplicationDetails from '../Pages/LittersRoute/LitterApplicationDetails/LitterApplicationDetails';
import ShowCase from '../Pages/LittersRoute/LitterShowCase/LitterShowcase';
import LitterShowItem from '../Pages/LittersRoute/LitterShowItem/LitterShowItem';
import ProfileView from '../Pages/UserRoutes/ProfileView/ProfileView';
import LitterGallery from '../Pages/LittersRoute/LitterGallery/LitterGallery';
import Profile from '../Pages/UserRoutes/ProfileView/Profile/profile';
import EditForm from '../Pages/UserRoutes/ProfileView/EditProfile/EditProile';
import ViewApplications from '../Pages/UserRoutes/ProfileView/ViewApplications/ViewApplications';
import ViewDogs from '../Pages/UserRoutes/ProfileView/ViewDogs/ViewDogs';
import ViewLitters from '../Pages/UserRoutes/ProfileView/ViewLitters/ViewLitters';
import SignInForm from '../Pages/UserRoutes/SignIn/SignIn';
import SignUpForm from '../Pages/UserRoutes/SignUp/SignUp';
import SignOut from '../Pages/UserRoutes/SignOut/SignOut';
import SignUpConfirm from '../Pages/UserRoutes/SignUpConfirm/SignUpConfirm';
// API
import backEndAPI from './api';

// index file where all imports are first made inorder to simply the moving or altering of files if many components rely on it

// Export Components
export {
  // Utils
  reducer,
  init,
  StateProvider,
  useGlobalState,
  // Shared Components
  Header,
  NavBar,
  AlertComponent,
  CustomTable,
  // Pages
  Home,
  About,
  DogIndex,
  DogsReorder,
  DogCard,
  Dog,
  DogsManage,
  DogCreationForm,
  DogUpdateForm,
  DogDetails,
  ViewPedigree,
  DisplayDogs,
  LitterIndex,
  LitterApplication,
  LitterApplicationForm,
  LitterApplicationManage,
  LitterApplicationDetails,
  Litter,
  LitterManage,
  LitterCreationForm,
  LitterUpdateForm,
  LitterDetails,
  LitterApplications,
  ShowCase,
  LitterShowItem,
  LitterGallery,
  ProfileView,
  Profile,
  EditForm,
  ViewApplications,
  ViewDogs,
  ViewLitters,
  SignInForm,
  SignUpForm,
  SignOut,
  SignUpConfirm,
  NotFound,
  // api
  backEndAPI,
};