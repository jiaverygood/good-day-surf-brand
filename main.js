// Good Day Surf Bali — 2026 상반기 매출 · 예약 대시보드
// 데이터 출처: Supabase bookings 테이블 (예전엔 data.js 정적 배열이었으나 마이그레이션됨).

(function () {
  'use strict';

  var SUPABASE_URL = 'https://kwramrtbnfqbhggpdosg.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_Q7FhKvLYKOtvitr4Jo4K0w_Cnpk1z9R';

  var supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  var COLORS = {
    primary50: '#E7F1EE',
    primary100: '#C3DED7',
    primary300: '#74B3A4',
    primary500: '#2E7C6E',
    primary700: '#1B5449',
    accent500: '#DE672B',
    neutral400: '#A79C8D',
    cream50: '#FDF8EC'
  };

  var HEAT_RAMP = [COLORS.primary50, COLORS.primary100, COLORS.primary300, COLORS.primary500, COLORS.primary700];
  var HEAT_TEXT = ['#452A1B', '#452A1B', '#452A1B', '#FDF8EC', '#FDF8EC'];

  var DOW_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var TIME_ORDER = ['07:00', '09:00', '11:00', '14:00', '16:00'];

  // compareType: 'trend' = 실제 성과 변화(화살표 + 성공/실패 색) / 'seasonal' = 계절 요인일 뿐 성과 판단 아님(중립 색, 화살표 없음)
  var RANGE_DEFS = {
    all: { start: '2026-01-01', end: '2026-06-30', compare: null },
    q1: { start: '2026-01-01', end: '2026-03-31', compare: { start: '2026-04-01', end: '2026-06-30' }, compareLabel: 'Q2 (Dry Season)', compareType: 'seasonal' },
    q2: { start: '2026-04-01', end: '2026-06-30', compare: { start: '2026-01-01', end: '2026-03-31' }, compareLabel: 'Q1 (Rainy Season)', compareType: 'seasonal' },
    last30: { start: '2026-06-01', end: '2026-06-30', compare: { start: '2026-05-01', end: '2026-05-31' }, compareLabel: 'May', compareType: 'trend' }
  };

  function inRange(dateStr, start, end) {
    return dateStr >= start && dateStr <= end;
  }

  function formatIDR(n) {
    if (Math.abs(n) >= 1e6) return 'Rp ' + (n / 1e6).toFixed(1) + 'M';
    if (Math.abs(n) >= 1e3) return 'Rp ' + Math.round(n / 1e3) + 'K';
    return 'Rp ' + Math.round(n);
  }

  function formatIDRFull(n) {
    return 'Rp ' + Math.round(n).toLocaleString('en-US');
  }

  function formatNumber(n) {
    return n.toLocaleString('en-US');
  }

  function formatShortDate(dateStr) {
    var parts = dateStr.split('-');
    return parseInt(parts[1], 10) + '/' + parseInt(parts[2], 10);
  }

  function sum(arr, fn) {
    return arr.reduce(function (acc, d) { return acc + fn(d); }, 0);
  }

  function pctDelta(current, previous) {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / previous) * 100;
  }

  // 실제 성과 변화 — 화살표 + 성공/실패 색 (같은 성격의 기간끼리 비교할 때만 사용)
  function setTrendDelta(el, value, label) {
    var isUp = value >= 0;
    el.textContent = (isUp ? '▲ ' : '▼ ') + Math.abs(value).toFixed(1) + '% vs ' + label;
    el.className = 'stat-delta is-trend ' + (isUp ? 'is-up' : 'is-down');
  }

  // 계절 요인 — 우기/건기처럼 계절이 원인인 차이는 성과 판단(초록/빨강, 화살표)으로 보이면 안 되므로 중립 색으로 별도 표기
  function setSeasonalDelta(el, value, label) {
    var isUp = value >= 0;
    el.textContent = 'Seasonal factor · ' + Math.abs(value).toFixed(1) + '% ' + (isUp ? 'higher' : 'lower') + ' than ' + label;
    el.className = 'stat-delta is-seasonal';
  }

  function clearDelta(el) {
    el.textContent = '';
    el.className = 'stat-delta';
  }

  function computeKpi(daily) {
    var revenue = sum(daily, function (d) { return d.revenue; });
    var bookings = sum(daily, function (d) { return d.bookings; });
    var headcount = sum(daily, function (d) { return d.headcount; });
    var operatingDays = daily.filter(function (d) { return d.bookings > 0; }).length;
    var avgHeadcountPerOperatingDay = operatingDays === 0 ? 0 : headcount / operatingDays;
    return { revenue: revenue, bookings: bookings, headcount: headcount, operatingDays: operatingDays, avgHeadcountPerOperatingDay: avgHeadcountPerOperatingDay };
  }

  // "보기 좋은" 눈금 간격 계산 (1-2-5 진법) — 0/500K/1M/1.5M... 처럼 딱 떨어지게
  function niceStep(maxVal, targetTicks) {
    if (maxVal <= 0) return 1;
    var rough = maxVal / targetTicks;
    var magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
    var residual = rough / magnitude;
    var niceResidual = residual > 5 ? 10 : residual > 2 ? 5 : residual > 1 ? 2 : 1;
    return niceResidual * magnitude;
  }

  // ---------- 애니메이션 헬퍼 (모션 최소화 설정 존중) ----------

  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function nextFrame(fn) {
    if (prefersReducedMotion) { fn(); return; }
    requestAnimationFrame(function () { requestAnimationFrame(fn); });
  }

  // 막대: 베이스라인 높이 0에서 최종 높이로 자라나는 효과
  function growBar(rect, finalY, finalH, delayMs) {
    if (prefersReducedMotion) {
      rect.setAttribute('y', finalY);
      rect.setAttribute('height', finalH);
      return;
    }
    var baseline = finalY + finalH;
    rect.setAttribute('y', baseline);
    rect.setAttribute('height', 0);
    rect.style.transition = 'y 0.55s cubic-bezier(0.16,1,0.3,1) ' + (delayMs || 0) + 'ms, height 0.55s cubic-bezier(0.16,1,0.3,1) ' + (delayMs || 0) + 'ms';
    nextFrame(function () {
      rect.setAttribute('y', finalY);
      rect.setAttribute('height', finalH);
    });
  }

  // 선 그래프: 경로를 왼쪽에서 오른쪽으로 그려나가는 효과
  function drawLine(path, area) {
    if (prefersReducedMotion) return;
    var length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    if (area) area.style.opacity = 0;
    nextFrame(function () {
      path.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)';
      path.style.strokeDashoffset = 0;
      if (area) {
        area.style.transition = 'opacity 0.9s ease 0.3s';
        area.style.opacity = '0.1';
      }
    });
  }

  // 히트맵 셀: 순서대로 살짝 시차를 두고 나타나는 효과
  function fadeInCell(el, index) {
    if (prefersReducedMotion) return;
    el.style.opacity = 0;
    el.style.transition = 'opacity 0.35s ease ' + (index * 8) + 'ms';
    nextFrame(function () { el.style.opacity = 1; });
  }

  // KPI 숫자: 이전 값에서 새 값으로 카운트업
  var kpiAnimTokens = {};
  function animateValue(el, key, toValue, formatFn, duration) {
    if (prefersReducedMotion) {
      el.textContent = formatFn(toValue);
      return;
    }
    var fromValue = kpiAnimTokens[key] === undefined ? 0 : kpiAnimTokens[key];
    kpiAnimTokens[key] = toValue;
    var start = null;
    duration = duration || 700;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = fromValue + (toValue - fromValue) * eased;
      el.textContent = formatFn(current);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---------- 일별 매출 추이 (시퀀셜 단일 색상 라인 + 영역) ----------

  function renderRevenueChart(daily) {
    var svg = document.getElementById('revenue-chart');
    var tooltip = document.getElementById('revenue-tooltip');
    var W = 720, H = 260;
    var padL = 48, padR = 12, padT = 12, padB = 28;
    var plotW = W - padL - padR;
    var plotH = H - padT - padB;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var maxVal = Math.max.apply(null, daily.map(function (d) { return d.revenue; }));
    var step = niceStep(maxVal, 5);
    var niceMax = maxVal === 0 ? step : Math.ceil(maxVal / step) * step;

    function x(i) { return padL + (i / (daily.length - 1)) * plotW; }
    function y(v) { return padT + plotH - (v / niceMax) * plotH; }

    var tickCount = Math.round(niceMax / step);
    for (var t = 0; t <= tickCount; t++) {
      var val = step * t;
      var yy = y(val);
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', padL);
      line.setAttribute('x2', W - padR);
      line.setAttribute('y1', yy);
      line.setAttribute('y2', yy);
      line.setAttribute('class', 'axis-line');
      svg.appendChild(line);

      var label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', padL - 8);
      label.setAttribute('y', yy + 4);
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('class', 'axis-label');
      label.textContent = formatIDR(val);
      svg.appendChild(label);
    }

    var linePath = daily.map(function (d, i) {
      return (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ',' + y(d.revenue).toFixed(1);
    }).join(' ');

    var areaPath = linePath + ' L' + x(daily.length - 1).toFixed(1) + ',' + (padT + plotH).toFixed(1) +
      ' L' + x(0).toFixed(1) + ',' + (padT + plotH).toFixed(1) + ' Z';

    var area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    area.setAttribute('d', areaPath);
    area.setAttribute('fill', COLORS.primary500);
    area.setAttribute('opacity', '0.1');
    area.setAttribute('stroke', 'none');
    svg.appendChild(area);

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', linePath);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', COLORS.primary500);
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);
    drawLine(path, area);

    var last = daily[daily.length - 1];
    var endDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    endDot.setAttribute('cx', x(daily.length - 1));
    endDot.setAttribute('cy', y(last.revenue));
    endDot.setAttribute('r', 4);
    endDot.setAttribute('fill', COLORS.primary500);
    endDot.setAttribute('stroke', COLORS.cream50);
    endDot.setAttribute('stroke-width', 2);
    svg.appendChild(endDot);
    if (!prefersReducedMotion) {
      endDot.style.opacity = 0;
      endDot.style.transition = 'opacity 0.3s ease 1.05s';
      nextFrame(function () { endDot.style.opacity = 1; });
    }

    // 예약 0건인 날은 "데이터 없음(휴무)"과 구분되도록 베이스라인에 속이 빈 마커로 항상 표시
    daily.forEach(function (d, i) {
      if (d.bookings !== 0) return;
      var zeroDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      zeroDot.setAttribute('cx', x(i));
      zeroDot.setAttribute('cy', y(0));
      zeroDot.setAttribute('r', 3);
      zeroDot.setAttribute('fill', COLORS.cream50);
      zeroDot.setAttribute('stroke', COLORS.accent500);
      zeroDot.setAttribute('stroke-width', 1.5);
      svg.appendChild(zeroDot);
    });

    [0, Math.floor((daily.length - 1) / 2), daily.length - 1].forEach(function (i) {
      var lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      lbl.setAttribute('x', x(i));
      lbl.setAttribute('y', H - 8);
      lbl.setAttribute('text-anchor', i === 0 ? 'start' : (i === daily.length - 1 ? 'end' : 'middle'));
      lbl.setAttribute('class', 'axis-label');
      lbl.textContent = formatShortDate(daily[i].date);
      svg.appendChild(lbl);
    });

    var crosshair = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    crosshair.setAttribute('y1', padT);
    crosshair.setAttribute('y2', padT + plotH);
    crosshair.setAttribute('stroke', COLORS.neutral400);
    crosshair.setAttribute('stroke-width', 1);
    crosshair.setAttribute('opacity', 0);
    svg.appendChild(crosshair);

    var hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    hitArea.setAttribute('x', padL);
    hitArea.setAttribute('y', padT);
    hitArea.setAttribute('width', plotW);
    hitArea.setAttribute('height', plotH);
    hitArea.setAttribute('fill', 'transparent');
    svg.appendChild(hitArea);

    function showTooltip(evt) {
      var rect = svg.getBoundingClientRect();
      var clientX = (evt.touches ? evt.touches[0].clientX : evt.clientX);
      var relX = (clientX - rect.left) / rect.width * W;
      var idx = Math.round(((relX - padL) / plotW) * (daily.length - 1));
      idx = Math.max(0, Math.min(daily.length - 1, idx));

      var cx = x(idx);
      crosshair.setAttribute('x1', cx);
      crosshair.setAttribute('x2', cx);
      crosshair.setAttribute('opacity', 1);

      var d = daily[idx];
      tooltip.innerHTML = '';
      var title = document.createElement('div');
      title.textContent = d.date + ' (' + d.dow + ')';
      title.style.marginBottom = '4px';
      title.style.fontWeight = '600';
      tooltip.appendChild(title);

      var revRow = document.createElement('div');
      revRow.className = 'tt-row';
      var revLabel = document.createElement('span');
      revLabel.textContent = 'Revenue ';
      revRow.appendChild(revLabel);
      var revVal = document.createElement('span');
      revVal.className = 'tt-value';
      revVal.textContent = formatIDRFull(d.revenue);
      revRow.appendChild(revVal);
      tooltip.appendChild(revRow);

      var bkRow = document.createElement('div');
      bkRow.className = 'tt-row';
      var bkLabel = document.createElement('span');
      bkLabel.textContent = 'Bookings ';
      bkRow.appendChild(bkLabel);
      var bkVal = document.createElement('span');
      bkVal.className = 'tt-value';
      bkVal.textContent = d.bookings;
      bkRow.appendChild(bkVal);
      tooltip.appendChild(bkRow);

      if (d.bookings === 0) {
        var noteRow = document.createElement('div');
        noteRow.className = 'tt-note';
        noteRow.textContent = 'No bookings · open day (not closed)';
        tooltip.appendChild(noteRow);
      }

      var wrapRect = svg.parentElement.getBoundingClientRect();
      var px = (cx / W) * wrapRect.width;
      var py = (y(d.revenue) / H) * wrapRect.height;
      tooltip.style.left = px + 'px';
      tooltip.style.top = py + 'px';
      tooltip.hidden = false;
    }

    function hideTooltip() {
      crosshair.setAttribute('opacity', 0);
      tooltip.hidden = true;
    }

    hitArea.addEventListener('pointermove', showTooltip);
    hitArea.addEventListener('pointerleave', hideTooltip);

    var tbody = document.querySelector('#revenue-table tbody');
    tbody.innerHTML = '';
    daily.forEach(function (d) {
      var tr = document.createElement('tr');
      [d.date + ' (' + d.dow + ')', String(d.bookings), formatIDRFull(d.revenue)].forEach(function (text) {
        var td = document.createElement('td');
        td.textContent = text;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  // ---------- 레슨 유형별 매출 (2-시리즈 카테고리컬 — Teal/Orange 검증된 쌍) ----------

  function renderTypeChart(bookingsInRange) {
    var svg = document.getElementById('type-chart');
    var tooltip = document.getElementById('type-tooltip');
    var legend = document.getElementById('type-legend');
    var W = 340, H = 240;
    var padL = 12, padR = 12, padT = 24, padB = 28;
    var plotW = W - padL - padR;
    var plotH = H - padT - padB;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var types = [
      { key: 'Private', color: COLORS.primary500 },
      { key: 'Group', color: COLORS.accent500 }
    ];
    var data = types.map(function (t) {
      var rows = bookingsInRange.filter(function (b) { return b.type === t.key; });
      return { type: t.key, color: t.color, revenue: sum(rows, function (b) { return b.revenue; }), count: rows.length };
    });

    var n = data.length;
    var slot = plotW / n;
    var barW = Math.min(70, slot * 0.5);
    var maxVal = Math.max.apply(null, data.map(function (d) { return d.revenue; }));

    data.forEach(function (d) {
      var i = data.indexOf(d);
      var slotX = padL + i * slot + slot / 2;
      var barH = maxVal === 0 ? 0 : (d.revenue / maxVal) * plotH;
      var barY = padT + plotH - barH;

      var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', slotX - barW / 2);
      rect.setAttribute('width', barW);
      rect.setAttribute('rx', 4);
      rect.setAttribute('fill', d.color);
      rect.setAttribute('class', 'bar');
      rect.setAttribute('tabindex', '0');
      rect.setAttribute('role', 'img');
      rect.setAttribute('aria-label', d.type + ' ' + formatIDRFull(d.revenue));
      svg.appendChild(rect);
      growBar(rect, barY, Math.max(barH, 1), i * 80);

      var valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueLabel.setAttribute('x', slotX);
      valueLabel.setAttribute('y', barY - 8);
      valueLabel.setAttribute('text-anchor', 'middle');
      valueLabel.setAttribute('class', 'axis-label');
      valueLabel.setAttribute('font-weight', '600');
      valueLabel.textContent = formatIDR(d.revenue);
      svg.appendChild(valueLabel);

      var catLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      catLabel.setAttribute('x', slotX);
      catLabel.setAttribute('y', H - 8);
      catLabel.setAttribute('text-anchor', 'middle');
      catLabel.setAttribute('class', 'axis-label');
      catLabel.textContent = d.type;
      svg.appendChild(catLabel);

      function show() {
        var wrapRect = svg.parentElement.getBoundingClientRect();
        var px = (slotX / W) * wrapRect.width;
        var py = (barY / H) * wrapRect.height;
        tooltip.innerHTML = '';
        var row = document.createElement('div');
        row.className = 'tt-row';
        var val = document.createElement('span');
        val.className = 'tt-value';
        val.textContent = d.type + ' — ' + formatIDRFull(d.revenue) + ' (' + d.count + ' bookings)';
        row.appendChild(val);
        tooltip.appendChild(row);
        tooltip.style.left = px + 'px';
        tooltip.style.top = py + 'px';
        tooltip.hidden = false;
      }
      function hide() { tooltip.hidden = true; }

      rect.addEventListener('pointermove', show);
      rect.addEventListener('pointerleave', hide);
      rect.addEventListener('focus', show);
      rect.addEventListener('blur', hide);
    });

    legend.innerHTML = '';
    data.forEach(function (d) {
      var el = document.createElement('span');
      el.className = 'legend-item';
      var key = document.createElement('span');
      key.className = 'legend-key';
      key.style.background = d.color;
      el.appendChild(key);
      var text = document.createElement('span');
      text.textContent = d.type;
      el.appendChild(text);
      legend.appendChild(el);
    });
  }

  // ---------- 스팟별 매출 (단일 시리즈 — 단일 색조 + 직접 라벨) ----------
  // 건수보다 매출이 스팟별 자원 배분 의사결정에 더 직접적으로 쓸모 있음

  function renderSpotChart(bookingsInRange) {
    var svg = document.getElementById('spot-chart');
    var tooltip = document.getElementById('spot-tooltip');
    var W = 340, H = 240;
    var padL = 12, padR = 12, padT = 24, padB = 28;
    var plotW = W - padL - padR;
    var plotH = H - padT - padB;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var stats = {};
    bookingsInRange.forEach(function (b) {
      if (!stats[b.spot]) stats[b.spot] = { revenue: 0, count: 0 };
      stats[b.spot].revenue += b.revenue;
      stats[b.spot].count += 1;
    });
    var spots = Object.keys(stats).sort(function (a, b) { return stats[b].revenue - stats[a].revenue; });
    var data = spots.map(function (s) { return { spot: s, revenue: stats[s].revenue, count: stats[s].count }; });

    var n = data.length;
    var slot = plotW / n;
    var barW = Math.min(56, slot * 0.55);
    var maxVal = Math.max.apply(null, data.map(function (d) { return d.revenue; }));

    data.forEach(function (d, i) {
      var slotX = padL + i * slot + slot / 2;
      var barH = maxVal === 0 ? 0 : (d.revenue / maxVal) * plotH;
      var barY = padT + plotH - barH;

      var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', slotX - barW / 2);
      rect.setAttribute('width', barW);
      rect.setAttribute('rx', 4);
      rect.setAttribute('fill', COLORS.primary500);
      rect.setAttribute('class', 'bar');
      rect.setAttribute('tabindex', '0');
      rect.setAttribute('role', 'img');
      rect.setAttribute('aria-label', d.spot + ' ' + formatIDRFull(d.revenue));
      svg.appendChild(rect);
      growBar(rect, barY, Math.max(barH, 1), i * 80);

      var valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueLabel.setAttribute('x', slotX);
      valueLabel.setAttribute('y', barY - 8);
      valueLabel.setAttribute('text-anchor', 'middle');
      valueLabel.setAttribute('class', 'axis-label');
      valueLabel.setAttribute('font-weight', '600');
      valueLabel.textContent = formatIDR(d.revenue);
      svg.appendChild(valueLabel);

      var catLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      catLabel.setAttribute('x', slotX);
      catLabel.setAttribute('y', H - 8);
      catLabel.setAttribute('text-anchor', 'middle');
      catLabel.setAttribute('class', 'axis-label');
      catLabel.textContent = d.spot;
      svg.appendChild(catLabel);

      function show() {
        var wrapRect = svg.parentElement.getBoundingClientRect();
        var px = (slotX / W) * wrapRect.width;
        var py = (barY / H) * wrapRect.height;
        tooltip.innerHTML = '';
        var row = document.createElement('div');
        row.className = 'tt-row';
        var val = document.createElement('span');
        val.className = 'tt-value';
        val.textContent = d.spot + ' — ' + formatIDRFull(d.revenue) + ' (' + d.count + ' bookings)';
        row.appendChild(val);
        tooltip.appendChild(row);
        tooltip.style.left = px + 'px';
        tooltip.style.top = py + 'px';
        tooltip.hidden = false;
      }
      function hide() { tooltip.hidden = true; }

      rect.addEventListener('pointermove', show);
      rect.addEventListener('pointerleave', hide);
      rect.addEventListener('focus', show);
      rect.addEventListener('blur', hide);
    });
  }

  // ---------- 요일 x 시간대 히트맵 (시퀀셜 단일 색조 램프) ----------

  function renderHeatmap(bookingsInRange) {
    var svg = document.getElementById('heatmap-chart');
    var tooltip = document.getElementById('heatmap-tooltip');
    var W = 720, H = 220;
    var padL = 56, padR = 12, padT = 12, padB = 12;
    var plotW = W - padL - padR;
    var plotH = H - padT - padB;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var matrix = {};
    bookingsInRange.forEach(function (b) {
      var key = b.dow + '|' + b.time;
      matrix[key] = (matrix[key] || 0) + 1;
    });
    var maxVal = 0;
    DOW_ORDER.forEach(function (dow) {
      TIME_ORDER.forEach(function (time) {
        maxVal = Math.max(maxVal, matrix[dow + '|' + time] || 0);
      });
    });

    function binIndex(v) {
      if (v <= 0 || maxVal === 0) return 0;
      var ratio = v / maxVal;
      if (ratio <= 0.25) return 1;
      if (ratio <= 0.5) return 2;
      if (ratio <= 0.75) return 3;
      return 4;
    }

    var colW = plotW / DOW_ORDER.length;
    var rowH = plotH / TIME_ORDER.length;
    var gap = 2;

    TIME_ORDER.forEach(function (time, ri) {
      var rowLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      rowLabel.setAttribute('x', padL - 8);
      rowLabel.setAttribute('y', padT + ri * rowH + rowH / 2 + 4);
      rowLabel.setAttribute('text-anchor', 'end');
      rowLabel.setAttribute('class', 'axis-label');
      rowLabel.textContent = time;
      svg.appendChild(rowLabel);
    });

    DOW_ORDER.forEach(function (dow, ci) {
      var colLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      colLabel.setAttribute('x', padL + ci * colW + colW / 2);
      colLabel.setAttribute('y', padT - 2);
      colLabel.setAttribute('text-anchor', 'middle');
      colLabel.setAttribute('class', 'axis-label');
      colLabel.textContent = dow;
      svg.appendChild(colLabel);
    });

    var padTGrid = padT + 14;
    var plotHGrid = plotH - 14;
    rowH = plotHGrid / TIME_ORDER.length;

    TIME_ORDER.forEach(function (time, ri) {
      DOW_ORDER.forEach(function (dow, ci) {
        var count = matrix[dow + '|' + time] || 0;
        var bin = binIndex(count);
        var cellX = padL + ci * colW + gap / 2;
        var cellY = padTGrid + ri * rowH + gap / 2;
        var cellW = colW - gap;
        var cellH = rowH - gap;

        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', cellX);
        rect.setAttribute('y', cellY);
        rect.setAttribute('width', cellW);
        rect.setAttribute('height', cellH);
        rect.setAttribute('rx', 4);
        rect.setAttribute('fill', HEAT_RAMP[bin]);
        rect.setAttribute('stroke', '#DFD9CE');
        rect.setAttribute('stroke-width', '1');
        rect.setAttribute('class', 'heat-cell');
        rect.setAttribute('tabindex', '0');
        rect.setAttribute('role', 'img');
        rect.setAttribute('aria-label', dow + ' ' + time + ' — ' + count + ' bookings');
        svg.appendChild(rect);
        fadeInCell(rect, ri * DOW_ORDER.length + ci);

        var label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', cellX + cellW / 2);
        label.setAttribute('y', cellY + cellH / 2 + 4);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('class', 'heat-label');
        label.setAttribute('fill', HEAT_TEXT[bin]);
        label.textContent = count;
        svg.appendChild(label);

        function show() {
          var wrapRect = svg.parentElement.getBoundingClientRect();
          var px = ((cellX + cellW / 2) / W) * wrapRect.width;
          var py = (cellY / H) * wrapRect.height;
          tooltip.innerHTML = '';
          var row = document.createElement('div');
          row.className = 'tt-row';
          var val = document.createElement('span');
          val.className = 'tt-value';
          val.textContent = dow + ' ' + time + ' — ' + count + ' bookings';
          row.appendChild(val);
          tooltip.appendChild(row);
          tooltip.style.left = px + 'px';
          tooltip.style.top = py + 'px';
          tooltip.hidden = false;
        }
        function hide() { tooltip.hidden = true; }

        rect.addEventListener('pointermove', show);
        rect.addEventListener('pointerleave', hide);
        rect.addEventListener('focus', show);
        rect.addEventListener('blur', hide);
      });
    });
  }

  // ---------- 채널 / 국적 / 강사 실적 테이블 ----------

  function groupBy(rows, key) {
    var map = {};
    rows.forEach(function (r) {
      var k = r[key];
      if (!map[k]) map[k] = { key: k, count: 0, revenue: 0, headcount: 0 };
      map[k].count += 1;
      map[k].revenue += r.revenue;
      map[k].headcount += r.headcount;
    });
    return Object.keys(map).map(function (k) { return map[k]; });
  }

  function renderChannelTable(bookingsInRange) {
    var totalRevenue = sum(bookingsInRange, function (b) { return b.revenue; });
    var groups = groupBy(bookingsInRange, 'channel').sort(function (a, b) { return b.revenue - a.revenue; });
    var tbody = document.querySelector('#channel-table tbody');
    tbody.innerHTML = '';
    groups.forEach(function (g) {
      var pct = totalRevenue === 0 ? 0 : (g.revenue / totalRevenue) * 100;
      var tr = document.createElement('tr');
      [g.key, String(g.count), formatIDRFull(g.revenue), pct.toFixed(0) + '%'].forEach(function (text) {
        var td = document.createElement('td');
        td.textContent = text;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function renderNationalityTable(bookingsInRange) {
    var groups = groupBy(bookingsInRange, 'nationality').sort(function (a, b) { return b.revenue - a.revenue; }).slice(0, 8);
    var tbody = document.querySelector('#nationality-table tbody');
    tbody.innerHTML = '';
    groups.forEach(function (g) {
      var tr = document.createElement('tr');
      [g.key, String(g.count), formatIDRFull(g.revenue)].forEach(function (text) {
        var td = document.createElement('td');
        td.textContent = text;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function renderInstructorTable(bookingsInRange) {
    var groups = groupBy(bookingsInRange, 'instructor').sort(function (a, b) { return b.revenue - a.revenue; });
    var tbody = document.querySelector('#instructor-table tbody');
    tbody.innerHTML = '';
    groups.forEach(function (g) {
      var tr = document.createElement('tr');
      [g.key, String(g.count), String(g.headcount), formatIDRFull(g.revenue)].forEach(function (text) {
        var td = document.createElement('td');
        td.textContent = text;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function renderBookingTable(bookingsInRange) {
    var sorted = bookingsInRange.slice().sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return a.time < b.time ? 1 : -1;
    }).slice(0, 10);

    var tbody = document.querySelector('#booking-table tbody');
    tbody.innerHTML = '';
    sorted.forEach(function (b) {
      var tr = document.createElement('tr');
      [
        formatShortDate(b.date), b.dow, b.time, b.type, b.instructor, b.spot,
        b.channel, b.nationality, String(b.headcount), formatIDRFull(b.revenue)
      ].forEach(function (text) {
        var td = document.createElement('td');
        td.textContent = text;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  // ---------- 데이터 로드 (Supabase) ----------

  var DOW_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function fetchBookings() {
    var url = SUPABASE_URL + '/rest/v1/bookings?select=date,dow,time,type,instructor,spot,channel,nationality,headcount,unit_price,revenue&order=date.asc,time.asc';
    return fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + SUPABASE_ANON_KEY
      }
    }).then(function (res) {
      if (!res.ok) throw new Error('Supabase fetch failed: ' + res.status);
      return res.json();
    }).then(function (rows) {
      return rows.map(function (r) {
        return {
          date: r.date,
          dow: r.dow,
          time: r.time,
          type: r.type,
          instructor: r.instructor,
          spot: r.spot,
          channel: r.channel,
          nationality: r.nationality,
          headcount: Number(r.headcount),
          unitPrice: Number(r.unit_price),
          revenue: Number(r.revenue)
        };
      });
    });
  }

  // GDS_DAILY 동등물: 예약이 없는 날도 0으로 채워 2026-01-01~06-30 전체 구간을 채운다.
  function buildDailyFromBookings(bookings) {
    var byDate = {};
    bookings.forEach(function (b) {
      var agg = byDate[b.date];
      if (!agg) {
        agg = byDate[b.date] = { bookings: 0, headcount: 0, revenue: 0 };
      }
      agg.bookings += 1;
      agg.headcount += b.headcount;
      agg.revenue += b.revenue;
    });

    var daily = [];
    var cursor = new Date(Date.UTC(2026, 0, 1));
    var end = new Date(Date.UTC(2026, 5, 30));
    while (cursor <= end) {
      var dateStr = cursor.toISOString().slice(0, 10);
      var agg = byDate[dateStr] || { bookings: 0, headcount: 0, revenue: 0 };
      daily.push({
        date: dateStr,
        dow: DOW_NAMES[cursor.getUTCDay()],
        bookings: agg.bookings,
        headcount: agg.headcount,
        revenue: agg.revenue
      });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return daily;
  }

  // ---------- 전체 렌더 (필터가 모든 차트/스탯/테이블을 함께 스코프) ----------

  function render(rangeKey) {
    var def = RANGE_DEFS[rangeKey];
    var daily = window.GDS_DAILY.filter(function (d) { return inRange(d.date, def.start, def.end); });
    var bookings = window.GDS_BOOKINGS.filter(function (b) { return inRange(b.date, def.start, def.end); });

    var kpi = computeKpi(daily);
    animateValue(document.getElementById('stat-revenue'), 'revenue', kpi.revenue, formatIDR);
    animateValue(document.getElementById('stat-bookings'), 'bookings', kpi.bookings, function (v) { return formatNumber(Math.round(v)); });
    animateValue(document.getElementById('stat-headcount'), 'headcount', kpi.headcount, function (v) { return formatNumber(Math.round(v)); });
    animateValue(document.getElementById('stat-avg'), 'avg', kpi.avgHeadcountPerOperatingDay, function (v) { return v.toFixed(1); });

    var revDeltaEl = document.getElementById('stat-revenue-delta');
    var bkDeltaEl = document.getElementById('stat-bookings-delta');
    var hcDeltaEl = document.getElementById('stat-headcount-delta');
    var avgDeltaEl = document.getElementById('stat-avg-delta');

    if (def.compare) {
      var compareDaily = window.GDS_DAILY.filter(function (d) { return inRange(d.date, def.compare.start, def.compare.end); });
      var compareKpi = computeKpi(compareDaily);
      var setFn = def.compareType === 'seasonal' ? setSeasonalDelta : setTrendDelta;
      setFn(revDeltaEl, pctDelta(kpi.revenue, compareKpi.revenue), def.compareLabel);
      setFn(bkDeltaEl, pctDelta(kpi.bookings, compareKpi.bookings), def.compareLabel);
      setFn(hcDeltaEl, pctDelta(kpi.headcount, compareKpi.headcount), def.compareLabel);
      setFn(avgDeltaEl, pctDelta(kpi.avgHeadcountPerOperatingDay, compareKpi.avgHeadcountPerOperatingDay), def.compareLabel);
    } else {
      clearDelta(revDeltaEl);
      clearDelta(bkDeltaEl);
      clearDelta(hcDeltaEl);
      clearDelta(avgDeltaEl);
    }

    renderRevenueChart(daily);
    renderTypeChart(bookings);
    renderSpotChart(bookings);
    renderHeatmap(bookings);
    renderChannelTable(bookings);
    renderNationalityTable(bookings);
    renderInstructorTable(bookings);
    renderBookingTable(bookings);
  }

  function initFilters() {
    var buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        render(btn.dataset.range);
      });
    });
  }

  function showLoadError(err) {
    var main = document.querySelector('main.page');
    var banner = document.createElement('p');
    banner.textContent = 'Failed to load data. Please try again shortly.';
    banner.style.color = '#B3261E';
    banner.style.textAlign = 'center';
    banner.style.padding = '16px';
    main.insertBefore(banner, main.firstChild);
    console.error(err);
  }

  function initApp() {
    fetchBookings().then(function (bookings) {
      window.GDS_BOOKINGS = bookings;
      window.GDS_DAILY = buildDailyFromBookings(bookings);
      initFilters();
      render('all');
    }).catch(showLoadError);
  }

  // ---------- 로그인 게이트 (Supabase Auth: Google / Kakao + 게스트) ----------

  var appStarted = false;
  var GUEST_ID = 'guest';
  var GUEST_PW = 'guest1234';
  var GUEST_SESSION_KEY = 'gds_guest_session';

  function isGuestSession() {
    return sessionStorage.getItem(GUEST_SESSION_KEY) === 'true';
  }

  function showAuthGate(errorMessage) {
    document.getElementById('auth-gate').hidden = false;
    document.getElementById('app-header').hidden = true;
    document.getElementById('app-main').hidden = true;
    var errorEl = document.getElementById('auth-error');
    if (errorMessage) {
      errorEl.textContent = errorMessage;
      errorEl.hidden = false;
    } else {
      errorEl.hidden = true;
    }
  }

  function showApp() {
    document.getElementById('auth-gate').hidden = true;
    document.getElementById('app-header').hidden = false;
    document.getElementById('app-main').hidden = false;
    if (!appStarted) {
      appStarted = true;
      initApp();
    }
  }

  function initAuth() {
    document.getElementById('google-login-btn').addEventListener('click', function () {
      supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + window.location.pathname }
      });
    });

    document.getElementById('kakao-login-btn').addEventListener('click', function () {
      supabaseClient.auth.signInWithOAuth({
        provider: 'kakao',
        options: { redirectTo: window.location.origin + window.location.pathname }
      });
    });

    document.getElementById('guest-login-btn').addEventListener('click', function () {
      var id = document.getElementById('guest-id').value.trim();
      var pw = document.getElementById('guest-pw').value;
      if (id === GUEST_ID && pw === GUEST_PW) {
        sessionStorage.setItem(GUEST_SESSION_KEY, 'true');
        showApp();
      } else {
        showAuthGate('Incorrect username or password.');
      }
    });

    document.getElementById('logout-btn').addEventListener('click', function () {
      appStarted = false;
      sessionStorage.removeItem(GUEST_SESSION_KEY);
      supabaseClient.auth.signOut().then(function () { showAuthGate(); });
    });

    // onAuthStateChange는 구독 직후 현재 세션 상태(INITIAL_SESSION)로 한 번 즉시 호출된다.
    supabaseClient.auth.onAuthStateChange(function (event, session) {
      if (session || isGuestSession()) {
        showApp();
      } else {
        showAuthGate();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initAuth);
})();
