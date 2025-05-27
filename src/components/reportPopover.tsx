import React, { useState } from 'react'

const REPORT_REASONS: string[] = [
    '부정확한 정보',
    '부적절한 표현',
    '편향된 내용',
    '잘못된 카테고리',
    '기타',
]

const ReportPopover: React.FC<{
    onCancel: () => void
    onSubmit: (reason: string) => void
}> = ({ onCancel, onSubmit }) => {
    const [selected, setSelected] = useState('')

    return (
        <div className='flex flex-col bg-white rounded-xl shadow-lg border px-6 py-4 w-[320px] gap-3'>
            <h3 className='text-base font-medium text-zinc-950'>신고</h3>
            <div className='flex flex-wrap gap-2'>
                {REPORT_REASONS.map((reason) => (
                    <button
                        key={reason}
                        onClick={() => setSelected(reason)}
                        className={`px-2 py-1 rounded-lg border text-sm transition ${
                            selected === reason
                                ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                                : 'bg-white border-zinc-200 hover:bg-zinc-100'
                        }`}
                    >
                        {reason}
                    </button>
                ))}
            </div>
            <div className='flex justify-end gap-4'>
                <button className='text-[#4F46E5] text-sm font-medium' onClick={onCancel}>
                    취소
                </button>
                <button
                    disabled={!selected}
                    className={`text-sm font-medium px-4 py-1 rounded-md transition ${
                        selected
                            ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                            : 'bg-[#C7D2FE] text-white opacity-50'
                    }`}
                    onClick={() => onSubmit(selected)}
                >
                    결정
                </button>
            </div>
        </div>
    )
}

export default ReportPopover
