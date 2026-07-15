// Good Day Surf Bali — 서핑 레슨 결제 (토스페이먼츠)
(function () {
  'use strict';

  // TODO: 토스페이먼츠 개발자센터에서 발급받은 테스트 클라이언트 키로 교체
  var TOSS_CLIENT_KEY = 'TOSS_CLIENT_KEY_PLACEHOLDER';

  var quotedAmount = null;

  function loadQuote() {
    fetch('/api/quote')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.error) throw new Error(data.error);
        quotedAmount = data.amountKRW;
        document.getElementById('price-krw').textContent =
          '약 ' + quotedAmount.toLocaleString() + '원 (오늘 환율 기준)';
        document.getElementById('pay-btn').disabled = false;
      })
      .catch(function () {
        document.getElementById('price-krw').textContent = '환율 조회 실패 — 새로고침 해주세요.';
      });
  }

  function showError(message) {
    var errorEl = document.getElementById('booking-error');
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function handlePay() {
    var name = document.getElementById('customer-name').value.trim();
    var phone = document.getElementById('customer-phone').value.trim();

    if (!name || !phone) {
      showError('이름과 연락처를 입력해주세요.');
      return;
    }
    if (!quotedAmount) {
      showError('환율 정보를 아직 못 가져왔습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    document.getElementById('booking-error').hidden = true;

    var toss = TossPayments(TOSS_CLIENT_KEY);
    var orderId = 'lesson-' + Date.now();

    toss.requestPayment('카드', {
      amount: quotedAmount,
      orderId: orderId,
      orderName: 'Good Day Surf 서핑 레슨 1회',
      customerName: name,
      successUrl: window.location.origin + '/booking-success.html',
      failUrl: window.location.origin + '/booking.html'
    }).catch(function (err) {
      if (err.code !== 'USER_CANCEL') {
        showError(err.message || '결제 요청 중 오류가 발생했습니다.');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadQuote();
    document.getElementById('pay-btn').addEventListener('click', handlePay);
  });
})();
