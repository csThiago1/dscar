module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@": "./src",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@services": "./src/services",
            "@stores": "./src/stores",
            "@utils": "./src/utils",
            "@db": "./src/db",
            "@api": "./src/api",
            "@config": "./src/config",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
