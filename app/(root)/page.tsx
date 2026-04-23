import LocalSearch from '@/components/search/LocalSearch';
import { Button } from '@/components/ui/button';
import ROUTES from '@/constants/routes';
import Link from 'next/link';

const Home = async () => {
  return (
    <>
      <section className='flex flex-col-reverse w-full sm:flex-row justify-between gap-4 sm:items-center'>
        <h1 className='h1-bold text-dark100_light900'>All Questions</h1>

        <Button className='primary-gradient min-h-11.5 px-4 py-3 text-light-900!'>
          <Link href={ROUTES.ASK_QUESTION}> Ask a Question</Link>
        </Button>
      </section>
      <section className='mt-11'>
        <LocalSearch
          imgSrc='/icons/search.svg'
          placeholder='Search Questions...'
          otherClasses='flex-1'
          route='/'
        />
      </section>
      Home filters
      <div className='mt-10 flex w-full flex-col gap-6'>
        <p>Question card 1</p>
      </div>
    </>
  );
};

export default Home;
