// 반응 수
export type ReactionCountsType = {
    useful: number
    agree: number
    curious: number
    creative: number
    disagree: number
}

// 대댓글
export type ReplyType = {
    comment_id: string
    author_id: string
    author_name: string
    author_profile_image: string
    timestamp: string
    content: string
    reactions: ReactionCountsType
    time_taken_to_write: number
    manipulated: boolean
}

// 상위 댓글
export type CommentType = {
    comment_id: string
    author_id: string
    author_name: string
    author_profile_image: string
    timestamp: string
    content: string
    reactions: ReactionCountsType
    time_taken_to_write: number
    manipulated: boolean
    tab?: string | string[] | null
    cluster?: string | null
    reply_ids?: string[]
    replies?: ReplyType[]
    isMine?: boolean
}

// 전체 댓글 데이터
export type CommentsDataType = CommentType[]
