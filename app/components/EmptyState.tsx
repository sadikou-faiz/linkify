import { icons } from 'lucide-react'
import React, { FC } from 'react'

interface EmptyStateProps {
    IconComponent: keyof typeof icons
    message: string
}

const EmptyState: FC<EmptyStateProps> = ({ IconComponent, message }) => {
    const SelectedIcons = icons[IconComponent]
    return (
        <div className='my-36 w-full h-full flex justify-center items-center flex-col'>
            <div className='wiggle-animation'>
                <SelectedIcons strokeWidth={1} className='w-20 h-20 text-accent' />
            </div>
            <p className='text-sm'>{message}</p>
        </div>
    )
}

export default EmptyState
