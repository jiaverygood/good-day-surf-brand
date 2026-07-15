// 토스페이먼츠 결제 승인. 시크릿 키는 여기(서버)에서만 쓰고 클라이언트로 절대 내려주지 않는다.
var quote = require('./quote');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  var secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    res.status(500).json({ error: '결제 서버 설정이 완료되지 않았습니다 (TOSS_SECRET_KEY 미설정).' });
    return;
  }

  var body = req.body || {};
  var paymentKey = body.paymentKey;
  var orderId = body.orderId;
  var amount = Number(body.amount);
  var type = body.type;
  var headcount = body.headcount;

  if (!paymentKey || !orderId || !amount || !quote.LESSON_PRICES_IDR[type]) {
    res.status(400).json({ error: '필수 결제 정보가 없습니다.' });
    return;
  }

  try {
    // 클라이언트가 보낸 금액이 조작되지 않았는지, 방금 견적낸 환율/레슨 종류/인원 기준 금액과 비교해 검증한다.
    var rate = await quote.fetchRate();
    var expected = quote.computeAmountKRW(type, headcount, rate);
    var diffRatio = Math.abs(amount - expected) / expected;
    if (diffRatio > 0.1) {
      res.status(400).json({ error: '결제 금액이 올바르지 않습니다.' });
      return;
    }

    var authHeader = 'Basic ' + Buffer.from(secretKey + ':').toString('base64');
    var tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentKey: paymentKey, orderId: orderId, amount: amount })
    });
    var tossData = await tossRes.json();

    if (!tossRes.ok) {
      res.status(tossRes.status).json({ error: tossData.message || '결제 승인 실패' });
      return;
    }

    res.status(200).json({ success: true, payment: tossData });
  } catch (err) {
    res.status(500).json({ error: '결제 승인 중 오류가 발생했습니다.' });
  }
};
