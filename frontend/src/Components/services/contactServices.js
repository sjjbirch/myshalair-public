import { backEndAPI } from "../utils/componentIndex";

// collection of functions each making a request to a route and returning the response

export async function getForms() {
  const response = await backEndAPI.get('/contacts');
  return response.data;
}

export async function postForm(data) {
  const response = await backEndAPI.post('/contacts', data);
  return response.data;
}

export async function getForm(data) {
  const response = await backEndAPI.get(`/contacts/${data}`);
  return response.data;
}