export const getTimeAgo = (timestamp: string): string => {
    const now = new Date()
    const past = new Date(timestamp)
    const diffMs = now.getTime() - past.getTime()

    const minutes = Math.floor(diffMs / (1000 * 60))
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30))
    const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365))

    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 30) return `${days}일 전`
    if (months < 12) return `${months}개월 전`
    return `${years}년 전`
}
