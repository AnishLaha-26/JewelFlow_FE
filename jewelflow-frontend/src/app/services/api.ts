import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL; //fetches backend URL from .env.local file in root directory

const api = axios.create({
    baseURL: `${API_URL}/api`, // All requests will be prefixed with /api
});

/**
 * Corresponds to 'POST /api/register' in the architecture diagram.
 * Sends user registration data to the backend.
 * @param userData - An object containing data like firstName, lastName, email, and password.
 */
export const register = (userData: any) => {
    return api.post('/register', userData);
};


/**
 * Corresponds to 'POST /api/login' in the architecture diagram.
 * Sends user login credentials to the backend.
 * @param credentials - An object containing email and password.
 */
export const loginUser = (credentials: any) => {
    return api.post('/login', credentials);
};


// You can add other API functions here later, such as for 'GET /api/profile'.

export default api;