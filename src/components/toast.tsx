import React from 'react'
import { createPortal } from 'react-dom'

const Toast: React.FC<{
    type: 'success' | 'failure'
    message: string
    errorDetail?: string
}> = ({ type, message, errorDetail }) => {
    return createPortal(
        <div className='fixed bottom-10 right-10 px-5 py-4 rounded-xl shadow-xl max-w-sm w-full z-50 transition-all bg-white border-1 border-zinc-500'>
            <div className='flex flex-col items-start justify-center gap-1'>
                <div className='flex gap-2 items-center justify-center'>
                    <img
                        src={type === 'success' ? '/icons/greenCheck.svg' : '/icons/redX.svg'}
                        alt='icon'
                        className='w-6 h-6'
                    />
                    <p
                        className={`text-sm text-zinc-950 whitespace-pre-wrap ${type === 'failure' ? 'font-semibold' : ''}`}
                    >
                        {message}
                    </p>
                </div>
                {type === 'failure' && errorDetail && <p className='text-xs ml-8'>{errorDetail}</p>}
            </div>
        </div>,
        document.body,
    )
}

export default Toast
