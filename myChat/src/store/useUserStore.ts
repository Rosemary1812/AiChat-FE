import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { userService } from '../services/userService'
import type { User, LoginParams, RegisterParams } from '../types/user'

interface UserState {
    isAuthenticated: boolean
    user: User | null
    token: string | null
    loading: boolean
    error: string | null

    login: (params: LoginParams) => Promise<void>
    register: (params: RegisterParams) => Promise<void>
    logout: () => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    clearError: () => void
}

const userState = JSON.parse(localStorage.getItem('auth-storage') || '{}')

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            isAuthenticated: userState.isAuthenticated || false,
            user: userState.user || null,
            token: userState.token || null,
            loading: false,
            error: null,

            login: async (params: LoginParams) => {
                try {
                    set({ loading: true, error: null })
                    const userInfo = await userService.login(params)
                    set({
                        isAuthenticated: true,
                        user: {
                            nickName: userInfo.nickName,
                            id: userInfo.nickName, // 临时使用nickName作为id
                            username: params.userName
                        },
                        token: userInfo.token,
                        loading: false
                    })
                } catch (error) {
                    set({ 
                        error: error instanceof Error ? error.message : '登录失败',
                        loading: false 
                    })
                    throw error
                }
            },

            register: async (params: RegisterParams) => {
                try {
                    set({ loading: true, error: null })
                    const userInfo = await userService.register(params)
                    set({
                        isAuthenticated: true,
                        user: {
                            nickName: userInfo.nickName,
                            id: userInfo.nickName,
                            username: params.userName
                        },
                        token: userInfo.token,
                        loading: false
                    })
                } catch (error) {
                    set({ 
                        error: error instanceof Error ? error.message : '注册失败',
                        loading: false 
                    })
                    throw error
                }
            },

            logout: () => {
                set({
                    isAuthenticated: false,
                    user: null,
                    token: null
                })
            },

            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                token: state.token,
            })
        }
    )
)