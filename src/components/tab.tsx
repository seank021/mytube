import React, { useEffect } from 'react'

const Tab: React.FC<{
    tab: string | null
    setTab: (tab: string) => void
}> = ({ tab, setTab }) => {
    const tabs = [
        { key: 'information', label: '정보' },
        { key: 'opinion', label: '의견' },
        { key: 'question', label: '질문' },
    ]

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // 입력창에 focus 중이면 Tab 이동 막지 않음
            const active = document.activeElement
            if (
                active &&
                (active.tagName === 'INPUT' ||
                    active.tagName === 'TEXTAREA' ||
                    active.getAttribute('contenteditable') === 'true')
            ) {
                return
            }

            if (e.key === 'Tab') {
                e.preventDefault() // 기본 탭 이동 막기
                const currentIndex = tabs.findIndex((t) => t.key === tab)
                const nextIndex = (currentIndex + 1) % tabs.length
                setTab(tabs[nextIndex].key)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [tab, setTab])

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
