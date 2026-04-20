import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ROUTES from '@/constants/routes';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import NavLinks from './NavLinks';

const MobileNavigation = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Image
          src='/icons/hamburger.svg'
          alt='menu'
          width={36}
          height={36}
          className='invert-colors sm:hidden'
        />
      </SheetTrigger>
      <SheetContent
        side='left'
        className='background-light900_dark200 border-none px-4 py-6'
      >
        {/*<SheetTitle>Menu</SheetTitle>*/}
        <Link
          href='/'
          className='flex items-center gap-1'
        >
          <Image
            src='/images/site-logo.svg'
            width={23}
            height={23}
            alt='Logo'
          />

          <p className='h2-bold font-space-grotesk text-dark-100 dark:text-light-900'>
            Stack<span className='text-primary-500'>UnderFlow</span>
          </p>
        </Link>

        <div className='no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto'>
          <SheetClose>
            <section className='flex h-full flex-col gap-6 pt-16'>
              <NavLinks isMobileNav={true} />
            </section>
          </SheetClose>

          <div className='flex flex-col gap-3'>
            <SheetClose>
              <Link href={ROUTES.SIGN_IN}>
                <p className='small-medium btn-secondary min-h-10.25 w-full rounded-lg px-4 py-3 shadow-none'>
                  <span className='primary-text-gradient'>Sign in</span>
                </p>
              </Link>
            </SheetClose>

            <SheetClose>
              <Link href={ROUTES.SIGN_UP}>
                <p className='small-medium light-border-2 text-dark400_light900 btn-tertiary min-h-10.25 w-full rounded-lg px-4 py-3 shadow-none'>
                  <span className='primary-text-gradient'>Sign up</span>
                </p>
              </Link>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
