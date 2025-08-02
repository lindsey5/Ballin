import axios from 'axios'

axios.defaults.withCredentials = true;

export const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    return error.response.data
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await axios.post(endpoint, data);
    return response.data;

  } catch (error) {
    return error.response.data
  }
};

export const updateData = async (endpoint, data) => {
  try {
    const response = await axios.put(endpoint, data);
    return response.data;
  } catch (error) {
    return error.response.data
  }
};

export const deleteData = async (endpoint) => {
  try {
    const response = await axios.delete(endpoint);
    return response.data;
  } catch (error) {
    return error.response.data
  }
};