import React from 'react'
import CommentNone from '../../../components/commentNone'
import ClusterBox from '../../../components/clusterBox'
import type { CommentsDataType } from '../../../types/comments'
import type { ClusterType } from '../../../types/clusters'

type ClusterProps = {
    clusters: ClusterType[]
    filterValue: boolean
    onClickCluster: (cluster: string) => void
    comments: CommentsDataType
}

const Cluster: React.FC<ClusterProps> = ({ clusters, filterValue, onClickCluster, comments }) => {
    return (
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
    )
}

export default Cluster
