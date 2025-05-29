import React, { useState, useRef } from 'react'
import AuthPopover from './authPopover'
import Toast from './toast'
import Loader from './loader'
import type { UserType } from '../types/users'
import { checkHateAndTabCluster } from '../utils/checkHateAndTabCluster'

type CommentWriteFormProps = {
    user: UserType
    commentType: string // 예: '댓글', '대댓글'
    parentCommentId?: string // 대댓글 작성 시 필요
    onAddComment?: (newComment: any, tabs?: string[], clusterId?: string | null) => void
    onSuccessWithMessage?: (message: string) => void
}

const TABS: Record<string, string> = {
    information: '정보',
    opinion: '의견',
    question: '질문',
}

const CLUSTERS: Record<string, string> = {
    cluster_A: '개혁안 찬성',
    cluster_B: '개혁안 반대',
    cluster_C: '중립',
    cluster_D: '구조적 문제',
    cluster_E: '전 정권과 전교조',
}

const CommentWriteForm: React.FC<CommentWriteFormProps> = ({
    user,
    commentType,
    parentCommentId,
    onAddComment,
    onSuccessWithMessage,
}) => {
    const isUser: boolean = localStorage.getItem('isUser') === 'true'
    const [text, setText] = useState('')
    const [showAuthPopover, setShowAuthPopover] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const [toast, setToast] = useState<{
        type: 'success' | 'failure'
        message: string
        errorDetail?: string
    } | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!isUser) {
            setShowAuthPopover(true)
            return
        }
        setText(e.target.value)
    }

    const handleSubmit = async () => {
        if (text.trim() === '') {
            setToast({
                type: 'failure',
                message: '댓글 내용을 작성해주세요.',
            })
            setTimeout(() => setToast(null), 1500)
            return
        }

        if (parentCommentId && onAddComment) {
            // 대댓글 작성 시
            const newComment = {
                comment_id: Date.now().toString() + Math.random().toString(36).substring(2, 15),
                author_id: user.id,
                author_name: user.name,
                author_profile_image: user.profile_image,
                timestamp: new Date().toISOString(),
                content: text,
                reactions: {
                    useful: 0,
                    agree: 0,
                    curious: 0,
                    creative: 0,
                    disagree: 0,
                },
                time_taken_to_write: Math.floor(Math.random() * 200) + 1, // 1초에서 200초 사이의 랜덤 시간
                manipulated: false,
            }

            onAddComment({ parentCommentId, reply: newComment })

            if (onSuccessWithMessage) {
                onSuccessWithMessage('대댓글이 등록되었습니다.')
            }
            setText('')
            return
        } else if (onAddComment) {
            // 상위 댓글 작성 시
            setIsLoading(true)
            setLoadingMessage(
                `${user.name} 님의 ${text.slice(0, 10)}... 댓글을 AI가 분석하고 있습니다. 잠시만 기다려주세요.`,
            )
            const hateAndTabClusterResult: [string, string[], string | null] | ['error'] =
                await checkHateAndTabCluster(text)

            setIsLoading(false)
            setLoadingMessage('')

            if (hateAndTabClusterResult[0] === 'hate') {
                setToast({
                    type: 'failure',
                    message: '악성 댓글로 감지되어 등록이 제한됩니다.',
                    errorDetail: '부적절한 내용을 제거 후 다시 시도해주세요.',
                })
                setTimeout(() => setToast(null), 2000)
                setText('')
                return
            } else if (hateAndTabClusterResult[0] === 'error') {
                setToast({
                    type: 'failure',
                    message: '댓글 등록 중 오류가 발생했습니다.',
                    errorDetail: '서버와의 통신에 실패했습니다. 잠시 후 다시 시도해주세요.',
                })
                setTimeout(() => setToast(null), 2000)
                return
            } else if (hateAndTabClusterResult[1] && hateAndTabClusterResult[1].length === 0) {
                setToast({
                    type: 'failure',
                    message: '너무 짧거나 관계 없는 댓글입니다.',
                    errorDetail: '댓글을 더 구체적으로 작성해주세요.',
                })
                setTimeout(() => setToast(null), 2000)
                setText('')
                return
            }

            // 'none-hate': tab, cluster
            const newComment = {
                comment_id: Date.now().toString() + Math.random().toString(36).substring(2, 15),
                author_id: user.id,
                author_name: user.name,
                author_profile_image: user.profile_image,
                timestamp: new Date().toISOString(),
                content: text,
                reactions: {
                    useful: 0,
                    agree: 0,
                    curious: 0,
                    creative: 0,
                    disagree: 0,
                },
                time_taken_to_write: Math.floor(Math.random() * 200) + 1, // 1초에서 200초 사이의 랜덤 시간
                manipulated: false,
                tab: hateAndTabClusterResult[1],
                cluster: hateAndTabClusterResult[2] || null,
            }

            onAddComment(
                { ...newComment, reply_ids: [], replies: [] },
                hateAndTabClusterResult[1] || [],
                hateAndTabClusterResult[2] || null,
            )

            const tabLabels = (hateAndTabClusterResult[1] || [])
                .map((tab) => {
                    if (tab === 'opinion' && hateAndTabClusterResult[2]) {
                        return `의견(${CLUSTERS[hateAndTabClusterResult[2]]})`
                    }
                    return TABS[tab]
                })
                .join(', ')

            setToast({
                type: 'success',
                message: `댓글이 ${tabLabels} 탭에 등록되었습니다.`,
            })
            setTimeout(() => setToast(null), 1500)
            setText('')
        }
    }

    const isActive = text.trim().length > 0

    return (
        <div className='relative flex items-start gap-5 w-full' ref={containerRef}>
            <img
                src={user.profile_image}
                alt='User'
                className='w-10 h-10 rounded-full object-cover'
            />

            <div className='relative flex-1 bg-zinc-100 rounded-md px-4 py-3 h-[100px]'>
                <textarea
                    value={text}
                    onChange={handleChange}
                    placeholder={
                        isUser
                            ? `${user.name} 님의 ${commentType}을 남겨보세요!`
                            : '댓글을 작성하려면 로그인이 필요해요.'
                    }
                    className='w-[92%] h-full resize-none bg-transparent hidescroll focus:outline-none text-base text-black placeholder-zinc-500'
                />
                <button
                    onClick={handleSubmit}
                    disabled={!isActive}
                    className={`absolute bottom-3 right-3 px-4 py-2 rounded-md text-sm font-semibold transition 
                        ${
                            isActive
                                ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                                : 'bg-[#C7D2FE] text-white opacity-50 cursor-default'
                        }`}
                >
                    등록
                </button>
            </div>

            {/* Auth Popover */}
            {showAuthPopover && (
                <AuthPopover
                    type='login'
                    message='댓글을 작성하려면 '
                    onCancel={() => setShowAuthPopover(false)}
                />
            )}

            {/* Toast Notification */}
            {toast && (
                <Toast type={toast.type} message={toast.message} errorDetail={toast.errorDetail} />
            )}

            {/* Loading Indicator */}
            {isLoading && (
                <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10'>
                    <Loader loadingMessage={loadingMessage} />
                </div>
            )}
            <div className='absolute inset-0 bg-transparent pointer-events-none' />
        </div>
    )
}

export default CommentWriteForm
