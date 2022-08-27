import { backEndAPI } from "../utils/componentIndex";

// collection of functions each making a request to a route and returning the response

export async function getDogs() {
  const response = await backEndAPI.get('/dogs');
  return response.data;
}

export async function postDog(data) {
  const response = await backEndAPI.post('/lazy_dog_create', data);
  return response;
}

export async function getDog(id) {
  const response = await backEndAPI.get(`/dogs/${id}`);
  return response;
}

export async function getDogByChip(data) {
  const response = await backEndAPI.post(`/find_dog`, data);
  return response;
}

export async function patchDog(id, data) {
  const response = await backEndAPI.patch(`/dogs/${id}`, data);
  return response;
}

export async function addPuppy(data) {
  const response = await backEndAPI.post('/add_puppy', data);
  return response.data;
}

export async function pushNewPositions(data) {
  const response = await backEndAPI.patch('/reorder_dogs', data);
  return response;
}

export async function uploadImage(data) {
  const response = await backEndAPI.post('/main_image_upload', data);
  return response;
}