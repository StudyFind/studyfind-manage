module.exports = {
  presets: ["@babel/preset-env"],
  plugins: [
    ["@babel/transform-runtime"],
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          admin: "./src/admin",
          utils: "./src/utils",
        },
      },
    ],
  ],
};
