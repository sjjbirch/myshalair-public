import axios from "axios";

// function to switch backend url between dev and production
const url = () => {
  return (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') ? 'http://localhost:3001' : 'https://myshalair-back.herokuapp.com/';
};

const backEndAPI = axios.create({
  baseURL: url()
});

// function that intercepts a request and inters the auth token into the header
backEndAPI.interceptors.request.use(req => {
  const token = sessionStorage.getItem("token");
  if (token) {
    req.headers["Authorization"] = `Bearer ${token}`;
  }

  return req;
});

// function that intercepts a response and saves the auth token into sessionStorage
backEndAPI.interceptors.response.use(res => {
  if (res.headers['authorization']) {
    const jwt = res.headers['authorization'].split('Bearer ')[1];
    window.sessionStorage.setItem("token", jwt);
  }
  return res;
});

export default backEndAPI;