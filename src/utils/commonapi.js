import aiBaseAxios from "./axios-ai-utils";
import appAxios from "./axios-utils";


export const userMe = () => appAxios.get('/api/userme');
export const userLoginApi = (data) => appAxios.post('/api/login/', data);
export const userRegisterApi = (data) => appAxios.post('/api/register/', data);
export const bookUploadApi = (data) => appAxios.post('/api/books/', data);
export const bookEditApi = (id, data) => appAxios.put(`/api/books/${id}`, data);
export const bookGetApi = () => appAxios.get('/ai/books/');
export const getAllUsers = () => appAxios.get('/api/users/');
export const getAllMenus = () => appAxios.get('/api/menus/');
export const updateMenuAccessApi = (data) => appAxios.put('/api/update/', data);
export const getMenuByRole = (role) => appAxios.get(`/api/role/${role}`);
export const getAllRolesApi = () => appAxios.get('/api/getRole/');
export const createRoleApi = (data) => appAxios.post('/api/createRole/', data);
export const getChatApi = (data) => aiBaseAxios.post('/ai/chat', data);
export const lastChatApi = () => aiBaseAxios.post('/ai');
export const fileUploadApi = (data) => aiBaseAxios.post('/ai/books/upload', data);
export const toggleApi = (data) => aiBaseAxios.post('/ai/toggle_mode', data);
export const newChatAPi = () => aiBaseAxios.post('/ai/new_session');
export const historyApi = () => aiBaseAxios.get('/ai/sessions');
export const sessionIdApi = (sessionId) => aiBaseAxios.get(`/ai/session/${sessionId}`);
export const bookTopicsandTitleApi = () => aiBaseAxios.get('/ai/books');
export const generateQuestionsApi = (data) => aiBaseAxios.post('/ai/generate-questions', data);
export const imageToText = (data) => aiBaseAxios.post('/ai/ocr', data);
export const storeQuestionsApi = (data) => appAxios.post('/api/generate-questions', data);
export const activeExamsApi = () => appAxios.get('/api/exams');
export const getExamDetailsById = (id) => appAxios.get(`/api/question/${id}`);



