import React from 'react'
import { VIDEOS } from '../data/videos/videos'
import type { VideoType } from '../types/videos'

const Home: React.FC = () => {
    const onClickVideo = (videoId: string) => {
        window.location.href = `/detail/${videoId}?tab=information`
    }

    return (
        <main className='flex flex-col gap-7 mt-10 flex-1 home'>
            <div className='flex gap-3 items-center'>
                <img src='/icons/trending.svg' alt='Trending' className='w-6 h-6' />
                <h2 className='text-2xl font-semibold text-zinc-800'>
                    지금 사람들이 많이 보는 영상
                </h2>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                {VIDEOS.map((video: VideoType) => (
                    <div key={video.id} className='flex flex-col gap-1'>
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className='w-full h-40 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity'
                            onClick={() => onClickVideo(video.id)}
                        />
                        <p
                            className='text-base font-medium truncate mt-1 cursor-pointer'
                            onClick={() => onClickVideo(video.id)}
                        >
                            {video.title}
                        </p>
                        <p className='text-sm text-zinc-500'>{video.date}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Home
