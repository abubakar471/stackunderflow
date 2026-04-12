'use client';

import React from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import ROUTES from '@/constants/routes';
import { useRouter } from 'next/navigation';

const SocialAuthForm = () => {
  const buttonClass =
    'background-dark400_light900 body-medium text-dark200_light800 rounded-2 min-h-12 flex-1 px-4 py-3.5';

  const router = useRouter();

  const handleSignIn = async (provider: 'github' | 'google') => {
    try {
      const res = await signIn(provider, {
        callbackUrl: ROUTES.HOME,
        redirect: false,
      });

      if (res.url) {
        router.push(res.url);
      } else {
        throw new Error('Sign in Failed');
      }
    } catch (error) {
      console.log(error);

      toast.error('Sign in Failed', {
        description: error instanceof Error ? error.message : 'An error occured during sign in',
      });
    }
  };

  return (
    <div className='mt-10 flex flex-wrap gap-2.5'>
      <Button
        className={buttonClass}
        onClick={() => handleSignIn('github')}
      >
        <Image
          src='/icons/github.svg'
          alt='Github Sign in'
          width={20}
          height={20}
          className='invert-colors mr-2.5 object-contain'
        />

        <span>Log in with GitHub</span>
      </Button>

      <Button
        className={buttonClass}
        onClick={() => handleSignIn('google')}
      >
        <Image
          src='/icons/google.svg'
          alt='Google Sign in'
          width={20}
          height={20}
          className='mr-2.5 object-contain'
        />

        <span>Log in with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
