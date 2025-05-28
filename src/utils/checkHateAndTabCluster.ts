const API_URL = 'https://hci-aiml.onrender.com/classify'

export const checkHateAndTabCluster = async (
    text: string,
): Promise<[string, string[], string | null] | ['error']> => {
    try {
        // const response = await fetch(API_URL, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ comment: text }),
        // })

        // const result = await response.json()

        // const hate = result?.hate
        // const tabCluster = result?.tab_cluster

        // console.log('hate:', hate)
        // console.log('tab_cluster:', tabCluster)

        return ['non-hate', ['information', 'opinion'], 'cluster_B']

        // if (label === 'hate' || label === 'non-hate') {
        //     return label
        // } else {
        //     console.error('예상치 못한 응답 형식:', result)
        //     return 'error'
        // }
    } catch (err) {
        console.error('API 호출 중 오류:', err)
        return ['error']
    }
}
