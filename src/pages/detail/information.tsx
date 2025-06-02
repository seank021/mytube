import React from 'react'
import CommentNone from '../../components/commentNone'
import Comment from '../../components/comment'
import type { CommentsDataType, CommentType } from '../../types/comments'

type AddCommentType = (
    newComment: CommentType | { parentCommentId: string; reply: CommentType },
    tabs?: string[],
) => void

type InformationProps = {
    comments: CommentsDataType
    handleAddComment: AddCommentType
}

const Information: React.FC<InformationProps> = ({ comments, handleAddComment }) => {
    return (
        <div className='flex flex-col gap-7 w-full'>
            {comments.length === 0 && <CommentNone />}
            {comments.length > 0 &&
                comments.map((comment) => (
                    <Comment
                        key={comment.comment_id}
                        comment={comment}
                        repliesData={comment.replies || []}
                        onAddComment={handleAddComment}
                    />
                ))}
        </div>
    )
}

export default Information
