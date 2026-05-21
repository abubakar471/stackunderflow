interface SignInWithAuthParams{
    user: {
        email: string;
        name: string;
        image: string;
    };
    provider: 'github' | 'google';
    providerAccountId: string;
}