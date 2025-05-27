export type ClusterType = {
    id: string // 클러스터 ID ex. cluster_A
    name: string // 클러스터 이름 ex. 개혁안 찬성
    description: string // 클러스터 설명 ex. 자유전공 확대, 수능 다회 등 긍정 반응 중심
    tags?: string[] // 클러스터 태그 ex. ['찬성', '긍정', '자유전공']
}
