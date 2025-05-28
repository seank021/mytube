import React from 'react'
import type { ClusterType } from '../types/clusters'
import { getAvgTimeTaken } from '../utils/getAvgTimeTaken'
import { getWriteTime } from '../utils/getWriteTime'
import { drawGraph } from '../utils/drawGraph'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import type { CommentType } from '../types/comments'

interface ClusterBoxProps {
    cluster: ClusterType
    isManipulationFilter: boolean
    onClick?: (id: string) => void
    comments: CommentType[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className='bg-white border border-zinc-300 rounded-md px-3 py-2 text-xs shadow-md'>
                <p>{label}</p>
                <p>댓글 수: {payload[0].value}</p>
            </div>
        )
    }
    return null
}

const ClusterBox: React.FC<ClusterBoxProps> = ({
    cluster,
    isManipulationFilter,
    onClick,
    comments,
}) => {
    const avgTime = getAvgTimeTaken(comments, cluster.id, isManipulationFilter)
    const graphRaw = drawGraph(comments, cluster.id, isManipulationFilter)
    const graphData = graphRaw.x.map((unix, idx) => ({
        time: new Date(unix).toLocaleTimeString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }),
        count: graphRaw.y[idx],
    }))

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
                        <span className='text-xs text-zinc-500'>평균 {getWriteTime(avgTime)}</span>
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

            {/* Graph */}
            <div className='h-full w-1/2 p-5 bg-gray-100 rounded-lg'>
                {graphData && graphData.length > 0 ? (
                    <ResponsiveContainer width='100%' height={150}>
                        <LineChart data={graphData}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='time' hide tick={{ fontSize: 10 }} />
                            <YAxis allowDecimals={false} width={40} tick={{ fontSize: 10 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type='monotone'
                                dataKey='count'
                                stroke='#4F46E5'
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className='h-full p-10 bg-gray-100 rounded-lg flex items-center justify-center'>
                        <p className='text-gray-500'>아직 댓글이 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ClusterBox
