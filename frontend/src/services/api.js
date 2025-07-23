import axios from 'axios'

const token = localStorage.getItem('token'); 
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    return null
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
    return null
  }
};

export const deleteData = async (endpoint) => {
  try {
    const response = await axios.delete(endpoint);
    return response.data;
  } catch (error) {
    return null
  }
};