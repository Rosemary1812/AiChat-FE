import { MenuFoldOutlined ,MenuUnfoldOutlined} from "@ant-design/icons";
import {UserAvatar} from '../Author/UserAvatar'
import { useState } from "react";
import { Outlet } from "react-router-dom";

// import { UserAvatar } from '../Author/UserAvatar'
import { ConversationSidebar } from '../Conversation/ConversationSidebar'

export default function LayoutWithSidebar(){
    const [collapsed,setCollapsed] = useState(false);

    return(
        <div className="flex h-screen bg-white">
            {/* 侧边栏 */}
            <div
            className={`${
                collapsed ? 'w-10' : 'w-64'
            } bg-gray-50 border-r border-gray-200 transition-all duration-300 flex flex-col overflow-hidden `}>
                <div className="flex justify-between items-center p-2 border-b border-gray-200 bg-gray-50">
                    {!collapsed&&<img src="/gemini_icon.png" alt="Gemini" className="w-8 h-8"/>}
                    <div className="flex items-center">
                        {collapsed?(
                            <MenuUnfoldOutlined
                            onClick={()=>setCollapsed(false)}
                            className="cursor-pointer text-gray-600 hover:text-gray-800"
                            />
                        ):(
                            <MenuFoldOutlined
                            onClick={()=>setCollapsed(true)}
                            className="cursor-pointer text-gray-600 hover:text-gray-800"
                            />
                        )}
                    </div>
                </div>
                {!collapsed&&<ConversationSidebar/>}
            </div>

            {/* 主内容区域 */}
            <div className="flex-1 relative overflow-hidden bg-white">
                <div className="absolute top-0 right-0 p-4 z-10">
                    <UserAvatar/>
                </div>
                <Outlet/>
            </div>
        </div>
    )
}