import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserType } from '../types/users'

type CommentWriteFormProps = {
    user: UserType
    commentType: string // 예: '댓글', '대댓글'
}

const CommentWriteForm: React.FC<CommentWriteFormProps> = ({ user, commentType }) => {
    const navigate = useNavigate()

    const isUser: boolean = localStorage.getItem('isUser') === 'true'

    const [text, setText] = useState('')

    const handleSubmit = () => {
        if (!isUser) {
            const confirmLogin = window.confirm(
                '댓글을 작성하려면 로그인이 필요합니다.\n로그인 화면으로 이동하시겠습니까?',
            )
            if (confirmLogin) navigate('/login')
            return
        }
        if (text.trim() === '') return
        console.log('작성된 댓글:', text)
    }

    const isActive = text.trim().length > 0

    return (
        <div className='flex items-start gap-5 w-full'>
            <img
                src={user.profile_image}
                alt='User'
                className='w-10 h-10 rounded-full object-cover'
            />

            <div className='relative flex-1 bg-zinc-100 rounded-md px-4 py-3 h-[100px]'>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
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
        </div>
    )
}

export default CommentWriteForm
