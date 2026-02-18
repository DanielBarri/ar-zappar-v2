module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    path: false,
  };

  config.ignoreWarnings = [/Failed to parse source map/];

  return config;
};
