import QuestionCard from '@/components/cards/QuestionCard';
import HomeFilter from '@/components/filters/HomeFilter';
import LocalSearch from '@/components/search/LocalSearch';
import { Button } from '@/components/ui/button';
import ROUTES from '@/constants/routes';
import Link from 'next/link';

const questions = [
  {
    _id: '1',
    title: 'How to learn React?',
    description: 'I want to learn React JS, what is the best way to learn?',
    tags: [
      {
        _id: '1',
        name: 'React',
      },
      {
        _id: '2',
        name: 'JavaScript',
      },
    ],
    author: {
      _id: '1',
      name: 'John Doe',
      image : 'https://static1.personalitydatabase.net/2/pdb-images-prod/6f9ac7d4/profile_images/94feb725f56844778996862922587c56.png'
    },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date(),
  },
  {
    _id: '2',
    title: 'How to learn JavaScript?',
    description: 'I want to learn JS, what is the best way to learn?',
    tags: [
      {
        _id: '2',
        name: 'JavaScript',
      },
      {
        _id: '2',
        name: 'JS',
      },
    ],
    author: {
      _id: '1',
      name: 'John Doe',
      image : 'https://static1.personalitydatabase.net/2/pdb-images-prod/6f9ac7d4/profile_images/94feb725f56844778996862922587c56.png'
    },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date(),
  },
];

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
  const { query = '', filter = '' } = await searchParams;

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title.toLowerCase().includes(query.toLowerCase());

    const matchesFilter = filter
      ? question.tags[0].name.toLowerCase() === filter.toLowerCase()
      : true;

    return matchesQuery && matchesFilter;
  });

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

      <HomeFilter />

      <div className='mt-10 flex w-full flex-col gap-6'>
        {filteredQuestions.map((question) => (
          <QuestionCard
            key={question._id}
            question={question}
          />
        ))}
      </div>
    </>
  );
};

export default Home;
