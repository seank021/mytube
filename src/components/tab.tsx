import React from 'react'

const Tab: React.FC<{
    tab: string | null
    setTab: (tab: string) => void
}> = ({ tab, setTab }) => {
    const tabs = [
        { key: 'information', label: '정보' },
        { key: 'opinion', label: '의견' },
        { key: 'question', label: '질문' },
    ]

    return (
        <div className='flex items-center self-start gap-2 border border-zinc-200 rounded-md p-1 bg-white'>
            {tabs.map((t) => {
                const isActive = tab === t.key
                return (
                    <button
                        key={t.key}
                        className={`px-10 py-[6px] text-base font-semibold rounded-md transition-all duration-200 ${
                            isActive
                                ? 'bg-[#4F46E5] text-white shadow-md'
                                : 'text-[#64748B] hover:bg-zinc-100'
                        }`}
                        onClick={() => setTab(t.key)}
                    >
                        {t.label}
                    </button>
                )
            })}
        </div>
    )
}

export default Tab
