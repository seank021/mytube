import React, { useState, useRef } from 'react'
import LoginPopover from './loginPopover'
import Toast from './toast'
import type { UserType } from '../types/users'

type CommentWriteFormProps = {
    user: UserType
    commentType: string // 예: '댓글', '대댓글'
}

const CommentWriteForm: React.FC<CommentWriteFormProps> = ({ user, commentType }) => {
    const isUser: boolean = localStorage.getItem('isUser') === 'true'
    const [text, setText] = useState('')
    const [showLoginPopover, setShowLoginPopover] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const [toast, setToast] = useState<{
        type: 'success' | 'failure'
        message: string
        errorDetail?: string
    } | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!isUser) {
            setShowLoginPopover(true)
            return
        }
        setText(e.target.value)
    }

    const handleSubmit = () => {
        if (text.trim() === '') {
            setToast({
                type: 'failure',
                message: '댓글 내용을 작성해주세요.',
            })
            setTimeout(() => setToast(null), 1500)
            return
        }

        // TODO: LLM api 연결
        console.log('작성된 댓글:', text)
        setToast({
            type: 'success',
            message: '댓글이 성공적으로 작성되었습니다.',
        })
        setTimeout(() => setToast(null), 1500)
        setText('')
    }

    const isActive = text.trim().length > 0

    return (
        <div className='relative flex items-start gap-5 w-full' ref={containerRef}>
            <img
                src={user.profile_image}
                alt='User'
                className='w-10 h-10 rounded-full object-cover'
            />

            <div className='relative flex-1 bg-zinc-100 rounded-md px-4 py-3 h-[100px]'>
                <textarea
                    value={text}
                    onChange={handleChange}
                    placeholder={
                        isUser
                            ? `${user.name} 님의 ${commentType}을 남겨보세요!`
                            : '댓글을 작성하려면 로그인이 필요해요.'
                    }
                    className='w-[92%] h-full resize-none bg-transparent hidescroll focus:outline-none text-base text-black placeholder-zinc-500'
                />
                <button
                    onClick={handleSubmit}
                    disabled={!isActive}
                    className={`absolute bottom-3 right-3 px-4 py-2 rounded-md text-sm font-semibold transition 
                        ${
                            isActive
                                ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                                : 'bg-[#C7D2FE] text-white opacity-50 cursor-default'
                        }`}
                >
                    등록
                </button>
            </div>

            {/* Login Popover */}
            {showLoginPopover && (
                <LoginPopover
                    message='댓글을 작성하려면'
                    onCancel={() => setShowLoginPopover(false)}
                />
            )}

            {/* Toast Notification */}
            {toast && (
                <Toast type={toast.type} message={toast.message} errorDetail={toast.errorDetail} />
            )}
        </div>
    )
}

export default CommentWriteForm
