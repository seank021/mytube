import React from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'

type LoginPopoverProps = {
    message: string
    onCancel: () => void
}

const LoginPopover: React.FC<LoginPopoverProps> = ({ message, onCancel }) => {
    const navigate = useNavigate()

    return createPortal(
        <div
            className='fixed inset-0 z-50 bg-black/30 flex items-center justify-center'
            onClick={onCancel}
        >
            <div
                className='flex flex-col bg-white rounded-xl shadow-lg border px-6 py-4 w-[320px] gap-3 z-50'
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className='text-base font-medium text-zinc-950'>로그인이 필요해요</h3>
                <p className='text-sm text-zinc-700 whitespace-pre-wrap'>
                    {message} 로그인이 필요합니다.
                    {'\n'}로그인 화면으로 이동하시겠습니까?
                </p>
                <div className='flex justify-end gap-4'>
                    <button className='text-[#4F46E5] text-sm font-medium' onClick={onCancel}>
                        취소
                    </button>
                    <button
                        className='text-sm font-medium px-4 py-1 rounded-md bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                        onClick={() => navigate('/login')}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    )
}

export default LoginPopover
