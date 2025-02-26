"use client"
import Avatar from '@/app/components/Avatar'
import EmptyState from '@/app/components/EmptyState'
import LinkComponent from '@/app/components/LinkComponent'
import Logo from '@/app/components/Logo'
import { getSocialLinks, getUserInfo } from '@/app/server'
import { SocialLink } from '@prisma/client'
import { LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const page = ({ params }: { params: Promise<{ pseudo: string }> }) => {
    const [pseudo, setPseudo] = useState<string | null | undefined>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [links, setLinks] = useState<SocialLink[]>([])
    const [theme, setTheme] = useState<string | null | undefined>(null)


    const resolveParamsAndFetchData = async () => {
        try {
            const resolvedParams = await params;
            setPseudo(resolvedParams.pseudo)
            const userInfo = await getUserInfo(resolvedParams.pseudo)
            if (userInfo) {
                setTheme(userInfo.theme)
                document.documentElement.setAttribute("data-theme", userInfo.theme || "cmyk")
            }
            const fetchedLinks = await getSocialLinks(resolvedParams.pseudo)
            if (fetchedLinks) {
                setLinks(fetchedLinks)
            }
            setLoading(false)
        } catch (error) {
            toast.error("Cette page n'existe pas")
            setLoading(false)
        }
    }


    useEffect(() => {
        resolveParamsAndFetchData();
    }, [params]);

    return (
        <div className='p-8'>
            <div className='flex flex-col items-center space-y-4 '>
                <div className='w-full md:w-1/3 flex flex-col items-center '>
                    <Logo />
                    {pseudo && (
                        <div className='space-y-4 mt-4'>
                            <Avatar pseudo={pseudo} />
                            <div className='flex space-x-4'>
                                <Link
                                    href="/sign-up"
                                    className='btn btn-sm '
                                >
                                    <UserPlus className='w-4 h-4' />
                                    <span>Créer votre page</span>
                                </Link>
                                <Link
                                    href="/sign-in"
                                    className='btn btn-sm '
                                >
                                    <LogIn className='w-4 h-4' />
                                    <span>Gérer vos liens</span>
                                </Link>
                            </div>
                            <div className=''>

                                {loading ? (
                                    <div className="my-30 flex justify-center items-center w-full">
                                        <span className="loading loading-spinner loading-lg text-accent"></span>
                                    </div>
                                ) : links.length > 0 ? (
                                    <div className='"w-full space-y-2'>
                                        {links.map((link) => (
                                            <LinkComponent
                                                key={link.id}
                                                socialLink={link}
                                                readonly={true}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex justify-normalcenter items-center w-full">
                                        <EmptyState IconComponent={"Cable"} message={" Aucun lien disponible"} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </div>


        </div>
    )
}

export default page
