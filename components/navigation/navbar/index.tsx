import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Theme from './Theme';
import MobileNavigation from './MobileNavigation';
import { auth } from '@/auth';
import UserAvatar from '@/components/ui/user-avatar';

const Navbar = async () => {
  const session = await auth();

  return (
    <nav className='flex-between background-dark400_light900 fixed z-50 w-full gap-5 p-6 sm:px-12 shadow-light-300 dark:shadow-none'>
      <Link
        href='/'
        className='flex items-center gap-1'
      >
        <Image
          src='/images/site-logo.svg'
          width={23}
          height={23}
          alt='Stackunderflow'
        />

        <p className='h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden'>
          Stack<span className='text-primary'>Underflow</span>
        </p>
      </Link>

      <p>Global Search</p>

      <div className='flex-between gap-5'>
        <Theme />
        {
          session?.user?.id && (
            <UserAvatar
              id={session?.user?.id}
              name={session?.user?.name || ''}
              email={session?.user?.email || ''}
              imageUrl={session?.user?.image || ''}
            />
          )
        }
        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Navbar;
