interface SignInWithAuthParams {
  user: {
    email: string;
    name: string;
    username: string;
    image: string;
  };
  provider: "github" | "google";
  providerAccountId: string;
}

interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}

interface GetQuestionsParams {
  questionId: string;
}
