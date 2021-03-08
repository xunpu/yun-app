var API_URL;

if (process.env.NODE_ENV == 'development') {
    API_URL = '/api/api';
} else {
    API_URL = '/api';
}

export {
    API_URL
}