export const getWriteTime = (writeTime: number): string => {
    const minutes = Math.floor(writeTime / 60)
    const seconds = writeTime % 60

    if (minutes === 0) return `${seconds}초 소요`
    if (seconds === 0) return `${minutes}분 소요`
    return `${minutes}분 ${seconds}초 소요`
}
