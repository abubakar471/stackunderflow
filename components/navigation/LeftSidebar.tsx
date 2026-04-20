import React from 'react';
import NavLinks from './navbar/NavLinks';
import Link from 'next/link';
import ROUTES from '@/constants/routes';
import Image from 'next/image';

const LeftSidebar = () => {
  return (
    <section className='custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 h-screen flex flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]'>
      <div className='flex flex-1 flex-col gap-6'>
        <NavLinks isMobileNav={false} />
      </div>

      <div className='flex flex-col gap-3'>
        <Link href={ROUTES.SIGN_IN}>
          <p className='small-medium btn-secondary min-h-10.25 w-full rounded-lg px-4 py-3 shadow-none text-center'>
            <Image
              src='/icons/account.svg'
              alt='Account'
              width={20}
              height={20}
              className='invert-colors lg:hidden'
            />
            <span className='primary-text-gradient max-lg:hidden'>Sign in</span>
          </p>
        </Link>

        <Link href={ROUTES.SIGN_UP}>
          <p className='small-medium light-border-2 text-dark400_light900 btn-tertiary min-h-10.25 w-full rounded-lg px-4 py-3 shadow-none text-center'>
            <Image
              src='/icons/sign-up.svg'
              alt='Account'
              width={20}
              height={20}
              className='invert-colors lg:hidden'
            />
            <span className='primary-text-gradient max-lg:hidden'>Sign up</span>
          </p>
        </Link>
      </div>
    </section>
  );
};

export default LeftSidebar;
