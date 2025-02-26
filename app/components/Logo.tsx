import { Cable } from 'lucide-react'
import React, { FC } from 'react'

interface LogoProps {
    theme ? : string
}

const Logo: FC<LogoProps> = ({theme}) => {
    return (
        <div className='flex items-center bg-transparent' data-theme={`${theme}` || 'cmyk'}>
            <div className=''>
                <Cable className="w-6 h-6 text-primary mr-2" />
            </div>
            <div className='text-xl font-bold'>
                Linkify
            </div>
        </div>
    )
}

export default Logo
