import type { CommentType, ReplyType } from '../types/comments'

export const getFilteredCommentsAndReplies = (
    comments: CommentType[],
    cluster: string,
    isManipulationFilter: boolean,
): (CommentType | ReplyType)[] => {
    const shouldInclude = (manipulated: boolean) => (isManipulationFilter ? !manipulated : true)

    return comments.flatMap((comment) => {
        if (comment.cluster !== cluster) return []

        const results = []

        if (shouldInclude(comment.manipulated)) {
            results.push(comment)
        }

        if (comment.replies) {
            results.push(...comment.replies.filter((r) => shouldInclude(r.manipulated)))
        }

        return results
    })
}
