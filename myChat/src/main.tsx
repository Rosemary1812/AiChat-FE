// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from './locales'

import './index.css'
import router from './router'
import './locales'
import { initializeTheme } from './store/useThemeStore'
import './styles/index.css'
// 初始化主题
initializeTheme()

createRoot(document.getElementById('root')!).render(
  <I18nextProvider i18n={i18n}>
    <RouterProvider router={router}></RouterProvider>
  </I18nextProvider>
)
