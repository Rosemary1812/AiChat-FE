import { request } from '../utils/request'
import type { LoginParams, RegisterParams, CaptchaParams, UserInfo } from '../types/user'

class UserService {
    async login(params: LoginParams): Promise<UserInfo> {
        const response = await request.post('/api/auth/login', params)
        return response.data
    }

    async register(params: RegisterParams): Promise<UserInfo> {
        const response = await request.post('/api/auth/register', params)
        return response.data
    }

    async sendCaptcha(params: CaptchaParams): Promise<void> {
        await request.post('/api/auth/captcha', params)
    }

    async getUserInfo(): Promise<UserInfo> {
        const response = await request.get('/api/user/info')
        return response.data
    }
}

export const userService = new UserService()
