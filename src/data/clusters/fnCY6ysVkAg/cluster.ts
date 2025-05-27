import type { ClusterType } from '../../../types/clusters'

export const CLUSTERS: ClusterType[] = [
    {
        id: 'cluster_A',
        name: '개혁안에 찬성합니다',
        description: '자유전공 확대, 수능 다회 등 긍정 반응 중심',
        tags: ['긍정적', '#찬성', '#자유전공학부', '#부담 완화'],
    },
    {
        id: 'cluster_B',
        name: '개혁안에 반대합니다',
        description: '시행 현실성, 부담 증가 등 부정 시각 중심',
        tags: ['부정적', '#반대', '#비용 증가', '#근본적 원인'],
    },
    {
        id: 'cluster_C',
        name: '중립이에요',
        description: '단편적, 질문 섞인 의견 중심',
        tags: ['중립적', '#단편적', '#질문'],
    },
    {
        id: 'cluster_D',
        name: '구조적인 문제',
        description: '제도 전반에 대한 깊은 분석 및 비판',
        tags: ['중립적', '#구조적 제안', '#분석적'],
    },
    {
        id: 'cluster_E',
        name: '전 정권과 전교조',
        description: '전 정권·전교조 중심의 반말, 강한 어투',
        tags: ['부정적', '#정치적 비판', '#무능함'],
    },
]
