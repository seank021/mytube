import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import Toast from './toast'
import { useAuth } from '../contexts/authContext'

type AuthPopoverProps = {
    type: 'login' | 'logout'
    message: string
    onCancel: () => void
}

const AuthPopover: React.FC<AuthPopoverProps> = ({ type, message, onCancel }) => {
    const { login, logout } = useAuth()

    const [toast, setToast] = useState<{
        type: 'success' | 'failure'
        message: string
        errorDetail?: string
    } | null>(null)

    const [id, setId] = useState('')
    const [password, setPassword] = useState('')

    const onClickConfirm = () => {
        if (type === 'login') {
            if (id.trim() === '' || password.trim() === '') {
                setToast({
                    type: 'failure',
                    message: '아이디와 비밀번호를 모두 입력해주세요.',
                })
                setTimeout(() => setToast(null), 2000)
                return
            }
            if (id === 'test' && password === 'test1234') {
                login()
                setToast({
                    type: 'success',
                    message: '로그인 성공! 환영합니다, 테스트 유저님.',
                })
                setTimeout(() => {
                    setToast(null)
                    onCancel() // Close the popover
                }, 1000)
            } else {
                setToast({
                    type: 'failure',
                    message: '로그인에 실패했습니다.',
                    errorDetail: '아이디: test, 비밀번호: test1234로 로그인 해주세요.',
                })
                setTimeout(() => setToast(null), 4000)
            }
        } else if (type === 'logout') {
            logout()
            setToast({ type: 'success', message: '로그아웃 되었습니다.' })
            setTimeout(() => {
                setToast(null)
                onCancel() // Close the popover
            }, 1000)
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
                        ? '로그인 정보를 입력해주세요. \n(아이디: test, 비밀번호: test1234)'
                        : '로그아웃 하시겠습니까?'}
                </p>

                {type === 'login' && (
                    <div className='flex flex-col gap-2'>
                        <input
                            type='text'
                            placeholder='아이디'
                            className='w-full border px-3 py-2 rounded-md text-sm'
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                        <input
                            type='password'
                            placeholder='비밀번호'
                            className='w-full border px-3 py-2 rounded-md text-sm'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    onClickConfirm()
                                }
                            }}
                        />
                    </div>
                )}

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
