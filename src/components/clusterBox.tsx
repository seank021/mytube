import React from 'react'
import type { ClusterType } from '../types/clusters'
import { getAvgTimeTaken } from '../utils/getAvgTimeTaken'
import { getWriteTime } from '../utils/getWriteTime'
import { COMMENT_DATA_OPINION } from '../data/comments/fnCY6ysVkAg/opinion'

interface ClusterBoxProps {
    cluster: ClusterType
    isManipulationFilter: boolean
    onClick?: (id: string) => void
}

const ClusterBox: React.FC<ClusterBoxProps> = ({ cluster, isManipulationFilter, onClick }) => {
    return (
        <div
            className='flex justify-between items-center p-6 rounded-lg border border-zinc-200 shadow-sm cursor-pointer hover:shadow-md transition'
            onClick={() => onClick?.(cluster.id)}
        >
            <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-4'>
                    <h3 className='text-xl font-bold text-zinc-950'>{cluster.name}</h3>
                    <div className='flex items-center gap-1'>
                        <img src='/icons/write.svg' alt='comment' className='w-3 h-3' />
                        <span className='text-xs text-zinc-500'>
                            평균{' '}
                            {getWriteTime(
                                getAvgTimeTaken(
                                    COMMENT_DATA_OPINION,
                                    cluster.id,
                                    isManipulationFilter,
                                ),
                            )}
                        </span>
                    </div>
                </div>
                <p className='text-sm text-zinc-500'>"{cluster.description}"</p>
                <div className='flex gap-2 flex-wrap mt-5'>
                    {cluster.tags &&
                        cluster.tags.map((tag, i) => (
                            <span
                                key={i}
                                className={`text-xs px-3 py-[4px] rounded-lg border font-medium
                                ${
                                    tag.includes('긍정')
                                        ? 'bg-green-500 text-white border-green-500'
                                        : tag.includes('부정')
                                          ? 'bg-red-500 text-white border-red-500'
                                          : tag.includes('중립')
                                            ? 'bg-gray-400 text-white border-gray-400'
                                            : 'bg-white text-zinc-950 border-zinc-300'
                                }`}
                            >
                                {tag}
                            </span>
                        ))}
                </div>
            </div>

            {/* Graph - TODO */}
            <div className='h-full p-10 bg-gray-100 rounded-lg flex items-center justify-center'>
                <p className='text-gray-500'>클러스터 그래프 (미구현)</p>
            </div>
        </div>
    )
}

export default ClusterBox
