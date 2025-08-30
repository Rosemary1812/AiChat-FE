import dayjs from 'dayjs'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import {initReactI18next} from 'react-i18next'

import enUS from './en-US'
import zhCN from './zh-CN'

import 'dayjs/locale/zh-cn'

const resources={
    'en-US':{
        translation:enUS
    },
    'zh-CN':{
        translation:zhCN
    }
}

// 确保i18n实例是单例
if (!i18n.isInitialized) {
    i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            resources,
            fallbackLng:'zh-CN',
            lng: 'zh-CN',
            debug: true, // 添加调试模式
            interpolation:{
                escapeValue:false
            },
            detection:{
                order:['localStorage','navigator'],
                lookupLocalStorage:'i18nextLng',
                caches:['localStorage'],
                convertDetectedLanguage: (lng) => {
                    if (lng.startsWith('zh')) return 'zh-CN'
                    if (lng.startsWith('en')) return 'en-US'
                    return lng
                }
            }
        })
        .then(() => {
            console.log('i18n initialized successfully:', i18n.language)
        })
        .catch((error) => {
            console.error('i18n initialization failed:', error)
        })
}

const currentLanguage=i18n.language
dayjs.locale(currentLanguage==='zh-CN'?'zh-cn':'en')

export default i18n