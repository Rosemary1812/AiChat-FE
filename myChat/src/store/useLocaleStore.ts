import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'

import i18n from '../locales'

export type LocaleType = 'zh-CN' | 'en-US'

const localeMap={
    'zh-CN':zhCN,
    'en-US':enUS
}

interface LocaleStore{
    locale:LocaleType
    antdLocale:typeof zhCN | typeof enUS
    changeLocale:(locale:LocaleType)=>void 
}

export const useLocaleStore=create<LocaleStore>()(
    persist(
    (set)=>({
        locale:(i18n.language as LocaleType) || 'zh-CN',
        antdLocale:i18n.language==='zh-CN'?zhCN:enUS,

        changeLocale:(locale:LocaleType)=>{
            i18n.changeLanguage(locale)
            dayjs.locale(locale==='zh-CN'?'zh-cn':'en')
            set({
                locale,
                antdLocale:localeMap[locale]
            })
        }
    }),
    {
        name:'app-locale',
    }
    )
)