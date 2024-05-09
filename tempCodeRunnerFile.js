const express = require('express');
const app = express();
const port = 3000;

// 루트 경로에 대한 GET 요청 처리
app.get('/', (req, res) => {
  res.send('안녕하세요! 이것은 Node.js HTTP 서버입니다.');
});

// 다른 경로에 대한 GET 요청 처리
app.get('/hello', (req, res) => {
  res.send('안녕하세요!');
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
