import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import Drawer from '../../../components/drawer'
import Filter from '../../../components/filter'
import SortBox from '../../../components/sortBox'
import Comment from '../../../components/comment'
import CommentNone from '../../../components/commentNone'
import type { ClusterType } from '../../../types/clusters'
import type { CommentsDataType } from '../../../types/comments'

type SortKey = 'useful' | 'agree' | 'curious' | 'creative' | 'disagree' | 'latest'

type DrawerClusterProps = {
    selectedClusterId: string | null
    setSelectedClusterId: (id: string | null) => void
    clusters: ClusterType[]
    graphData: { time: string; count: number }[]
    comments: CommentsDataType
    onlyWithNonManipulated: boolean
    setOnlyWithNonManipulated: (value: boolean) => void
    sortKey: SortKey
    setSortKey: React.Dispatch<React.SetStateAction<SortKey>>
    handleAddComment: (newComment: any, tabs?: string[]) => void
}

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

const DrawCluster: React.FC<DrawerClusterProps> = ({
    selectedClusterId,
    setSelectedClusterId,
    clusters,
    comments,
    graphData,
    onlyWithNonManipulated,
    setOnlyWithNonManipulated,
    sortKey,
    setSortKey,
    handleAddComment,
}) => {
    return (
        <>
            <Drawer open={!!selectedClusterId} onClose={() => setSelectedClusterId(null)}>
                <div className='flex flex-col gap-5 w-full'>
                    <div className='flex items-center sticky top-0 z-10 bg-white h-[80px]'>
                        {/* Cluster Selection */}
                        <div className='flex items-center gap-3 flex-wrap'>
                            {clusters.map((cluster) => (
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
                    <div className='sticky top-[80px] z-10 bg-white pb-5 border-b border-zinc-200'>
                        <div className='w-full flex justify-between items-center'>
                            <span className='text-base font-semibold'>
                                의견 {comments.length}개
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
                    </div>

                    {/* Comments in Cluster */}
                    {comments.length === 0 && <CommentNone />}
                    {comments.map((c) => (
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
    )
}

export default DrawCluster
