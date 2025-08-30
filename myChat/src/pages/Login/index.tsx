import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import AuthLanguageSwitch from '../../components/Author/AuthLanguageSwitch'
import AuthLayout from '../../components/Author/AuthLayout'
import AuthLink from '../../components/Author/AuthLink'
import FooterLinks from '../../components/Author/FooterLinks'
import EmailForm from '../../components/Author/EmailForm'
import { useUserStore } from '../../store/useUserStore'

import type { LoginParams } from '../../types/user'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { error, login } = useUserStore()

    const handleLoginSubmit = async (params: LoginParams) => {
        setLoading(true)
        try {
            await login(params)
            navigate('/', { replace: true })
        } catch (error) {
            console.error('登录失败', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout title={t('登录')}>
            <div className="space-y-4">
                <AuthLanguageSwitch />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                
                <EmailForm
                    onSubmit={handleLoginSubmit}
                    loading={loading}
                    isLogin={true}
                />
                <AuthLink isLogin={true} />
                <FooterLinks />
            </div>
        </AuthLayout>
    )
}