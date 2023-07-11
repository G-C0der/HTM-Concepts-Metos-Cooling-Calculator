class ContextProviderError extends Error {
  constructor(providerName: string, fnName: string) {
    super(`${fnName}: ${providerName} is not set up. Wrap the app with an ${providerName}.`);
  }
}

export {
  ContextProviderError
};