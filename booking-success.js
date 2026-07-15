(function () {
  'use strict';

  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var paymentKey = getParam('paymentKey');
    var orderId = getParam('orderId');
    var amount = getParam('amount');
    var msgEl = document.getElementById('result-message');

    if (!paymentKey || !orderId || !amount) {
      msgEl.textContent = '결제 정보가 없습니다.';
      return;
    }

    fetch('/api/confirm-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentKey: paymentKey, orderId: orderId, amount: Number(amount) })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          msgEl.textContent = '결제가 완료되었습니다! 예약이 확정되었어요.';
        } else {
          msgEl.textContent = '결제 승인 실패: ' + (data.error || '알 수 없는 오류');
        }
      })
      .catch(function () {
        msgEl.textContent = '결제 확인 중 오류가 발생했습니다.';
      });
  });
})();
