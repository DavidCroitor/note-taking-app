module.exports = ({ config }) => {
  const appVariant = process.env.APP_VARIANT;

  let packageName = "com.personal.notesapp";
  let appName = "Hand Notes";

  if (appVariant === "development") {
    packageName = "com.personal.notesapp.dev";
    appName = "Hand Notes (Dev)";
  }

  return {
    ...config,
    name: appName,
    android: {
      ...config.android,
      package: packageName,
    },
    ios: {
      ...config.ios,
      bundleIdentifier: packageName,
    },
  };
};
