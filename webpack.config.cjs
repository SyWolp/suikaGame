const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: "./src/main.js", // 진입점(entry point) 설정
  output: {
    path: path.resolve(__dirname, "dist"), // 번들된 파일의 출력 경로
    filename: "bundle.js", // 번들된 파일의 이름
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"), // 개발 서버의 루트 디렉토리
    },
    port: 8080, // 포트 번호
    hot: true, // 핫 모듈 리로딩 활성화
    open: true, // 개발 서버 실행 시 브라우저 자동으로 열기
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html", // 여기서 index.html 경로를 지정해줘야 함
    }),
  ],
};
