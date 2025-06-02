import React from 'react'
import Filter from '../../components/filter'
import SortBox from '../../components/sortBox'
import CommentNone from '../../components/commentNone'
import Comment from '../../components/comment'
import type { CommentsDataType, CommentType } from '../../types/comments'

type SortKey = 'useful' | 'agree' | 'curious' | 'creative' | 'disagree' | 'latest'

type AddCommentType = (
    newComment: CommentType | { parentCommentId: string; reply: CommentType },
    tabs?: string[],
) => void

type QuestionProps = {
    comments: CommentsDataType
    filterValue: boolean
    setFilterValue: (value: boolean) => void
    sortKey: SortKey
    setSortKey: React.Dispatch<React.SetStateAction<SortKey>>
    handleAddComment: AddCommentType
}

const Question: React.FC<QuestionProps> = ({
    comments,
    filterValue,
    setFilterValue,
    sortKey,
    setSortKey,
    handleAddComment,
}) => {
    return (
        <>
            <div className='w-full flex justify-between items-center'>
                <span className='text-base font-semibold'>질문 {comments.length}개</span>
                <div className='flex items-center gap-4'>
                    <Filter
                        label='대댓글 달린 댓글만 보기'
                        filterValue={filterValue}
                        setFilterValue={setFilterValue}
                    />
                    <SortBox sortKey={sortKey} setSortKey={setSortKey} />
                </div>
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

export default Question
