import {XProvider} from '@ant-design/x'
import {ConfigProvider,theme as antdTheme} from 'antd'
import {useEffect} from 'react'
import {Outlet,useNavigate} from 'react-router-dom'

import './locales'
import ThemeToggle from './components/ThemeToggle'
import {useUserStore,useLocaleStore,useThemeStore} from './store'

function App(){
  const {isAuthenticated,error}=useUserStore()
  const navigate=useNavigate()
  useEffect(()=>{
    if(!isAuthenticated&&!error){
      navigate('/login')
      useUserStore.setState({error:'null'})
    }
  },[isAuthenticated,error,navigate])

  const {antdLocale}=useLocaleStore()
  const {theme}=useThemeStore()
  const isDrak=theme==='dark'

  const themeConfig={
    algorithm:isDrak?antdTheme.darkAlgorithm:antdTheme.defaultAlgorithm,
    token:{
      colorBgContainer:isDrak?'#141414':undefined,
    }
  }

  return (
    <ConfigProvider locale={antdLocale} theme={themeConfig}>
      <XProvider theme={themeConfig}>
        <div className="min-h-screen">
          <Outlet/>
          <ThemeToggle/>
        </div>
      </XProvider>
    </ConfigProvider>
  )
}

export default App