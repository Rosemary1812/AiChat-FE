import {useState} from 'react'
import {useTranslation} from 'react-i18next'

import type {RegisterParams,CaptchaParams} from '../../types/user'

interface RegisterFormProps{
    onSubmit:(params:RegisterParams)=>void
    onSendCaptcha:(params:CaptchaParams)=>void
    buttonText?:string
    loading?:boolean
}

export default function RegisterForm({
    onSubmit,
    onSendCaptcha,
    buttonText='注册',
    loading=false,
}:RegisterFormProps){
    const {t}=useTranslation()
    const [captchaSent,setCaptchaSent]=useState(false)
    const [countdown,setCountdown]=useState(0)
    const [address,setAddress]=useState('')
    const [error,setError]=useState<string|null>(null)

    const handleSubmit=(e:React.FormEvent)=>{
        e.preventDefault()
        setError(null)
        const formData=new FormData(e.target as HTMLFormElement)
        const userName=formData.get('username') as string
        const password=formData.get('password') as string
        const nickName=formData.get('nickname') as string
        const captcha=formData.get('captcha') as string

        if(password.length<6||password.length>20){
            setError(t('form.passwordLengthError'))
            return
    }
        if(nickName.length<2||nickName.length>20){
            setError(t('form.nicknameLengthError'))
            return
        }
        onSubmit({userName,password,nickName,captcha})
}
    const handleSendCaptcha=async()=>{
        setError(null)
        if(!address){
            setError(t('form.addressRequired'))
            return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
            setError(t('form.emailInvalid'))
            return
    }   
    try{
        await onSendCaptcha({address})
        setCaptchaSent(true)

        let seconds=60
        setCountdown(seconds)
        const timer=setInterval(()=>{
            seconds=-1
            setCountdown(seconds)
            if(seconds<=0){
                clearInterval(timer)
                setCaptchaSent(false)
            }
        },1000)
    }catch(error){
        console.error('验证码发送失败',error)
        setError(t('form.captchaSendFailed'))
    }
}
    return(
        <form onSubmit={handleSubmit} className="space-y-4">
            {error&&(
                <div className="p-3 bg-red-50 border-red-200 rounded-md text-red-600 text-sm">
                    {error}
                </div>
            )}
            <div>
                <input
                    type="email"
                    name="userName"
                    placeholder={t('form.email')}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    onChange={(e)=>setAddress(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    name="password"
                    placeholder={t('form.passwordPlaceholder')}
                    required
                    minLength={6}
                    maxLength={20}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
            </div>

            <div>
                <input
                    type="text"
                    name="nickname"
                    placeholder={t('form.nicknamePlaceholder')}
                    required
                    minLength={2}
                    maxLength={20}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    name="captcha"
                    placeholder={t('form.captcha')}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                    type="button"
                    onClick={handleSendCaptcha}
                    disabled={loading||captchaSent}
                    className="text-xs px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {captchaSent?t('form.captchaCountdown',{count:countdown}):t('form.sendCaptcha')}
                </button>
            </div>
            <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition disabled:bg-emerald-300 disabled:cursor-not-allowed"
            >
                {loading?t('common.processing'):buttonText}
            </button>
        </form>
    )
}