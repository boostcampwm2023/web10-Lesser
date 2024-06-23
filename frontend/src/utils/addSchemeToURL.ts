const addSchemeToURL = (url: string) => {
  const splitWithScheme = url.split("://");

  if (splitWithScheme.length === 1) {
    return `https://${url}`;
  }

  if (splitWithScheme[0] === "") {
    return `https${url}`;
  }

  return url;
};

export default addSchemeToURL;
