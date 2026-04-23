import queryString from 'query-string';

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove : string[];
}

// update url with new value
export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = queryString.parse(params);

  currentUrl[key] = value;

  return queryString.stringifyUrl({
    url: window.location.pathname,
    query: currentUrl,
  });
};

// remove key from current query string
export const removeKeysFromQuery = ({ params, keysToRemove }: RemoveUrlQueryParams) => {
  const currentUrl = queryString.parse(params);

  keysToRemove.forEach((key) =>{
    delete currentUrl[key];
  })

  return queryString.stringifyUrl({
    url: window.location.pathname,
    query: currentUrl,
  },{
    skipNull : true
  });
};