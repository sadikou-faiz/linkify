"use server"

import prisma from "@/lib/prisma";
import { SocialLink } from "@prisma/client";

async function generateUniquePseudo(base: string) {
    let pseudo = base
    let count = 1
    while (await prisma.user.findUnique({ where: { pseudo } })) {
        pseudo = `${base}${count}`
        count++
    }
    return pseudo
}

export async function checkAndAddUser(email: string, name: string) {
    if (!email) return
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })
        if (!existingUser && name) {
            const basePseudo = name.toLowerCase().replace(/\s+/g, "_")
            const pseudo = await generateUniquePseudo(basePseudo)

            await prisma.user.create({
                data: { email, name, pseudo }
            })
        }
    } catch (error) {
        console.error(error);
    }
}

export async function getUserInfo(identifier: string) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: identifier }, { pseudo: identifier }]
            },
            select: { pseudo: true, theme: true }
        })

        return {
            pseudo: user?.pseudo,
            theme: user?.theme
        }
    } catch (error) {
        console.error(error)
    }
}

export async function addSocialLink(email: string, title: string, url: string, pseudo: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            throw new Error("Utilisateur non trouvé.");
        }

        return await prisma.socialLink.create({
            data: {
                userId: user?.id,
                title,
                url,
                pseudo
            }
        })
    } catch (error) {
        console.error(error)
    }
}

export async function getSocialLinks(identifier: string) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: identifier }, { pseudo: identifier }]
            }
        })

        if (!user) {
            throw new Error("Utilisateur non trouvé.");
        }

        const isEmail = identifier.includes("@")

        let socialLink: SocialLink[] = []

        if (isEmail) {
            socialLink = await prisma.socialLink.findMany({
                where: { userId: user.id }
            })
        } else {
            socialLink = await prisma.socialLink.findMany({
                where: {
                    userId: user.id,
                    active: true,
                }
            })
        }

        return socialLink

    } catch (error) {
        console.error(error)
    }
}

export async function toggleSocialLinkActive(linkId: string) {
    try {
        const socialLink = await prisma.socialLink.findUnique({
            where: { id: linkId }
        })

        if (!socialLink) {
            throw new Error("Lien social non trouvé.");
        }

        const updatedLink = await prisma.socialLink.update({
            where: { id: linkId },
            data: { active: !socialLink.active }
        })

    } catch (error) {
        console.error(error)
    }
}

export async function updateSocialLink(linkId: string, data: { title?: string, url?: string, pseudo?: string }) {
    if (!linkId) {
        throw new Error("L'ID du lien est requis.");
    }
    try {
        const updatedLink = await prisma.socialLink.update({
            where: { id: linkId },
            data
        })

        return updatedLink
    } catch (error) {
        console.error(error)
    }
}

export async function removeSocialLink(email: string, linkId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            throw new Error("Utilisateur non trouvé.");
        }

        const socialLink = await prisma.socialLink.findUnique({
            where: { id: linkId }
        })

        if (!socialLink) {
            throw new Error("Lien non trouvé.");
        }
        if (socialLink.userId != user.id) {
            throw new Error("Vous n'avez pas la permission de supprimer ce lien.");
        }

        await prisma.socialLink.delete({
            where: { id: linkId }
        })
    } catch (error) {
        console.error(error)
    }
}

export async function incrementClickCount(linkId: string) {
    try {
        const updatedLink = await prisma.socialLink.update({
            where: { id: linkId },
            data: { clicks: { increment: 1 } }
        })
        return updatedLink
    } catch (error) {
        console.error(error)
    }
}

export async function updateUserTheme(email: string, newTheme: string) {
    try {
        await prisma.user.update({
            where: { email },
            data: { theme: newTheme }
        })
    } catch (error) {
        console.error(error)
    }
}