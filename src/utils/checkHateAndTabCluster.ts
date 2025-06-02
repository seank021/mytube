const isDEV = true
const API_URL = isDEV ? 'http://127.0.0.1:3000/classify' : 'https://hci-aiml.onrender.com/classify'
const useDummy = true

export const checkHateAndTabCluster = async (
    text: string,
): Promise<[string, string[], string | null] | ['error']> => {
    if (useDummy) {
        console.log('Using dummy data for checkHateAndTabCluster')
        return ['none-hate', ['information', 'opinion', 'question'], 'cluster_A'] // 임시로 하드코딩
    }

    try {
        // console.log('checkHateAndTabCluster called with text:', text)

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comment: text }),
        })

        const result = await response.json()
        // console.log('API response:', result)

        const hate = result?.hate.label
        const tab = result?.tab_cluster.tab
        const cluster = result?.tab_cluster.cluster

        // tab에 opinion이 있는데, 클러스터 배정이 안 된 경우: 중립으로 처리
        if (tab && tab.includes('opinion') && !cluster) {
            return [hate, tab, 'cluster_C']
        }

        return [hate, tab, cluster || null]
    } catch (err) {
        console.error('API 호출 중 오류:', err)
        return ['error']
    }
}
