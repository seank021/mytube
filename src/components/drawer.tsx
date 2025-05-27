import React, { useEffect, useState } from 'react'
import { cn } from '../utils/cn'

type Props = {
    open: boolean
    onClose: () => void
    children: React.ReactNode
}

const Drawer: React.FC<Props> = ({ open, onClose, children }) => {
    const [isVisible, setIsVisible] = useState(open)

    useEffect(() => {
        if (open) {
            setTimeout(() => setIsVisible(true), 10)
        } else {
            setIsVisible(false)
        }
    }, [open])

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(onClose, 300)
    }

    return (
        <div
            className={cn(
                'fixed inset-0 z-50 transition-opacity duration-300 ease-in-out bg-black/30',
                open ? 'opacity-100 visible' : 'opacity-0 invisible',
            )}
            onClick={handleClose}
        >
            <div
                className={cn(
                    'fixed p-10 right-0 top-0 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out overflow-y-auto',
                    isVisible ? 'translate-x-0' : 'translate-x-full',
                )}
                style={{ width: '65%' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className='flex items-center justify-between mb-5'>
                    <div className='flex flex-col gap-2'>
                        <p className='text-2xl font-semibold'>의견 모아보기</p>
                        <span className='text-gray-500 text-sm'>
                            각 의견 클러스터의 상세 댓글들을 모아볼 수 있습니다.
                        </span>
                    </div>
                    <button onClick={handleClose}>
                        <img src='/icons/x.svg' alt='Close' className='w-8 h-8' />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Drawer
