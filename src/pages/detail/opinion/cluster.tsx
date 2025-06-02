import React from 'react'
import CommentNone from '../../../components/commentNone'
import ClusterBox from '../../../components/clusterBox'
import Filter from '../../../components/filter'
import type { CommentsDataType } from '../../../types/comments'
import type { ClusterType } from '../../../types/clusters'

type ClusterProps = {
    clusters: ClusterType[]
    filterValue: boolean
    setFilterValue: (value: boolean) => void
    onClickCluster: (cluster: string) => void
    comments: CommentsDataType
}

const Cluster: React.FC<ClusterProps> = ({
    clusters,
    filterValue,
    setFilterValue,
    onClickCluster,
    comments,
}) => {
    return (
        <>
            <div className='w-full flex justify-between items-center'>
                <div className='flex flex-col gap-1'>
                    <span className='text-base font-semibold'>
                        의견 클러스터 {clusters.length}개
                    </span>
                    <span className='text-zinc-500 text-sm'>
                        편향 방지를 위해 AI가 유사한 의견들을 모아서 무작위로 보여드려요.
                    </span>
                </div>
                <Filter
                    label='조작 댓글 필터링 켜기'
                    filterValue={filterValue}
                    setFilterValue={setFilterValue}
                />
            </div>
            <div className='flex flex-col gap-5 w-full'>
                {clusters.length === 0 && <CommentNone />}
                {clusters.length > 0 &&
                    clusters.map((cluster) => (
                        <ClusterBox
                            key={cluster.id}
                            cluster={cluster}
                            isManipulationFilter={filterValue}
                            onClick={() => onClickCluster(cluster.id)}
                            comments={comments}
                        />
                    ))}
            </div>
        </>
    )
}

export default Cluster
