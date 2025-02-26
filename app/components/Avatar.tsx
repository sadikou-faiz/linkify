import React from 'react'

interface AvatarProps {
    pseudo: string
}

const Avatar: React.FC<AvatarProps> = ({ pseudo }) => {
    const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${pseudo}`
    return (
        <div className='flex flex-col items-center'>
            <div className="avatar">
                <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
                    <img src={avatarUrl} alt={pseudo} />
                </div>
            </div>
            <p className='mt-4 font-bold'>
                @{pseudo}
            </p>
        </div>
    )
}

export default Avatar
