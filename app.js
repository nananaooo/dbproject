const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: 'localhost', // MySQL 호스트 이름
  user: 'minjae', // MySQL 사용자 이름
  password: 'jbnu', // MySQL 암호
  database: 'dbname' // 연결할 MySQL 데이터베이스 이름
});

// MySQL 연결
connection.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패: ' + err.stack);
    return;
  }
  
  console.log('MySQL 연결 ID: ' + connection.threadId);
});

// 루트 경로에 대한 GET 요청 처리
app.get('/', (req, res) => {
  // MySQL에서 데이터 조회 예제
  connection.query('SELECT * FROM cars', (error, results, fields) => {
    if (error) {
      res.status(500).send('데이터 조회 실패');
      throw error;
    }
    
    // 조회 결과를 클라이언트에게 응답
    res.send(results);
  });
});
app.get('/recommend', (req, res) => {
  // 클라이언트가 보낸 파라미터 가져오기
  const { price, month_budget, km } = req.query;

  // 각 파라미터가 주어졌는지 확인
  if (!price || !month_budget || !km) {
      return res.status(400).json({ error: 'Missing parameters' });
  }

  // 각 파라미터를 숫자로 변환하여 더하기
  const totalValue = parseInt(price) + parseInt(month_budget) + parseInt(km);
    
  // 클라이언트에게 결과 보내기
  res.json({ totalValue });
});

// 다른 경로에 대한 GET 요청 처리
app.get('/hello', (req, res) => {
  res.send('안녕하세요!');
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
