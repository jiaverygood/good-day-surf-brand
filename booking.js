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
    krwEl.textContent = 'Fetching exchange rate...';

    fetch('/api/quote?type=' + encodeURIComponent(f.type) + '&headcount=' + encodeURIComponent(f.headcount))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (thisRequestId !== quoteRequestId) return; // 응답 오는 사이 선택이 바뀌었으면 무시
        if (data.error) throw new Error(data.error);

        quotedAmount = data.amountKRW;
        document.getElementById('price-idr').textContent =
          'Rp ' + data.totalPriceIDR.toLocaleString() + ' (' + f.headcount + (f.headcount === '1' ? ' person' : ' people') + ')';
        krwEl.textContent = 'approx. ₩' + quotedAmount.toLocaleString() + " (today's rate)";
        payBtn.disabled = false;
      })
      .catch(function () {
        if (thisRequestId !== quoteRequestId) return;
        krwEl.textContent = 'Failed to fetch exchange rate — please refresh.';
      });
  }

  function showError(message) {
    var errorEl = document.getElementById('booking-error');
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function handlePay() {
    var f = fields();

    if (!f.date) { showError('Please select a date.'); return; }
    if (!f.name || !f.phone) { showError('Please enter your name and phone number.'); return; }
    if (!quotedAmount) { showError('Exchange rate not loaded yet. Please try again shortly.'); return; }

    document.getElementById('booking-error').hidden = true;

    var toss = TossPayments(TOSS_CLIENT_KEY);
    var orderId = 'lesson-' + Date.now();
    var orderName = 'Good Day Surf ' + (f.type === 'Private' ? 'Private' : 'Group') + ' Lesson (' + f.headcount + (f.headcount === '1' ? ' person' : ' people') + ')';

    var successUrl = window.location.origin + '/booking-success.html'
      + '?type=' + encodeURIComponent(f.type)
      + '&headcount=' + encodeURIComponent(f.headcount)
      + '&date=' + encodeURIComponent(f.date)
      + '&time=' + encodeURIComponent(f.time)
      + '&spot=' + encodeURIComponent(f.spot);

    // '카드'는 토스 SDK가 요구하는 결제수단 식별자 리터럴이라 번역하면 안 됨
    toss.requestPayment('카드', {
      amount: quotedAmount,
      orderId: orderId,
      orderName: orderName,
      customerName: f.name,
      successUrl: successUrl,
      failUrl: window.location.origin + '/booking.html'
    }).catch(function (err) {
      if (err.code !== 'USER_CANCEL') {
        showError(err.message || 'An error occurred while requesting payment.');
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
