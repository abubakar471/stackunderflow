import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import ROUTES from '@/constants/routes';

const Home = async () => {
  const session = await auth();

  console.log('session: ', session);

  return (
    <main>
      <div>wow is that working lets check</div>

      <form
        action={async () => {
          'use server';
          await signOut({
            redirectTo: ROUTES.SIGN_IN,
          });
        }}
        className='px-10 pt-25'
      >
        <Button type='submit'>Log out</Button>
      </form>

      <div>username : {session?.user?.name}</div>
    </main>
  );
};

export default Home;
