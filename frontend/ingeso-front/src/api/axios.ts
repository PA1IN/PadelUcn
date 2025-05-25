import axios from 'axios';

const api_url = 'http://localhost:8080';

const api = axios.create({
    baseURL: api_url,
});

api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if(token)
    {
        config.headers.Authorization = `Bearer ${token}`; //sapear el back pa incluir el bearer
    }
    return config;
});

export default api;

