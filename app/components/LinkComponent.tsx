import { SocialLink } from '@prisma/client'
import { ChartColumnIncreasing, Pencil, Trash } from 'lucide-react'
import Link from 'next/link'
import React, { FC, useState } from 'react'
import { SocialIcon } from 'react-social-icons'
import { incrementClickCount, toggleSocialLinkActive, updateSocialLink } from '../server'
import { toast } from 'react-toastify'
import socialLinksData from '../socialLinksData'


interface LinkComponentProps {
    socialLink: SocialLink
    onRemove?: (id: string) => void
    readonly?: boolean
    fetchLinks?: () => void
}

const truncateLink = (url: string, maxLength = 20) => {
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
};


const LinkComponent: FC<LinkComponentProps> = ({ socialLink, onRemove, readonly, fetchLinks }) => {
    const [isActive, setIsActive] = useState(socialLink.active)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        title: socialLink.title,
        url: socialLink.url,
        pseudo: socialLink.pseudo
    })
    const [clicks, setClicks] = useState(socialLink.clicks || 0)

    const handleToggleActive = async () => {
        try {
            await toggleSocialLinkActive(socialLink.id)
            setIsActive(!isActive)
            fetchLinks?.()
            toast.success("c'est fait")
        } catch (error) {
            console.error(error)
        }
    }

    const handleUpdateLink = async () => {
        try {
            const selectedtitle = socialLinksData.find(l => l.name === formData.title);
            if (selectedtitle?.root && selectedtitle.altRoot) {
                if (!formData.url.startsWith(selectedtitle.root) && !formData.url.startsWith(selectedtitle.altRoot)) {
                    toast.info(`L'URL doit commencer par ${selectedtitle.root} ou par ${selectedtitle.altRoot} `)
                    return
                }
            }
            await updateSocialLink(socialLink.id, formData)
            setIsEditing(false)
            fetchLinks?.()
            toast.success("C'est mis à jour")
        } catch (error) {
            console.error(error)
        }
    }

    const handleIncrementClick = async () => {
        try {
            await incrementClickCount(socialLink.id)
            setClicks(clicks + 1)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            {readonly ? (
                <div className='flex flex-col bg-base-200 p-6 rounded-3xl w-full'>
                    <span className='badge mb-2'>@{socialLink.pseudo}</span>
                    <div className='flex justify-between'>
                        <div className='flex items-center gap-2'>
                            <SocialIcon
                                url={socialLink.url}
                                style={{ width: 30, height: 30 }}
                                onClick={handleIncrementClick}
                            />
                            <span className='badge badge-primary'>{socialLink.title}</span>
                        </div>
                        <Link
                            className="btn btn-sm btn-accent"
                            href={socialLink.url}
                            target='_blank'
                            onClick={handleIncrementClick}
                        >
                            Ouvrir le lien
                        </Link>
                    </div>

                </div>
            ) : (
                <div className='flex flex-col space-y-2 w-full bg-base-200 p-6 rounded-3xl'>
                    <div className='flex items-center justify-between'>
                        <span className='badge'>@{socialLink.pseudo}</span>
                        <input
                            type="checkbox"
                            className="toggle toggle-sm"
                            checked={isActive}
                            onChange={handleToggleActive}
                        />
                    </div>


                    {isEditing ? (
                        <div className='flex flex-col space-y-2'>
                            <select
                                className="select select-bordered"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            >
                                {socialLinksData.map(({ name }) => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="Entrez le pseudo social"
                                className="input input-bordered w-full"
                                value={formData.pseudo}
                                onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
                            />

                            <input
                                type="text"
                                placeholder="Entrez l'URL"
                                className="input input-bordered w-full"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            />

                            <div className='flex space-x-2'>
                                <button
                                    className="btn btn-accent btn-sm"
                                    onClick={handleUpdateLink}
                                >
                                    Sauvegarder
                                </button>
                                <button
                                    className="btn btn-accent btn-sm"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    ) : (

                        <>
                            <div className='flex items-center gap-2'>
                                <SocialIcon url={socialLink.url} style={{ width: 30, height: 30 }} />
                                <span className='badge badge-primary'>{socialLink.title}</span>
                                <Link className='link md:hidden' href={socialLink.url}>{truncateLink(socialLink.url)}</Link>
                                <Link className='link hidden md:flex' href={socialLink.url}>{socialLink.url} </Link>
                            </div>
                            <div className='flex justify-between'>
                                <div className='flex items-center'>
                                    <ChartColumnIncreasing className='w-4 h-4' strokeWidth={1} />
                                    <span className='ml-2'>{clicks} clics</span>
                                </div>
                                <div>
                                    <button
                                        className='btn btn-sm btn-ghost'
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <Pencil className='w-4 h-4' strokeWidth={1} />
                                    </button>
                                    <button
                                        className='btn btn-sm btn-ghost'
                                        onClick={() => onRemove?.(socialLink.id)}
                                    >
                                        <Trash className='w-4 h-4' strokeWidth={1} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )
                    }

                </div >
            )}
        </div >
    )
}

export default LinkComponent
