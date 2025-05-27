import React from 'react'

const CommentNone: React.FC = () => {
    return (
        <div className='w-full bg-zinc-100 rounded-2xl h-48 flex flex-col items-center justify-center gap-2'>
            <img src='/icons/comment.svg' alt='No comments' className='w-8 h-8 opacity-80' />
            <p className='text-sm font-medium text-zinc-500'>아직 이 카테고리의 댓글이 없어요</p>
        </div>
    )
}

export default CommentNone
