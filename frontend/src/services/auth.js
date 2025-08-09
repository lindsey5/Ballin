import { postData } from "./api";

export const signout = async (path) => { 
    await postData('/api/logout')
    localStorage.removeItem('cart')
    window.location.href = path;
}