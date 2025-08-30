import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import AuthLanguageSwitch from '../../components/Author/AuthLanguageSwitch'
import AuthLayout from '../../components/Author/AuthLayout'
import AuthLink from '../../components/Author/AuthLink'
import FooterLinks from '../../components/Author/FooterLinks'
import RegisterForm from '../../components/Author/RegisterForm'
import{userService} from '../../services/userService'
import{useUserStore} from '../../store/useUserStore'

import type{RegisterParams,CaptchaParams} from '../../types/user'

export default function CreateAccount(){
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()
    const {error}=useUserStore()

    const handleRegisterSubmit=async({
        userName,
        password,
        nickName,
        captcha,
    }:RegisterParams)=>{
        setLoading(true)
        try{
            const params:RegisterParams={
                userName,
                password,
                nickName,
                captcha,
            }
            await userService.register(params)
            navigate('/',{replace:true})
        }catch(error){
            console.error('注册失败',error)
        }finally{
            setLoading(false)
        }
    }

    const handleCaptchaSubmit=async(params:CaptchaParams)=>{
        try{
            await userService.sendCaptcha(params)   
        }catch(error){
            console.error('获取验证码失败',error)
        }
    }

    return(
        <AuthLayout title="创建账号">
            <div className="space-y-4">
                    <AuthLanguageSwitch/>
                    {error&&<div className="text-red-500 text-sm">{error}</div>}
                    
                    <RegisterForm
                    onSubmit={handleRegisterSubmit}
                    loading={loading}
                    onSendCaptcha={handleCaptchaSubmit}
                    />
                    <AuthLink isLogin={false}/>

                    <FooterLinks/>
                </div>
        </AuthLayout>
        
    )
}