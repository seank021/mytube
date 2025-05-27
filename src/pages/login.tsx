import React, { useState } from 'react'
import Toast from '../components/toast'

const Login: React.FC = () => {
    const [id, setId] = useState('')
    const [password, setPassword] = useState('')
    const [toast, setToast] = useState<{
        type: 'success' | 'failure'
        message: string
        errorDetail?: string
    } | null>(null)

    const onClickLogin = () => {
        if (id === 'test' && password === 'test1234') {
            localStorage.setItem('isUser', 'true')
            setToast({
                type: 'success',
                message: '로그인 성공! 환영합니다, 테스트 유저님.',
            })
            setTimeout(() => {
                setToast(null)
                window.location.href = '/'
            }, 1000)
        } else {
            setToast({
                type: 'failure',
                message: '로그인에 실패했습니다.',
                errorDetail: '아이디: test, 비밀번호: test1234로 로그인 해주세요.',
            })
            setTimeout(() => {
                setToast(null)
            }, 2000)
        }
    }

    const onClickGoogleLogin = () => {
        setToast({
            type: 'failure',
            message: '테스트 유저는 일반 로그인을 사용해주세요.',
            errorDetail: '아이디: test, 비밀번호: test1234로 로그인 해주세요.',
        })
        setTimeout(() => {
            setToast(null)
        }, 2000)
    }

    const onClickSignUp = () => {
        setToast({
            type: 'failure',
            message: '테스트 유저는 일반 로그인을 사용해주세요.',
            errorDetail: '아이디: test, 비밀번호: test1234로 로그인 해주세요.',
        })
        setTimeout(() => {
            setToast(null)
        }, 2000)
    }

    return (
        <div className='flex h-screen'>
            {/* Left Side */}
            <div className='w-2/5 bg-[#1E1B4B] text-white flex flex-col justify-between px-10 py-10'>
                <div
                    className='flex items-center gap-3 cursor-pointer'
                    onClick={() => (window.location.href = '/')}
                >
                    <img src='/icons/logo.svg' alt='MeTube Logo' className='w-6 h-6' />
                    <span className='text-white text-lg font-medium'>MeTube</span>
                </div>
                <div className='text-sm'>
                    <p className='mb-1 italic'>
                        "Don't let the noise of others’ opinions drown out your own inner voice."
                    </p>
                    <p className='mb-2 italic'>
                        "다른 사람의 의견이라는 소음이 당신의 내면의 목소리를 덮어버리지 않게 하라."
                    </p>
                    <p className='mt-1 text-xs italic'>Steve Jobs (스티브 잡스)</p>
                </div>
            </div>

            {/* Right Side */}
            <div className='w-3/5 flex items-center justify-center'>
                <div className='w-full max-w-xs flex flex-col text-center gap-2'>
                    <h2 className='text-2xl font-bold text-zinc-950 mb-1'>로그인</h2>
                    <p className='text-sm text-zinc-500 mb-4'>
                        MeTube에 로그인하고 당신의 의견을 정리해보세요.
                    </p>

                    <input
                        type='text'
                        placeholder='아이디를 입력하세요.'
                        className='px-3 py-2 border text-sm border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400'
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                    <input
                        type='password'
                        placeholder='비밀번호를 입력하세요.'
                        className='px-3 py-2 border text-sm border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        className='w-full bg-[#4F46E5] text-zinc-50 py-2 rounded-md font-medium text-sm hover:bg-[#4338CA] transition-colors'
                        onClick={onClickLogin}
                    >
                        로그인
                    </button>

                    <div className='flex items-center gap-2 text-zinc-500 text-xs my-4'>
                        <div className='flex-1 h-px bg-zinc-200' />
                        또는 다음으로 계속하기
                        <div className='flex-1 h-px bg-zinc-200' />
                    </div>

                    <button
                        className='flex items-center justify-center gap-1 border border-zinc-200 rounded-md py-2 text-sm hover:bg-zinc-100 shadow-sm transition mb-4'
                        onClick={onClickGoogleLogin}
                    >
                        <img src='/icons/google.svg' alt='Google' className='w-5 h-5' />
                        <span className='text-zinc-950 text-sm font-medium'>Google</span>
                    </button>

                    <div className='text-center text-sm text-zinc-500'>
                        계정이 없으신가요?{' '}
                        <span className='underline cursor-pointer' onClick={onClickSignUp}>
                            회원가입
                        </span>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <Toast type={toast.type} message={toast.message} errorDetail={toast.errorDetail} />
            )}
        </div>
    )
}

export default Login
