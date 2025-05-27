import type { CommentType } from '../types/comments'

export const getAvgTimeTaken = (
    comments: CommentType[],
    cluster: string,
    isManipulationFilter: boolean,
): number => {
    const filtered = comments.flatMap((comment) => {
        if (comment.cluster !== cluster) return []

        const results = []

        const shouldInclude = (manipulated: boolean) => (isManipulationFilter ? !manipulated : true)

        if (shouldInclude(comment.manipulated)) {
            results.push(comment)
        }

        if (comment.replies) {
            const matchedReplies = comment.replies.filter((reply) =>
                shouldInclude(reply.manipulated),
            )
            results.push(...matchedReplies)
        }

        return results
    })

    if (filtered.length === 0) return 0

    const totalTime = filtered.reduce((sum, c) => sum + c.time_taken_to_write, 0)
    return Math.floor(totalTime / filtered.length)
}
