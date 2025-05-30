// components/AlertModal.tsx
import React from 'react'

type AlertModalProps = {
    timeTaken: string
}

const AlertModal: React.FC<AlertModalProps> = ({ timeTaken }) => {
    return (
        <div className='absolute top-[20px] left-0 z-50 w-[360px] p-4 bg-white border border-red-200 rounded-lg shadow-md'>
            <div className='flex items-start gap-3'>
                <img src='/icons/alert.svg' alt='Warning' className='w-10 h-10' />
                <div className='flex flex-col gap-1'>
                    <p className='text-sm font-semibold text-red-600'>
                        여론 조작이 의심되는 댓글이에요!
                    </p>
                    <p className='text-sm text-zinc-700'>
                        짧은 시간 안에 비슷한 댓글이 빠르게 달렸어요.
                    </p>
                    <div className='flex items-center gap-1 mt-1'>
                        <img src='/icons/write.svg' alt='작성시간' className='w-3 h-3' />
                        <span className='text-xs text-zinc-500'>댓글 작성까지 {timeTaken}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AlertModal
