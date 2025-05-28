import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import Toast from './toast'

type AuthPopoverProps = {
    type: 'login' | 'logout'
    message: string
    onCancel: () => void
}

const AuthPopover: React.FC<AuthPopoverProps> = ({ type, message, onCancel }) => {
    const navigate = useNavigate()
    const [toast, setToast] = useState<{
        type: 'success' | 'failure'
        message: string
        errorDetail?: string
    } | null>(null)

    const onClickConfirm = () => {
        if (type === 'login') {
            navigate('/login')
        } else if (type === 'logout') {
            localStorage.removeItem('isUser')
            setToast({ type: 'success', message: '로그아웃 되었습니다.' })
            setTimeout(() => {
                setToast(null)
                window.location.reload()
            }, 500)
        }
    }

    return createPortal(
        <div
            className='fixed inset-0 z-50 bg-black/30 flex items-center justify-center'
            onClick={onCancel}
        >
            <div
                className='flex flex-col bg-white rounded-xl shadow-lg border px-6 py-4 w-[320px] gap-3 z-50'
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className='text-base font-medium text-zinc-950'>
                    {type === 'login' ? '로그인 필요' : '로그아웃 확인'}
                </h3>
                <p className='text-sm text-zinc-700 whitespace-pre-wrap'>
                    {message}
                    {type === 'login' ? '로그인이 필요합니다.\n' : ''}
                    {type === 'login'
                        ? '로그인 화면으로 이동하시겠습니까?'
                        : '로그아웃 하시겠습니까?'}
                </p>
                <div className='flex justify-end gap-4'>
                    <button className='text-[#4F46E5] text-sm font-medium' onClick={onCancel}>
                        취소
                    </button>
                    <button
                        className='text-sm font-medium px-4 py-1 rounded-md bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                        onClick={onClickConfirm}
                    >
                        확인
                    </button>
                </div>
            </div>

            {toast && (
                <Toast type={toast.type} message={toast.message} errorDetail={toast.errorDetail} />
            )}
        </div>,
        document.body,
    )
}

export default AuthPopover
