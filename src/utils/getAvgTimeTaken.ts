import type { CommentType } from '../types/comments'
import { getFilteredCommentsAndReplies } from './getFilteredCommentsAndReplies'

export const getAvgTimeTaken = (
    comments: CommentType[],
    cluster: string,
    isManipulationFilter: boolean,
): number => {
    const filtered = getFilteredCommentsAndReplies(comments, cluster, isManipulationFilter)
    if (filtered.length === 0) return 0

    const totalTime = filtered.reduce((sum, c) => sum + c.time_taken_to_write, 0)
    return Math.floor(totalTime / filtered.length)
}
