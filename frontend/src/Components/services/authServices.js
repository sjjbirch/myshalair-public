import { backEndAPI } from "../utils/componentIndex";

// collection of functions each making a request to a route and returning the response

export async function signUp(data) {
  const response = await backEndAPI.post('/users', data);
  return response;
}

export async function signIn(data) {
  const response = await backEndAPI.post('/users/sign_in', data);
  return response;
}

export async function getUsers() {
  const response = await backEndAPI.get('/userlist');
  return response.data;
}

export async function getUser(id) {
  const response = await backEndAPI.get(`/users/${id}`);
  return response;
}

export async function updateUser(id, data) {
  const response = await backEndAPI.patch(`/users/${id}`, data);
  return response;
}

export async function getConfirm(confirmToken) {
  const response = await backEndAPI.get(`/users/confirmation${confirmToken}`);
  return response;
}