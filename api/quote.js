// 오늘자 IDR→KRW 환율로 선택된 레슨(종류 x 인원) 가격을 원화로 환산해 돌려준다.
var LESSON_PRICES_IDR = { Group: 200000, Private: 300000 };
var MAX_HEADCOUNT = 6;

async function fetchRate() {
  var res = await fetch('https://open.er-api.com/v6/latest/IDR');
  var data = await res.json();
  if (data.result !== 'success' || !data.rates || !data.rates.KRW) {
    throw new Error('rate fetch failed');
  }
  return data.rates.KRW;
}

function normalizeHeadcount(raw) {
  var n = parseInt(raw, 10);
  if (!n || n < 1) return 1;
  if (n > MAX_HEADCOUNT) return MAX_HEADCOUNT;
  return n;
}

function computeAmountKRW(type, headcount, rate) {
  var unit = LESSON_PRICES_IDR[type];
  if (!unit) throw new Error('invalid lesson type');
  var totalIDR = unit * normalizeHeadcount(headcount);
  return Math.round((totalIDR * rate) / 100) * 100;
}

module.exports = async function handler(req, res) {
  var query = req.query || {};
  var type = query.type || 'Private';
  var headcount = normalizeHeadcount(query.headcount);

  if (!LESSON_PRICES_IDR[type]) {
    res.status(400).json({ error: '잘못된 레슨 종류입니다.' });
    return;
  }

  try {
    var rate = await fetchRate();
    var amountKRW = computeAmountKRW(type, headcount, rate);
    res.status(200).json({
      type: type,
      headcount: headcount,
      lessonPriceIDR: LESSON_PRICES_IDR[type],
      totalPriceIDR: LESSON_PRICES_IDR[type] * headcount,
      rate: rate,
      amountKRW: amountKRW,
      fetchedAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: '환율 정보를 가져오지 못했습니다.' });
  }
};

module.exports.LESSON_PRICES_IDR = LESSON_PRICES_IDR;
module.exports.fetchRate = fetchRate;
module.exports.computeAmountKRW = computeAmountKRW;
module.exports.normalizeHeadcount = normalizeHeadcount;
