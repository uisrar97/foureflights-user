# Requirements:

## Node Version
### 17.4.0

## React-PDF/Renderer
React-PDF/Renderer workaround for **Webpack 5**: <br/>

Execute "npm install".<br/>
Navigate to **node_modules/react-scripts/config/webpack.config.js** and place the following code 
in the relevent objects:
<br /><br />
```js
module.exports = {
  /* ... */
  resolve: {
    fallback: {
      process: require.resolve("process/browser"),
      zlib: require.resolve("browserify-zlib"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util"),
      buffer: require.resolve("buffer"),
      assert: require.resolve("assert"),
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ]
  /* ... */
}
```