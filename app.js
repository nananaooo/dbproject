const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3123;
const cors = require('cors');

app.use(cors());

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: 'localhost', // MySQL 호스트 이름
  user: 'root', // MySQL 사용자 이름
  password: 'password!', // MySQL 암호
  database: 'cars' // 연결할 MySQL 데이터베이스 이름
});

fuel_prices = {
  '디젤': 1500,
  '가솔린': 1700
};

// MySQL 연결
connection.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패: ' + err.stack);
    return;
  }
  
  console.log('MySQL 연결 ID: ' + connection.threadId);
});

app.get('/recommend', (req, res) => {
  // 클라이언트가 보낸 파라미터 가져오기
  const { price, month_budget, km} = req.query;

  // 각 파라미터가 주어졌는지 확인
  if (!price || !month_budget || !km) {
      return res.status(400).json({ error: 'Missing parameters' });
  }


  const selectCarsQuery = `
    SELECT company, name, price, type, fuel, cc, efficiency, tax, oil_price,
           (oil_price * ${km} / efficiency + tax) as expense,
    (
      ABS((price - ${price}) / stddev_price) +
      ABS((oil_price * ${km} / efficiency + tax - ${month_budget}) / stddev_expense)
    ) / 2 as score
    FROM cars
    CROSS JOIN 
        (SELECT 
            STDDEV_SAMP(price) as stddev_price, 
            STDDEV_SAMP(oil_price * ${km} / efficiency + tax) as stddev_expense
        FROM cars) AS stats
    ORDER BY score
    LIMIT 10;
  `

  connection.query(selectCarsQuery, (err, results) => {
    if (err) {
      console.error('데이터 조회 실패:', err);
      return;
    }
    console.log('조회된 데이터:', results);
    res.json({results});
  });
    
  // 클라이언트에게 결과 보내기
});

// 다른 경로에 대한 GET 요청 처리
app.get('/hello', (req, res) => {
  res.send('안녕하세요!');
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
