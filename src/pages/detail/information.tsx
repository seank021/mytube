import React from 'react'
import SortBox from '../../components/sortBox'
import CommentNone from '../../components/commentNone'
import Comment from '../../components/comment'
import type { CommentsDataType, CommentType } from '../../types/comments'

type SortKey = 'useful' | 'agree' | 'curious' | 'creative' | 'disagree' | 'latest'

type AddCommentType = (
    newComment: CommentType | { parentCommentId: string; reply: CommentType },
    tabs?: string[],
) => void

type InformationProps = {
    comments: CommentsDataType
    sortKey: SortKey
    setSortKey: React.Dispatch<React.SetStateAction<SortKey>>
    handleAddComment: AddCommentType
}

const Information: React.FC<InformationProps> = ({
    comments,
    sortKey,
    setSortKey,
    handleAddComment,
}) => {
    return (
        <>
            <div className='w-full flex justify-between items-center'>
                <span className='text-base font-semibold'>정보성 댓글 {comments.length}개</span>
                <SortBox sortKey={sortKey} setSortKey={setSortKey} />
            </div>
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
        </>
    )
}

export default Information
