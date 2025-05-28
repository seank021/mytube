import React, { useState } from 'react'
import ReportPopover from './reportPopover'
import Toast from './toast'
import AuthPopover from './authPopover'
import { getWriteTime } from '../utils/getWriteTime'
import { getTimeAgo } from '../utils/getTimeAgo'
import type { CommentType, ReplyType } from '../types/comments'
import CommentWriteForm from './commentWriteForm'
import { TEST_USER } from '../data/users/test'

type Reaction = {
    key: string
    label: string
    iconSrc: string
    initialCount: number
    colorClass: string
    selectedColorClass: string
}

type CommentProps = {
    comment: CommentType
    repliesData: ReplyType[]
    isReply?: boolean
}

const Comment: React.FC<CommentProps> = ({ comment, repliesData, isReply = false }) => {
    const [showReplies, setShowReplies] = useState(false)
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [showReport, setShowReport] = useState(false)
    const [toast, setToast] = useState<{
        type: 'success' | 'failure'
        message: string
        errorDetail?: string
    } | null>(null)
    const isUser: boolean = localStorage.getItem('isUser') === 'true'
    const [showAuthPopoverReaction, setShowAuthPopoverReaction] = useState(false)
    const [showAuthPopoverReport, setShowAuthPopoverReport] = useState(false)

    const defaultReactions: Reaction[] = [
        {
            key: 'useful',
            label: '유익해요',
            iconSrc: '/icons/star.svg',
            initialCount: comment.reactions?.useful || 0,
            colorClass: 'text-black-600 border-zinc-200',
            selectedColorClass: 'text-[#337CED] bg-[#E8F2FF] border-[#337CED] border-1',
        },
        {
            key: 'empathy',
            label: '공감해요',
            iconSrc: '/icons/heart.svg',
            initialCount: comment.reactions?.agree || 0,
            colorClass: 'text-black-600 border-zinc-200',
            selectedColorClass: 'text-[#337CED] bg-[#E8F2FF] border-[#337CED] border-1',
        },
        {
            key: 'curious',
            label: '더 알고싶어요',
            iconSrc: '/icons/question.svg',
            initialCount: comment.reactions?.curious || 0,
            colorClass: 'text-black-600 border-zinc-200',
            selectedColorClass: 'text-[#337CED] bg-[#E8F2FF] border-[#337CED] border-1',
        },
        {
            key: 'original',
            label: '독창적이에요',
            iconSrc: '/icons/light.svg',
            initialCount: comment.reactions?.creative || 0,
            colorClass: 'text-black-600 border-zinc-200',
            selectedColorClass: 'text-[#337CED] bg-[#E8F2FF] border-[#337CED] border-1',
        },
        {
            key: 'disagree',
            label: '반대예요',
            iconSrc: '/icons/anger.svg',
            initialCount: comment.reactions?.disagree || 0,
            colorClass: 'text-black-600 border-zinc-200',
            selectedColorClass: 'text-[#337CED] bg-[#E8F2FF] border-[#337CED] border-1',
        },
    ]

    const [reactions, setReactions] = useState(
        defaultReactions.map((r) => ({ ...r, count: r.initialCount, selected: false })),
    )

    const toggleReaction = (index: number) => {
        if (!isUser) {
            setShowAuthPopoverReaction(true)
            return
        }
        setReactions((prev) =>
            prev.map((r, i) =>
                i === index
                    ? {
                          ...r,
                          selected: !r.selected,
                          count: r.selected ? r.count - 1 : r.count + 1,
                      }
                    : r,
            ),
        )
    }

    const onClickReport = (e: React.MouseEvent<HTMLImageElement>) => {
        e.stopPropagation()
        if (!isUser) {
            setShowAuthPopoverReport(true)
            return
        }
        setShowReport((prev) => !prev)
    }

    const handleReportSubmit = (reason: string, commentID: string) => {
        console.log(`신고 사유: ${reason}, 댓글 ID: ${commentID}`)
        setShowReport(false)
        setToast({ type: 'success', message: '신고가 성공적으로 이루어졌습니다.' })
        setTimeout(() => setToast(null), 1500)
    }

    const handleReportCancel = () => {
        setShowReport(false)
    }

    return (
        <div className='flex flex-col w-full'>
            <div className='flex justify-between items-start w-full'>
                {/* Profile Image & Content */}
                <div className='flex gap-4 items-start w-full max-w-[85%]'>
                    <img
                        src={comment.author_profile_image || '/icons/profile.svg'}
                        alt='Profile'
                        className='w-10 h-10 rounded-full object-cover'
                        onError={(e) => {
                            const target = e.currentTarget
                            if (target.src !== window.location.origin + '/icons/profile.svg') {
                                target.src = '/icons/profile.svg'
                            }
                        }}
                    />

                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-4'>
                            <span className='text-base font-semibold'>{comment.author_name}</span>
                            <div className='flex items-center gap-1'>
                                <img src='/icons/write.svg' alt='Time Taken' className='w-3 h-3' />
                                <span className='text-zinc-500 text-sm font-regular'>
                                    {getWriteTime(comment.time_taken_to_write) || '알 수 없음'}
                                </span>
                            </div>
                        </div>
                        <p className='text-base text-black whitespace-pre-line'>
                            {comment.content}
                        </p>

                        {/* Reactions */}
                        <div className='flex flex-wrap gap-2 mt-1'>
                            {reactions.map((r, i) => (
                                <button
                                    key={r.key}
                                    onClick={() => toggleReaction(i)}
                                    className={`flex items-center gap-1 border rounded-md px-[3px] py-[2px] transition w-fit ${
                                        r.selected ? `${r.selectedColorClass}` : r.colorClass
                                    }`}
                                >
                                    <img src={r.iconSrc} alt={r.label} className='w-4 h-4' />
                                    <span className='font-regular text-[13px]'>{r.label}</span>
                                    <span className='font-regular text-[13px]'>({r.count})</span>
                                </button>
                            ))}
                        </div>

                        {/* Reply toggle */}
                        {!isReply && comment.reply_ids && comment.reply_ids.length > 0 ? (
                            <div
                                className='mt-2 text-sm text-gray-600 cursor-pointer select-none'
                                onClick={() => setShowReplies(!showReplies)}
                            >
                                {showReplies ? (
                                    <div className='flex flex-row gap-1 items-center'>
                                        <img
                                            src='/icons/chevronUp.svg'
                                            alt='Hide Replies'
                                            className='w-6 h-6'
                                        />
                                        <span className='font-regular text-sm text-zinc-900'>
                                            대댓글 ({comment.reply_ids.length})
                                        </span>
                                    </div>
                                ) : (
                                    <div className='flex flex-row gap-1 items-center'>
                                        <img
                                            src='/icons/chevronDown.svg'
                                            alt='Show Replies'
                                            className='w-6 h-6'
                                        />
                                        <span className='font-regular text-sm text-zinc-900'>
                                            대댓글 ({comment.reply_ids.length})
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            !isReply && (
                                <div
                                    className='mt-2 text-sm text-gray-600 cursor-pointer select-none flex items-center gap-2 w-fit'
                                    onClick={() => setShowReplyForm((prev) => !prev)}
                                >
                                    <img
                                        src='/icons/curvedArrow.svg'
                                        alt='Reply'
                                        className='w-5 h-4'
                                    />
                                    <span className='text-sm text-zinc-900 font-medium mt-1'>
                                        답글 쓰기
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Report button and Time Ago */}
                <div className='flex items-center gap-3 min-w-[70px] relative'>
                    <img
                        src={showReport ? '/icons/reportSelected.svg' : '/icons/report.svg'}
                        alt='Report'
                        className='w-6 h-6 cursor-pointer'
                        onClick={onClickReport}
                    />
                    <span className='text-sm text-zinc-500'>
                        {getTimeAgo(comment.timestamp) || '알 수 없음'}
                    </span>

                    {/* Report Popover */}
                    {showReport && (
                        <div className='absolute top-[28px] right-[60px] z-50'>
                            <ReportPopover
                                onSubmit={(reason) =>
                                    handleReportSubmit(reason, comment.comment_id)
                                }
                                onCancel={handleReportCancel}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Reply Comments */}
            {showReplies && comment.reply_ids && comment.reply_ids.length > 0 && (
                <div className='flex flex-col gap-7 mt-5 ml-[60px]'>
                    {repliesData?.map((reply) => (
                        <Comment
                            key={reply.comment_id}
                            comment={reply}
                            repliesData={[]}
                            isReply={true}
                        />
                    ))}
                    <CommentWriteForm key={TEST_USER.id} user={TEST_USER} commentType='대댓글' />
                </div>
            )}

            {/* Reply form if no reply exists */}
            {!isReply &&
                showReplyForm &&
                (!comment.reply_ids || comment.reply_ids.length === 0) && (
                    <div className='mt-5 ml-[60px]'>
                        <CommentWriteForm
                            key={TEST_USER.id}
                            user={TEST_USER}
                            commentType='대댓글'
                        />
                    </div>
                )}

            {/* Toast Notification */}
            {toast && (
                <Toast type={toast.type} message={toast.message} errorDetail={toast.errorDetail} />
            )}

            {/* Auth Popover - Reaction */}
            {showAuthPopoverReaction && (
                <AuthPopover
                    type='login'
                    message='공감하려면 '
                    onCancel={() => setShowAuthPopoverReaction(false)}
                />
            )}

            {/* Auth Popover - Report */}
            {showAuthPopoverReport && (
                <AuthPopover
                    type='login'
                    message='신고하려면 '
                    onCancel={() => setShowAuthPopoverReport(false)}
                />
            )}
        </div>
    )
}

export default Comment
