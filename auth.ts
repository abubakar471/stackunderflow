import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import ROUTES from './constants/routes';
import { api } from './lib/api';
import { ActionResponse } from './types/global';
import { IAccountDoc } from './database/account.model';

// we will check if the sign-in account type is credentials; if yes, then we skip, we'll handle it the other way around when doing email password based authentication.

// but if the account type is not credentials, we'll call this new 'sign-in-with-oauth' API route, which will handle the sign-in process for OAuth providers like GitHub and Google. This way, we can keep our authentication logic organized and separate for different types of providers.

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  pages: {
    signIn: ROUTES.SIGN_IN,
  },
  // the callbacks are for handling the sign-in process for OAuth providers. When a user tries to sign in with an OAuth provider, we want to redirect them to our custom API route that will handle the authentication logic for that provider. This way, we can keep our authentication logic organized and separate for different types of providers.
  callbacks : {
    async session({session, token}){
      session.user.id = token.sub as string;

      return session;
    },
    async jwt({token, account}){
      if(account) {
        const {data : existingAccount, success} = (await api.accounts.getByProvider(account.type === 'credentials' ? token.email! : account.providerAccountId)) as ActionResponse<IAccountDoc>;

        if(!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        if(userId) token.sub = userId.toString(); 
      }

       return token;
    },
    async signIn({user, profile, account}) {
      if(account?.type == 'credentials'){
        return true;
      }

      if(!account || !user) return false;

      const userInfo = {
        name : user.name!,
        email : user.email!,
        image : user.image!,
        username : account.provider === 'github' ?( profile?.login as string) : (user.name?.toLowerCase() as string),
      }

      const{success} = (await api.auth.oAuthSignin({user : userInfo, provider : account.provider as 'github' | 'google', providerAccountId : account.providerAccountId})) as ActionResponse;

      if(!success) return false;

      return true;
    }
  }
});
