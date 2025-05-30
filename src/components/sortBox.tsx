import React, { useState } from 'react'

type SortKey = 'useful' | 'agree' | 'curious' | 'creative' | 'disagree' | 'latest'

interface SortBoxProps {
    sortKey: SortKey
    setSortKey: React.Dispatch<React.SetStateAction<SortKey>>
}

const sortOptions = [
    { key: 'useful', label: '유익해요', icon: '/icons/star.svg' },
    { key: 'agree', label: '공감해요', icon: '/icons/heart.svg' },
    { key: 'curious', label: '더 알고싶어요', icon: '/icons/question.svg' },
    { key: 'creative', label: '독창적이에요', icon: '/icons/light.svg' },
    { key: 'disagree', label: '반대예요', icon: '/icons/anger.svg' },
    { key: 'latest', label: '최신순', icon: '/icons/time.svg' },
]

const SortBox: React.FC<SortBoxProps> = ({ sortKey, setSortKey }) => {
    const [open, setOpen] = useState(false)
    const selectedLabel = sortOptions.find((o) => o.key === sortKey)?.label ?? ''

    return (
        <div className='relative inline-block text-left w-[180px]'>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className='flex justify-between items-center w-full px-4 py-[6px] border border-zinc-200 rounded-md bg-white text-sm shadow-sm hover:bg-zinc-50'
            >
                <div className='flex items-center gap-2'>
                    <img
                        src={sortOptions.find((o) => o.key === sortKey)?.icon}
                        alt={selectedLabel}
                        className='w-4 h-4'
                    />
                    <span className='text-sm text-zinc-950'>{selectedLabel}</span>
                </div>
                <img src='/icons/chevronDown.svg' alt='chevron down' className='w-4 h-4' />
            </button>

            {open && (
                <ul className='absolute mt-1 w-full bg-white border border-zinc-200 rounded-md shadow-lg z-50'>
                    {sortOptions.map((option) => (
                        <li
                            key={option.key}
                            className={`px-4 py-[6px] text-sm cursor-pointer hover:bg-zinc-100 flex justify-between items-center ${
                                sortKey === option.key ? 'bg-zinc-100 font-medium' : ''
                            }`}
                            onClick={() => {
                                setSortKey(option.key as SortKey)
                                setOpen(false)
                            }}
                        >
                            <div className='flex items-center gap-2'>
                                <img src={option.icon} alt={option.label} className='w-4 h-4' />
                                <span className='text-sm text-zinc-950'>{option.label}</span>
                            </div>
                            {sortKey === option.key && (
                                <img src='/icons/check.svg' alt='check' className='w-4 h-4' />
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default SortBox
