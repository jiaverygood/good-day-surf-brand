// 오늘자 IDR→KRW 환율로 레슨 가격(Rp 300,000)을 원화로 환산해 돌려준다.
var LESSON_PRICE_IDR = 300000;

async function fetchRate() {
  var res = await fetch('https://open.er-api.com/v6/latest/IDR');
  var data = await res.json();
  if (data.result !== 'success' || !data.rates || !data.rates.KRW) {
    throw new Error('rate fetch failed');
  }
  return data.rates.KRW;
}

module.exports = async function handler(req, res) {
  try {
    var rate = await fetchRate();
    var amountKRW = Math.round((LESSON_PRICE_IDR * rate) / 100) * 100;
    res.status(200).json({
      lessonPriceIDR: LESSON_PRICE_IDR,
      rate: rate,
      amountKRW: amountKRW,
      fetchedAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: '환율 정보를 가져오지 못했습니다.' });
  }
};

module.exports.LESSON_PRICE_IDR = LESSON_PRICE_IDR;
module.exports.fetchRate = fetchRate;
