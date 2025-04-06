import aiBaseAxios from "./axios-ai-utils";
import appAxios from "./axios-utils";


export const userMe = () => appAxios.get('/api/userme');
export const userLoginApi = (data) => appAxios.post('/api/login/', data);
export const userRegisterApi = (data) => appAxios.post('/api/register/', data);
export const bookUploadApi = (data) => appAxios.post('/api/books/', data);
export const bookEditApi = (id, data) => appAxios.put(`/api/books/${id}`, data);
export const bookGetApi = () => appAxios.get('/api/books/');
export const getAllUsers = () => appAxios.get('/api/users/');
export const getChatApi = (data) => aiBaseAxios.post('/chat/', data);
export const fileUploadApi = (data) => aiBaseAxios.post('/process/', data);

