import axios from "axios"
import {generateHmac} from "./generateHmac";

//APIのURLを指定

const API_URL = import.meta.env.VITE_API_URI //リモートサーバー
// const API_URL = import.meta.env.VITE_LOCAL_API_URI //ローカルサーバー

const emailToken = import.meta.env.VITE_TOKEN

export const baseURL = API_URL

//実際に使用するPOST用の関数
export const requestToServer = async (relative_uri, JSON_VALUES) => {

    //axiosインスタンスの作成
    const axiosPostInstance = createAxiosPost(JSON_VALUES);

    return axiosPostInstance.post(relative_uri, JSON_VALUES);
}

//（機能）JSONを受け取り、Hmac化 -> instanceの作成
function createAxiosPost(jsonValue){
    const generatedHmac = generateHmac(jsonValue, import.meta.env.VITE_HMAC_SECRET)
    const axiosPost = axios.create({
        baseURL: baseURL,
        timeout: 30000,
        headers:{
            "Content-Type": "application/json",
            "validToken": generatedHmac,
            "valueFromTools": jsonValue,
        }
    })
    return axiosPost;
}

//ファイル送信の場合はうえでエラーになる。別の関数を作成する
//実際に使用するPOST用の関数
export const requestFileToServer = async (relative_uri, JSON_VALUES) => {

    //axiosインスタンスの作成
    const axiosPostInstance = createAxiosPostForFile();

    return axiosPostInstance.post(relative_uri, JSON_VALUES);
}

//（機能）JSONを受け取り、Hmac化 -> instanceの作成
function createAxiosPostForFile(){
    const msg = "randomstring"
    const generatedHmac = generateHmac(msg, import.meta.env.VITE_HMAC_SECRET)
    const axiosPost = axios.create({
        baseURL: baseURL,
        timeout: 30000,
        headers:{
            "Content-Type": "application/json",
            "validToken": generatedHmac,
            "valueFromTools": msg,
        }
    })
    return axiosPost;
}

export const axiosPost = axios.create({
    baseURL: baseURL,
    timeout: 30000,
    headers:{
        "Content-Type": "application/json",
        "toolstoken": import.meta.env.VITE_TOOLS_TOKEN,
    }
})

export const axiosEmail = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers:{
        "Content-Type": "application/json",
        "token": emailToken,
    },
})

//Interceptor例
// axiosEmail.interceptors.request.use(
//     req=>{
//         console.log(req)
//         return req
//     }
// )
// axiosEmail.interceptors.response.use(
//     response => {
//         //if BASE_URL starts with https, not show
//         // console.log("interceptor-response(axiosPost): ", response)
//         return response
//     },
//     error => {
//         console.log("interceptor-erroraxiosPost", error)
//         return Promise.reject(error)
//     }
// )


//         // console.log("interceptor error: ", error)
//         //request
//         const originalRequest = error.config
//         //get response status 401-unauthorized
//         const resStatus = error.response.status
        
//         //axios to url
//         const reqUrl = error.response.config.url
        
//         //error code: token_not_valid
//         const resCode = error.response.data.code


//         if (resStatus===401 && reqUrl === "/token/refresh/"){
//             location.href = "/login/"
//             // console.log("refresh token is invalid")
//             return Promise.reject(error)
//         } 

//         if ( resCode === "token_not_valid" && resStatus === 401) {
//             console.log("need refresh token to renew access token")
            
//             } else {
//                 //refresh token is not available
//                 location.href="/login"
//             }

//         if (reqUrl === "/token/" && resStatus===401){
//             console.log("account not found")
//         }

//         if (resStatus===401){
//             console.log("on axios: 401 error except above")
//         }

//         return Promise.reject(error)
//     }
// )