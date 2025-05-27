import React, { useState } from 'react'
import Toast from './toast'

const Header: React.FC = () => {
    const [toast, setToast] = useState<{
        type: 'success' | 'failure'
        message: string
        errorDetail?: string
    } | null>(null)

    const onClickLogin = () => {
        window.location.href = '/login'
    }

    const onClickLogout = () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            localStorage.removeItem('isUser')
            setToast({ type: 'success', message: '로그아웃 되었습니다.' })
            setTimeout(() => {
                setToast(null)
                window.location.reload()
            }, 1000)
        }
    }

    const isUser: boolean = localStorage.getItem('isUser') === 'true'

    return (
        <header className='flex w-full items-center justify-between px-16 py-6'>
            {/* Logo */}
            <h1
                className='text-3xl font-bold text-[#4F46E5] cursor-pointer'
                onClick={() => (window.location.href = '/')}
            >
                MeTube
            </h1>

            {/* Search Bar */}
            <div className='flex items-center bg-zinc-200 rounded-full px-4 w-[600px]'>
                <img src='/icons/search.svg' alt='검색' className='w-5 h-5 mr-2' />
                <input
                    type='text'
                    placeholder="'인컴상'을 검색해보세요!"
                    className='flex-1 bg-transparent py-[10px] text-sm focus:outline-none'
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            console.log('검색어:', (e.target as HTMLInputElement).value)
                        }
                    }}
                />
            </div>

            {isUser ? (
                <div className='flex items-center gap-4'>
                    {/* User Profile */}
                    <img
                        src='/icons/avatar.svg'
                        alt='User Profile'
                        className='w-8 h-8 rounded-full'
                    />
                    {/* Logout Button */}
                    <button
                        className='text-sm px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
                        onClick={onClickLogout}
                    >
                        로그아웃
                    </button>
                </div>
            ) : (
                <button
                    className='text-sm px-4 py-2 bg-[#4F46E5] text-white rounded-md hover:bg-[#4338CA] transition-colors'
                    onClick={onClickLogin}
                >
                    로그인
                </button>
            )}

            {/* Toast Notification */}
            {toast && (
                <Toast type={toast.type} message={toast.message} errorDetail={toast.errorDetail} />
            )}
        </header>
    )
}

export default Header
