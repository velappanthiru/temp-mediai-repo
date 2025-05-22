import aiBaseAxios from "./axios-ai-utils";
import appAxios from "./axios-utils";


export const userMe = () => appAxios.get('/api/userme');
export const userLoginApi = (data) => appAxios.post('/api/login/', data);
export const userRegisterApi = (data) => appAxios.post('/api/register/', data);
export const bookUploadApi = (data) => appAxios.post('/api/books/', data);
export const bookEditApi = (id, data) => appAxios.put(`/api/books/${id}`, data);
export const bookGetApi = () => appAxios.get('/ai/books/');
export const getAllUsers = () => appAxios.get('/api/users/');
export const getChatApi = (data) => aiBaseAxios.post('/ai/chat', data);
export const lastChatApi = () => aiBaseAxios.post('/ai');
export const fileUploadApi = (data) => aiBaseAxios.post('/ai/books/upload', data);
export const toggleApi = (data) => aiBaseAxios.post('/ai/toggle_mode', data);
export const newChatAPi = () => aiBaseAxios.post('/ai/new_session');



