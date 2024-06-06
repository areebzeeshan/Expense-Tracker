"use client"
import { Button } from '@/components/ui/button'
import { useUser, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Header = () => {

    const { user, isSignedIn } = useUser()

    return (
        <div className='p-5 flex justify-between items-center shadow-sm'>
            <Image
                src={'./logo.svg'}
                width={160}
                height={100}
                alt='logo'
            />
            {isSignedIn ?
                <UserButton /> :
                <Link href={'/dashboard'}>
                    <Button>Get started</Button>
                </Link>
            }
        </div>
    )
}

export default Header