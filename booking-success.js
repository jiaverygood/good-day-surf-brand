(function () {
  'use strict';

  var TYPE_LABEL = { Group: '그룹 레슨', Private: '프라이빗 레슨' };

  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var paymentKey = getParam('paymentKey');
    var orderId = getParam('orderId');
    var amount = getParam('amount');
    var type = getParam('type');
    var headcount = getParam('headcount');
    var date = getParam('date');
    var time = getParam('time');
    var spot = getParam('spot');

    var msgEl = document.getElementById('result-message');
    var summaryEl = document.getElementById('result-summary');

    if (!paymentKey || !orderId || !amount) {
      msgEl.textContent = '결제 정보가 없습니다.';
      return;
    }

    fetch('/api/confirm-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentKey: paymentKey,
        orderId: orderId,
        amount: Number(amount),
        type: type,
        headcount: headcount
      })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          msgEl.textContent = '결제가 완료되었습니다! 예약이 확정되었어요.';
          summaryEl.hidden = false;
          summaryEl.innerHTML =
            '<p class="booking-price-label">예약 정보</p>' +
            '<p class="booking-price-idr">' + (TYPE_LABEL[type] || type) + ' · ' + headcount + '명</p>' +
            '<p class="booking-price-krw">' + date + ' ' + time + ' · ' + spot + '</p>';
        } else {
          msgEl.textContent = '결제 승인 실패: ' + (data.error || '알 수 없는 오류');
        }
      })
      .catch(function () {
        msgEl.textContent = '결제 확인 중 오류가 발생했습니다.';
      });
  });
})();
