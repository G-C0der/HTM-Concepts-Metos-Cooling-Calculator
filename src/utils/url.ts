const toAbsoluteUrl = (url: string) => {
  return url.startsWith('http://') || url.startsWith('https://')
    ? url
    : `http://${url}`;
};

export {
  toAbsoluteUrl
};