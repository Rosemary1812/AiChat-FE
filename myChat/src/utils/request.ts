import {message} from 'antd'
import axios ,{type AxiosError,type Method}from 'axios'

import {BASE_URL} from '../constant'
import router from '../router'
import {useUserStore} from '../store/useUserStore'


const instance = axios.create({
    baseURL:BASE_URL,
    timeout:30000,
})

const whiteList=[
    '/users/login',
    '/users/register',
    '/users/register-captcha',
]

instance.interceptors.request.use(
    function(config){
        const isWhiteList = whiteList.some((url)=>config.url?.includes(url))

        if(isWhiteList){
            return config
        }

        const {token}=useUserStore.getState()

        config.headers['Authorization'] = `${token}`
        return config

    },
    function(error){
        return Promise.reject(error)                    
    }
)

instance.interceptors.response.use(
    function(response){
        const {code,msg}=response.data
        console.log('响应拦截器',code,msg)

        if(code===400||code===401||code===404){
            message.error(msg||'请求失败')
            return
        }
        console.log('响应拦截器',response.data)
        return response.data
    },
    function(error:AxiosError){
        const {status}=error
        if(status===401){
            message.warning('登录过期，请重新登录')
            router.navigate('/login',{
                replace:true,
            })
        }else{
            // message.error(error(`error:${status}`))
        }
        return Promise.reject(error)
    }
)

export type Data<T> = {
    data:T,
    code:string|number,
    msg:string|null,

}

export const request= <T> (
    url:string,
    method:Method='GET',
    submitData?:object,
    option?:{signal?:AbortSignal}
)=>{
    return instance.request<Data<T>>({
        url,
        method,
        [method.toUpperCase()==='GET'?'params':'data']:submitData,
        signal:option?.signal,
    })
}
