import { getFilteredCommentsAndReplies } from './getFilteredCommentsAndReplies'
import type { CommentType } from '../types/comments'

const toUnix = (timestamp: string) => new Date(timestamp).getTime()

export const drawGraph = (
    comments: CommentType[],
    cluster: string,
    isManipulationFilter: boolean,
    numBins: number = 100,
): { x: number[]; y: number[] } => {
    const filtered = getFilteredCommentsAndReplies(comments, cluster, isManipulationFilter)
    const times = filtered.map((c) => toUnix(c.timestamp)).sort((a, b) => a - b)

    if (times.length === 0) return { x: [], y: [] }

    const min = times[0]
    const max = times[times.length - 1]
    const binSize = (max - min) / numBins

    const bins = new Array(numBins).fill(0)

    times.forEach((time) => {
        const index = Math.min(Math.floor((time - min) / binSize), numBins - 1)
        bins[index]++
    })

    const x = bins.map((_, i) => min + i * binSize) // UNIX timestamp
    const y = bins

    return { x, y }
}
