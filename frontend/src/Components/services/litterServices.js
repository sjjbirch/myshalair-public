import { backEndAPI } from "../utils/componentIndex";

// collection of functions each making a request to a route and returning the response

export async function getLitters() {
  const response = await backEndAPI.get('/litters');
  return response.data;
}

export async function postLitter(data) {
  const response = await backEndAPI.post('/litters', data);
  return response;
}

export async function getLitter(id) {
  const response = await backEndAPI.get(`/litters/${id}`);
  return response.data;
}

export async function patchLitter(id, data) {
  const response = await backEndAPI.patch(`/litters/${id}`, data);
  return response;
}

export async function postNewPuppy(data) {
  const response = await backEndAPI.post('/add_puppy', data);
  return response;
}

export async function getLitterApps() {
  const response = await backEndAPI.get('/waitlisted');
  return response.data;
}

export async function getLitterApp(id) {
  const response = await backEndAPI.get(`/litter_applications/${id}`);
  return response;
}

export async function postApplication(data) {
  const response = await backEndAPI.post('/lazy_litter_application_create', data);
  return response;
}

export async function patchLitterApp(id, data) {
  const response = await backEndAPI.patch(`/litter_applications/${id}`, data);
  return response;
}

export async function getShowCase(id) {
  const response = await backEndAPI.get(`/showcase/${id}`);
  return response;
}

export async function getBest() {
  const response = await backEndAPI.get('/showcase');
  return response;
}

export async function assignPuppy(data) {
  const response = await backEndAPI.patch(`/assign_puppy`, data);
  return response;
}