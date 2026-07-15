// Good Day Surf Bali — 서핑 레슨 예약 결제 (토스페이먼츠)
(function () {
  'use strict';

  var TOSS_CLIENT_KEY = 'test_ck_DLJOpm5Qrl70eZnojvwQVPNdxbWn';

  var quotedAmount = null;
  var quoteRequestId = 0;

  function fields() {
    return {
      type: document.getElementById('lesson-type').value,
      date: document.getElementById('lesson-date').value,
      time: document.getElementById('lesson-time').value,
      spot: document.getElementById('lesson-spot').value,
      headcount: document.getElementById('lesson-headcount').value,
      name: document.getElementById('customer-name').value.trim(),
      phone: document.getElementById('customer-phone').value.trim()
    };
  }

  function refreshQuote() {
    var f = fields();
    var thisRequestId = ++quoteRequestId;
    var payBtn = document.getElementById('pay-btn');
    var krwEl = document.getElementById('price-krw');

    payBtn.disabled = true;
    krwEl.textContent = '환율 조회 중...';

    fetch('/api/quote?type=' + encodeURIComponent(f.type) + '&headcount=' + encodeURIComponent(f.headcount))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (thisRequestId !== quoteRequestId) return; // 응답 오는 사이 선택이 바뀌었으면 무시
        if (data.error) throw new Error(data.error);

        quotedAmount = data.amountKRW;
        document.getElementById('price-idr').textContent =
          'Rp ' + data.totalPriceIDR.toLocaleString() + ' (' + f.headcount + '명)';
        krwEl.textContent = '약 ' + quotedAmount.toLocaleString() + '원 (오늘 환율 기준)';
        payBtn.disabled = false;
      })
      .catch(function () {
        if (thisRequestId !== quoteRequestId) return;
        krwEl.textContent = '환율 조회 실패 — 새로고침 해주세요.';
      });
  }

  function showError(message) {
    var errorEl = document.getElementById('booking-error');
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function handlePay() {
    var f = fields();

    if (!f.date) { showError('날짜를 선택해주세요.'); return; }
    if (!f.name || !f.phone) { showError('이름과 연락처를 입력해주세요.'); return; }
    if (!quotedAmount) { showError('환율 정보를 아직 못 가져왔습니다. 잠시 후 다시 시도해주세요.'); return; }

    document.getElementById('booking-error').hidden = true;

    var toss = TossPayments(TOSS_CLIENT_KEY);
    var orderId = 'lesson-' + Date.now();
    var orderName = 'Good Day Surf ' + (f.type === 'Private' ? '프라이빗' : '그룹') + ' 레슨 (' + f.headcount + '명)';

    var successUrl = window.location.origin + '/booking-success.html'
      + '?type=' + encodeURIComponent(f.type)
      + '&headcount=' + encodeURIComponent(f.headcount)
      + '&date=' + encodeURIComponent(f.date)
      + '&time=' + encodeURIComponent(f.time)
      + '&spot=' + encodeURIComponent(f.spot);

    toss.requestPayment('카드', {
      amount: quotedAmount,
      orderId: orderId,
      orderName: orderName,
      customerName: f.name,
      successUrl: successUrl,
      failUrl: window.location.origin + '/booking.html'
    }).catch(function (err) {
      if (err.code !== 'USER_CANCEL') {
        showError(err.message || '결제 요청 중 오류가 발생했습니다.');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var dateInput = document.getElementById('lesson-date');
    var today = new Date().toISOString().slice(0, 10);
    dateInput.min = today;
    dateInput.value = today;

    ['lesson-type', 'lesson-headcount'].forEach(function (id) {
      document.getElementById(id).addEventListener('change', refreshQuote);
    });

    refreshQuote();
    document.getElementById('pay-btn').addEventListener('click', handlePay);
  });
})();
