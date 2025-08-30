    
export interface UserInfo {
  nickName: string
  token: string
}


export interface User {
  id?: string
  username?: string
  email?: string
  avatar?: string
  nickName: string
}


export interface LoginParams {
  userName: string
  password: string
}


export interface RegisterParams {
  userName: string
  password: string
  nickName: string
  captcha: string
}

export interface CaptchaParams {
  address: string
}
