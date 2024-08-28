const isValidURL = (url: string) => {
  const pattern = new RegExp(
    "^((?:http|https)://)" +
      "(?:\\S+(?::\\S*)?@)?" +
      "(?:(?:" +
      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
      "(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
      "|" +
      "(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)" +
      "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*" +
      "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
      ")|" +
      "localhost" +
      ")" +
      "(?::\\d{2,5})?" +
      "(?:(/|\\?|#)[^\\s]*)?$",
    "i"
  );

  return pattern.test(url);
};

export default isValidURL;
