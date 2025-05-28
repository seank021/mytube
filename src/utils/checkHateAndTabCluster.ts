const API_URL = 'https://hci-aiml.onrender.com/classify'

export const checkHateAndTabCluster = async (
    text: string,
): Promise<[string, string[], string | null] | ['error']> => {
    try {
        console.log('checkHateAndTabCluster called with text:', text)

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comment: text }),
        })

        const result = await response.json()

        console.log('API response:', result)

        const hate = result?.hate.label
        const tab = result?.tab_cluster.tab
        const cluster = result?.tab_cluster.cluster

        if ('opinion' in tab && cluster === null) {
            return [hate, tab, 'cluster_C'] // 중립으로 처리
        }

        return [hate, tab, cluster || null]
    } catch (err) {
        console.error('API 호출 중 오류:', err)
        return ['error']
    }
}
