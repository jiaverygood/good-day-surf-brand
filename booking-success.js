(function () {
  'use strict';

  var TYPE_LABEL = { Group: 'Group Lesson', Private: 'Private Lesson' };

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
      msgEl.textContent = 'Missing payment information.';
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
          msgEl.textContent = 'Payment complete! Your booking is confirmed.';
          summaryEl.hidden = false;
          summaryEl.innerHTML =
            '<p class="booking-price-label">Booking Details</p>' +
            '<p class="booking-price-idr">' + (TYPE_LABEL[type] || type) + ' · ' + headcount + (headcount === '1' ? ' person' : ' people') + '</p>' +
            '<p class="booking-price-krw">' + date + ' ' + time + ' · ' + spot + '</p>';
        } else {
          msgEl.textContent = 'Payment confirmation failed: ' + (data.error || 'Unknown error');
        }
      })
      .catch(function () {
        msgEl.textContent = 'An error occurred while confirming payment.';
      });
  });
})();
