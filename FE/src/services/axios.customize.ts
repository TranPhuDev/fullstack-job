import axios from "axios";



// const mutex = new Mutex();
const NO_RETRY_HEADER = 'x-no-retry';
// Tạo instance của axios
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    // if (typeof window !== "undefined" && window && window.localStorage && window.localStorage.getItem('access_token')) {
    //     config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
    // }
    // if (!config.headers.Accept && config.headers["Content-Type"]) {
    //     config.headers.Accept = "application/json";
    //     config.headers["Content-Type"] = "application/json; charset=utf-8";
    // }
    return config;
});


// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response && response.data) {
        return response.data
    }
    return response.data.data
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error && error.response && error.response.data) {
        return error.response.data
    }
    return Promise.reject(error);
});

export default instance