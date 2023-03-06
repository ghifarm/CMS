import axios from 'axios';

const axiosinstance = axios.create({
    baseURL: "", //URL BASE
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem('token'),
    },
});
export default axiosinstance;