import React, { useMemo, useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import Comment from '../components/comment'
import CommentNone from '../components/commentNone'
import CommentWriteForm from '../components/commentWriteForm'
import Tab from '../components/tab'
import SortBox from '../components/sortBox'
import Filter from '../components/filter'
import ClusterBox from '../components/clusterBox'
import Drawer from '../components/drawer'
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
import { COMMENT_DATA_INFO } from '../data/comments/fnCY6ysVkAg/information'
import { COMMENT_DATA_OPINION } from '../data/comments/fnCY6ysVkAg/opinion'
import { COMMENT_DATA_QUESTION } from '../data/comments/fnCY6ysVkAg/question'
import { CLUSTERS } from '../data/clusters/fnCY6ysVkAg/cluster'
import { TEST_USER } from '../data/users/test'
import { VIDEOS } from '../data/videos/videos'

const Detail: React.FC = () => {
    const { videoId } = useParams<{ videoId: string }>()
    const location = useLocation()
    const initialTab = new URLSearchParams(location.search).get('tab') || 'information'
    const [tab, setTab] = useState(initialTab)

    type SortKey = 'useful' | 'agree' | 'curious' | 'creative' | 'disagree' | 'latest'
    const [sortKey, setSortKey] = useState<SortKey>('useful')

    const [onlyWithReplies, setOnlyWithReplies] = useState(false)
    const [onlyWithNonManipulated, setOnlyWithNonManipulated] = useState(false)
    const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null)

    useEffect(() => {
        const newSearchParams = new URLSearchParams(location.search)
        newSearchParams.set('tab', tab)
        window.history.replaceState(null, '', `${location.pathname}?${newSearchParams.toString()}`)
    }, [tab, location.pathname])

    const video = VIDEOS.find((v) => v.id === videoId)
    if (!video)
        return (
            <div className='p-10 text-center text-xl text-red-500'>비디오를 찾을 수 없습니다.</div>
        )

    const [commentsByTab, setCommentsByTab] = useState<Record<string, CommentType[]>>({
        information: COMMENT_DATA_INFO,
        opinion: COMMENT_DATA_OPINION,
        question: COMMENT_DATA_QUESTION,
    })

    const comments = useMemo(() => commentsByTab[tab] || [], [commentsByTab, tab])

    type AddCommentType = (
        newComment: CommentType | { parentCommentId: string; reply: CommentType },
        tabs?: string[],
        clusterId?: string | null,
    ) => void

    const handleAddComment: AddCommentType = (newComment, tabs, clusterId) => {
        if ('parentCommentId' in newComment) {
            setCommentsByTab((prev) => {
                const updated = { ...prev }
                for (const key in updated) {
                    updated[key] = updated[key].map((c) =>
                        c.comment_id === newComment.parentCommentId
                            ? {
                                  ...c,
                                  replies: [...(c.replies || []), newComment.reply],
                                  reply_ids: [...(c.reply_ids || []), newComment.reply.comment_id],
                              }
                            : c,
                    )
                }
                return updated
            })
        } else {
            const commentWithMeta = {
                ...newComment,
                tab: tabs,
                cluster: clusterId || null,
                reply_ids: [],
                replies: [],
            }

            setCommentsByTab((prev) => {
                const updated = { ...prev }
                tabs?.forEach((t) => {
                    updated[t] = [commentWithMeta, ...(updated[t] || [])]
                })
                return updated
            })
        }
    }

    const sortedComments = useMemo(() => {
        const base = [...comments]
        return sortKey === 'latest'
            ? base.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            : base.sort((a, b) => (b.reactions?.[sortKey] || 0) - (a.reactions?.[sortKey] || 0))
    }, [comments, sortKey])

    const filteredCommentsWithReplies = useMemo(() => {
        const base = comments.filter((comment) => {
            const hasReplies = comment.replies && comment.replies.length > 0
            return onlyWithReplies ? hasReplies : true
        })
        return sortKey === 'latest'
            ? base.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            : base.sort((a, b) => (b.reactions?.[sortKey] || 0) - (a.reactions?.[sortKey] || 0))
    }, [comments, sortKey, onlyWithReplies])

    const filteredCommentsByCluster = useMemo(() => {
        if (!selectedClusterId) return []

        const shouldInclude = (manipulated: boolean) =>
            onlyWithNonManipulated ? !manipulated : true

        const filtered = comments
            .filter(
                (comment) =>
                    comment.cluster === selectedClusterId && shouldInclude(comment.manipulated),
            )
            .map((comment) => {
                const replies =
                    comment.replies?.filter((reply) => shouldInclude(reply.manipulated)) || []
                return {
                    ...comment,
                    replies,
                }
            })

        const sorted =
            sortKey === 'latest'
                ? filtered.sort(
                      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
                  )
                : filtered.sort(
                      (a, b) => (b.reactions?.[sortKey] || 0) - (a.reactions?.[sortKey] || 0),
                  )

        return sorted
    }, [selectedClusterId, onlyWithNonManipulated, sortKey, comments])

    const graphData = useMemo(() => {
        if (!selectedClusterId) return []
        const filteredOpinionComments = comments.filter(
            (comment) =>
                comment.tab?.includes('opinion') &&
                comment.cluster === selectedClusterId &&
                (!onlyWithNonManipulated || !comment.manipulated),
        )
        const raw = drawGraph(filteredOpinionComments, selectedClusterId, onlyWithNonManipulated)
        return raw.x.map((unix, i) => ({
            time: new Date(unix).toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            }),
            count: raw.y[i],
        }))
    }, [selectedClusterId, onlyWithNonManipulated, comments])

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload?.length) {
            return (
                <div className='bg-white border border-zinc-300 rounded-md px-3 py-2 text-xs shadow-md'>
                    <p>{label}</p>
                    <p>댓글 수: {payload[0].value}</p>
                </div>
            )
        }
        return null
    }

    return (
        <main className='flex flex-col gap-10 items-center justify-center'>
            {/* Video Section */}
            <div className='w-full flex flex-col gap-2 mt-5'>
                <div className='w-full aspect-video rounded-xl overflow-hidden'>
                    <iframe
                        width='100%'
                        height='100%'
                        src={`https://www.youtube.com/embed/${video.id}`}
                        title={video.title}
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                        allowFullScreen
                        className='w-full h-full rounded-xl'
                    ></iframe>
                </div>
                <p className='text-xl font-bold mt-2 text-zinc-950'>{video.title}</p>
                <p className='text-base text-zinc-500'>{video.date}</p>
            </div>

            {/* Comment Write Section */}
            <CommentWriteForm
                key={TEST_USER.id}
                user={TEST_USER}
                commentType='댓글'
                onAddComment={handleAddComment}
            />

            {/* Tab Section */}
            <Tab tab={tab} setTab={setTab} />

            {/* Comments Section */}
            {tab === 'information' && (
                <>
                    <div className='w-full flex justify-between items-center'>
                        <span className='text-base font-semibold'>
                            정보성 댓글 {sortedComments.length}개
                        </span>
                        <SortBox sortKey={sortKey} setSortKey={setSortKey} />
                    </div>
                    <div className='flex flex-col gap-7 w-full'>
                        {sortedComments.length === 0 && <CommentNone />}
                        {sortedComments.length > 0 &&
                            sortedComments.map((comment) => (
                                <Comment
                                    key={comment.comment_id}
                                    comment={comment}
                                    repliesData={comment.replies || []}
                                    onAddComment={handleAddComment}
                                />
                            ))}
                    </div>
                </>
            )}

            {tab === 'opinion' && (
                <>
                    <div className='w-full flex justify-between items-center'>
                        <div className='flex flex-col gap-1'>
                            <span className='text-base font-semibold'>
                                의견 클러스터 {CLUSTERS.length}개
                            </span>
                            <span className='text-zinc-500 text-sm'>
                                편향 방지를 위해 AI가 유사한 의견들을 모아서 무작위로 보여드려요.
                            </span>
                        </div>
                        <Filter
                            label='조작 댓글 필터링 켜기'
                            filterValue={onlyWithNonManipulated}
                            setFilterValue={setOnlyWithNonManipulated}
                        />
                    </div>
                    <div className='flex flex-col gap-5 w-full'>
                        {CLUSTERS.length === 0 && <CommentNone />}
                        {CLUSTERS.length > 0 &&
                            CLUSTERS.map((cluster) => (
                                <ClusterBox
                                    key={cluster.id}
                                    cluster={cluster}
                                    isManipulationFilter={onlyWithNonManipulated}
                                    onClick={() => setSelectedClusterId(cluster.id)}
                                    comments={comments}
                                />
                            ))}
                    </div>

                    <Drawer open={!!selectedClusterId} onClose={() => setSelectedClusterId(null)}>
                        <div className='flex flex-col gap-5 w-full'>
                            {/* Cluster Selection */}
                            <div className='flex items-center gap-3'>
                                {CLUSTERS.map((cluster) => (
                                    <button
                                        key={cluster.id}
                                        className={`px-4 py-2 rounded-lg text-base font-medium ${
                                            selectedClusterId === cluster.id
                                                ? 'bg-[#4F46E5] text-white'
                                                : 'border-[#4F46E5] border text-[#4F46E5]'
                                        }`}
                                        onClick={() => setSelectedClusterId(cluster.id)}
                                    >
                                        {cluster.name}
                                    </button>
                                ))}
                            </div>

                            {/* Graph */}
                            <div className='w-full h-64 bg-gray-100 rounded-lg mb-5'>
                                {graphData.length > 0 ? (
                                    <ResponsiveContainer width='100%' height='100%'>
                                        <LineChart
                                            data={graphData}
                                            margin={{ top: 5, right: 10, left: 0, bottom: 30 }}
                                        >
                                            <CartesianGrid strokeDasharray='3 3' />
                                            <XAxis dataKey='time' hide tick={{ fontSize: 10 }} />
                                            <YAxis
                                                allowDecimals={false}
                                                width={40}
                                                tick={{ fontSize: 10 }}
                                            />
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
                                    <div className='w-full h-full flex items-center justify-center'>
                                        <p className='text-gray-500'>아직 댓글이 없습니다.</p>
                                    </div>
                                )}
                            </div>

                            {/* Cluster Information */}
                            <div className='w-full flex justify-between items-center'>
                                <span className='text-base font-semibold'>
                                    의견 {filteredCommentsByCluster.length}개
                                </span>
                                <div className='flex items-center gap-4'>
                                    <Filter
                                        label='조작 댓글 필터링 켜기'
                                        filterValue={onlyWithNonManipulated}
                                        setFilterValue={setOnlyWithNonManipulated}
                                    />
                                    <SortBox sortKey={sortKey} setSortKey={setSortKey} />
                                </div>
                            </div>

                            {/* Comments in Cluster */}
                            {filteredCommentsByCluster.length === 0 && <CommentNone />}
                            {filteredCommentsByCluster.map((c) => (
                                <Comment
                                    key={c.comment_id}
                                    comment={c}
                                    repliesData={'replies' in c ? c.replies || [] : []}
                                    onAddComment={handleAddComment}
                                />
                            ))}
                        </div>
                    </Drawer>
                </>
            )}

            {tab === 'question' && (
                <>
                    <div className='w-full flex justify-between items-center'>
                        <span className='text-base font-semibold'>
                            질문 {filteredCommentsWithReplies.length}개
                        </span>
                        <div className='flex items-center gap-4'>
                            <Filter
                                label='대댓글 달린 댓글만 보기'
                                filterValue={onlyWithReplies}
                                setFilterValue={setOnlyWithReplies}
                            />
                            <SortBox sortKey={sortKey} setSortKey={setSortKey} />
                        </div>
                    </div>
                    <div className='flex flex-col gap-7 w-full'>
                        {filteredCommentsWithReplies.length === 0 && <CommentNone />}
                        {filteredCommentsWithReplies.length > 0 &&
                            filteredCommentsWithReplies.map((comment) => (
                                <Comment
                                    key={comment.comment_id}
                                    comment={comment}
                                    repliesData={comment.replies || []}
                                    onAddComment={handleAddComment}
                                />
                            ))}
                    </div>
                </>
            )}
        </main>
    )
}

export default Detail
