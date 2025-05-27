import React from 'react'

interface FilterProps {
    label: string
    filterValue: boolean
    setFilterValue: (value: boolean) => void
}

const Filter: React.FC<FilterProps> = ({ label, filterValue, setFilterValue }) => {
    return (
        <label className='flex items-center gap-2 cursor-pointer select-none'>
            <div
                className={`w-11 h-6 flex items-center px-[2px] rounded-full transition-colors duration-200 ${
                    filterValue ? 'bg-[#4F46E5]' : 'bg-zinc-300'
                }`}
                onClick={() => setFilterValue(!filterValue)}
            >
                <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        filterValue ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </div>
            <span className='text-[13px] text-zinc-950'>{label}</span>
        </label>
    )
}

export default Filter
