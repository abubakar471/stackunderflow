const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  QUESTION : (id : string) => `/question/${id}`,
  ASK_QUESTION : '/ask-a-question',
  PROFILE: (id: string) => `/profile/${id}`,
  TAGS: (id: string) => `/tags/${id}`,
  SIGN_IN_WITH_OAUTH : `sign-in-with-oauth`,
};

export default ROUTES;
