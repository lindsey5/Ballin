import { postData } from "./api";

export const signout = async () => { 
    await postData('/api/logout')
    localStorage.removeItem('cart')
    window.location.href = '/';
}

export const adminSignout = async () => { 
    await postData('/api/logout')
    window.location.href = '/admin/login';
}