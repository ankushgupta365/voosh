import axios from "axios";

const BASE_URL = "http://localhost:8800/api"
const PRODUCTION_URL = "https://apivoosh.ankushgupta.me/api"


let TOKEN;
export const getToken = ()=>{
    if(localStorage.getItem("vooshuser")){
        TOKEN = JSON.parse(localStorage.getItem("vooshuser"))?.accestoken
}
}
getToken()

export const publicRequest = axios.create({
    baseURL: BASE_URL
})
export const userRequest = axios.create({
    baseURL: BASE_URL,
    headers: {token: `Bearer ${TOKEN}`}
})