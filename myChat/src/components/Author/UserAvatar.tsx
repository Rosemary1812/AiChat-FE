import{UserOutlined,LogoutOutlined,SettingOutlined} from '@ant-design/icons'
import{Avatar,Dropdown,Button,Modal,message} from 'antd'
import{useState} from 'react'
import{useNavigate} from 'react-router-dom'
// import{userService} from '../../services/userService'
import {useUserStore} from '../../store/useUserStore'
import type{MenuProps}from 'antd/lib/menu'

export function UserAvatar(){
    const {isAuthenticated,user}=useUserStore()
    const navigate=useNavigate()
    // const [confirmVisible,setConfirmVisible]=useState(false)

    // const handleLogin=()=>{
    //     navigate('/login')
    // }

    const handleLogout=()=>{
        // setConfirmVisible(false)
    }

    // const confirmLogout=()=>{
    //     userService.logout()
    //     message.success('已退出登录')
    //     setConfirmVisible(false)
    //     navigate('/login')
    // }

    const menuItems:MenuProps['items']=[
        {
            key:'profile',
            icon:<UserOutlined/>,
            label:'个人中心',
        },
        {
            key:'settings',
            icon:<SettingOutlined/>,
            label:'设置',
        },
        {
            key:'divider',
        },
        {
            key:'logout',
            icon:<LogoutOutlined/>,
            label:'退出登录',
            onClick:handleLogout,
        }
    ]
    if(isAuthenticated&&user){
        return(
            <>
            <Dropdown menu={{items:menuItems}} placement="bottomRight">
                <Avatar 
                size="small"
                src={user.avatar}
                icon={!user.avatar ?<UserOutlined/>:null}
                className="bg-emerald-500 cursor-pointer"
                />
            </Dropdown>

            <Modal
            title="确认退出"
            // open={confirmVisible}
            // onOK={confirmLogout}
            // onCancel={()=>setConfirmVisible(false)}
            okText="确认"
            cancelText="取消">
            <p>确定要退出登录吗？</p>
            </Modal>
            </>
        )
    }
    return(
        <Button
        type="primary"
        size="small"
        icon={<UserOutlined/>}
        // onClick={handleLogin}
        className="bg-emerald-500 hover:bg-emerald-600">
            登录
        </Button>
    )
}