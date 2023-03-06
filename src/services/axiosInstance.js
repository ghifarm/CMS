import axios from 'axios';

const axiosinstance = axios.create({
    baseURL: "http://172.16.5.139:3001/",
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem('token'),
    },
});
export default axiosinstance;