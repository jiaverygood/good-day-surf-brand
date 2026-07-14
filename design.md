# Good Day Surf Bali — 디자인 시스템 v3

> 이 문서는 LLM 시스템 프롬프트/컨텍스트로 그대로 붙여넣어 사용합니다.
> 이후 이 대화에서 만드는 모든 시각 결과물(랜딩, 카드, 썸네일, SNS, 명함, 슬라이드)은
> 아래 토큰과 규칙을 예외 없이 따릅니다. 새 HEX·폰트·간격을 발명하지 않습니다.
>
> 색상은 실제 자산에서 추출했습니다 — 로고 배지, 명함(앞/뒤), 웹사이트.
> 방향: **레트로 배지 우선**. 인쇄물 전체가 크림·코코아·틸·오렌지로 통일되어 있고,
> 웹사이트의 쨍한 오션 블루(#17A2E0)는 예외적 레거시로 취급합니다.

---

## ① 브랜드 개요

- **브랜드명**: Good Day Surf (Good Day Surf Bali)
- **슬로건**: Good Waves, Good Vibes
- **한 줄 소개**: 쿠타·레기안 해변의 로컬 강사와 함께하는 발리 서프 레슨 — 초보와 아이도 환영
- **위치/운영**: Jl. Pantai Legian, Legian, Kuta, Badung Regency, Bali 80361 · 매일 07:00–19:00
- **연락**: WhatsApp +62 856 9232 3217 · gooddaysurfbali@gmail.com · gooddaysurf.com
- **타겟 사용자**: 발리를 찾는 여행자 — 서핑 입문자, 아이와 함께 오는 가족(7–13세),
  친구·소그룹 첫 체험자, 실력을 올리려는 재방문 중급자
- **핵심 가치 3**
  1. **Good vibes first** — 잘 타는 것보다 좋은 하루. 실력이 아니라 기분이 목표
  2. **Local & experienced** — 발리 로컬 강사, 진짜 스팟, 진짜 오늘의 파도
  3. **Every wave, remembered** — 모든 세션에 사진·영상 포함. 그날을 되돌려준다

---

## ② 디자인 톤 & 무드

- **핵심 키워드**: 레트로 서프 배지 / 볕에 그을린 따뜻함 / 편안한 스토크
- **무드 설명**
  70~80년대 서프숍 스티커의 감성 — 크림 종이 위에 코코아 아웃라인, 청록 파도, 지는 해의 오렌지.
  선명하고 시원하기보다 따뜻하고 손맛 있는 톤입니다. 배경은 흰색이 아니라 크림에서 출발하고,
  아웃라인은 얇은 회색이 아니라 굵은 코코아 선으로 그립니다.
- **비주얼 스타일 방향**: 레트로 / 핸드메이드 배지 / 웜 미니멀

### 절대 규칙 (Do / Don't)

    DO   : 배경은 크림(#FDF8EC)에서 출발. 순백은 카드·본문 영역에만
    DO   : 아웃라인은 코코아 1.5–2px. 회색 헤어라인 대신 갈색 선을 쓴다
    DO   : 틸(면) + 오렌지(점) 조합이 기본. 오렌지는 CTA와 슬로건에만
    DO   : 로고·아이콘은 두꺼운 아웃라인 + 단색 면. 원형 배지 구도를 반복 활용
    DON'T: 그라디언트, 네온, 글로우, 드롭섀도우 남용
    DON'T: 쨍한 오션 블루(#17A2E0)를 새 결과물의 메인으로 쓰기 (웹 레거시 한정)
    DON'T: 차가운 쿨 그레이 텍스트(#1B2429 등) 사용 — 텍스트는 코코아 계열
    DON'T: 슬로건 스크립트체를 본문·버튼·라벨에 쓰기

---

## ③ 컬러 시스템

### Primary — 웨이브 틸 (로고 파도)

    --primary-50:  #E7F1EE   /* 섹션 틴트, 뱃지 bg */
    --primary-100: #C3DED7   /* 보더, 서브 배경 */
    --primary-300: #74B3A4   /* 일러스트 하이라이트 */
    --primary-500: #2E7C6E   /* 메인. 틸 블록, 링크, 자연 요소 */
    --primary-700: #1B5449   /* hover/press, 틸 위 진한 요소 */

### Accent — 선셋 오렌지 (해·CTA·슬로건)

    --accent-50:  #FCEEE3
    --accent-100: #F7D2B7
    --accent-300: #EE9A63
    --accent-500: #DE672B   /* CTA 버튼, 슬로건, 아이브로우 라벨 */
    --accent-700: #A94818   /* hover/press, 밝은 배경 위 오렌지 텍스트 */

### Base — 크림 (배경 시스템)

    --cream-50:  #FDF8EC   /* 페이지 기본 배경 */
    --cream-300: #FAF0DC   /* 로고 배지 배경, 레트로 블록 */
    --cream-500: #F2E3C2   /* 보드 컬러, 강조 블록 */
    --cream-700: #E0CB9E   /* 크림 위 보더 */

### Ink — 코코아 (텍스트·아웃라인)

    --cocoa-500: #6B4630   /* 보조 텍스트 */
    --cocoa-700: #452A1B   /* 본문·제목 기본 텍스트, 로고 아웃라인 */
    --cocoa-900: #2E1B10   /* 최대 강조 */

### Neutral (웜 그레이 — 흰 카드·UI 보조용)

    --neutral-0:   #FFFFFF
    --neutral-50:  #FAF8F4
    --neutral-100: #F0ECE4   /* disabled 배경 */
    --neutral-200: #DFD9CE   /* 흰 카드 보더 */
    --neutral-400: #A79C8D   /* placeholder, disabled 텍스트 */
    --neutral-600: #6E6357   /* 흰 배경 위 본문 보조 */
    --neutral-800: #3D352C

### Legacy — 오션 블루 (기존 웹사이트 전용)

    --ocean-500: #17A2E0    --ocean-50: #E6F4FC    --ocean-700: #0B6C99
    /* 현행 gooddaysurf.com과의 연속성이 필요할 때만. 새 결과물의 주색으로 쓰지 않는다. */

### Semantic

    --success-500: #2E7C6E    --success-bg: #E7F1EE
    --warning-500: #E0A03A    --warning-bg: #FBF0DC
    --error-500:   #C4453A    --error-bg:   #FAEAE8
    --info-500:    #17A2E0    --info-bg:    #E6F4FC

### 컬러 사용 규칙

    - 텍스트 기본색은 --cocoa-700. 순수 검정(#000)·쿨 그레이 금지.
    - 크림(#FAF0DC) 위 텍스트 → #452A1B. 틸(#2E7C6E) 위 → #FDF8EC.
    - 오렌지(#DE672B) 위 텍스트는 #FFFFFF만. 오렌지 텍스트는 크림·흰 배경에서만.
    - 한 화면 색 사용: 크림(배경) + 틸(면) + 오렌지(점) + 코코아(선/글자). 5번째 색 금지.

---

## ④ 타이포그래피

- **한글**: Pretendard (Fallback: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif)
- **영문 본문/헤드라인**: Poppins (Fallback: Inter, 'Open Sans', sans-serif)
- **워드마크 'GOOD DAY SURF'**: 커스텀 레트로 라운디드 볼드. **재현하지 말고 이미지 에셋 사용.**
  부득이한 웹 대체 시 Poppins 800 + letter-spacing 0.02em
- **슬로건 'Good Waves, Good Vibes'**: 레트로 스크립트/이탤릭 디스플레이.
  **원칙적으로 이미지 에셋 사용.** 웹 대체 폰트: 'Lobster Two' italic 또는 'Yellowtail'

      --font-sans:    'Poppins', 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
      --font-slogan:  'Lobster Two', Georgia, serif;   /* 슬로건 전용, 다른 용도 금지 */

### 위계

    --text-display:  font-size 56px; font-weight 700; line-height 1.15; letter-spacing -0.02em;
    --text-h1:       font-size 40px; font-weight 700; line-height 1.25; letter-spacing -0.02em;
    --text-h2:       font-size 28px; font-weight 700; line-height 1.35;
    --text-h3:       font-size 20px; font-weight 600; line-height 1.40;
    --text-body:     font-size 15px; font-weight 400; line-height 1.70; color --cocoa-500;
    --text-body-sm:  font-size 13px; font-weight 400; line-height 1.60;
    --text-caption:  font-size 12px; font-weight 500; line-height 1.40; color --neutral-400;
    --text-eyebrow:  font-size 13px; font-weight 600; letter-spacing 0.10em;
                     text-transform uppercase; color --accent-500;
    --text-slogan:   font-family --font-slogan; font-size 28–40px; font-style italic;
                     color --accent-500;   /* 크림·흰 배경 위에만 */

    규칙: 굵기는 400 / 500 / 600 / 700만. 헤드라인 700 vs 본문 400 — 굵기 대비를 크게.
    영문 헤드라인은 문장형. ALL CAPS는 워드마크와 아이브로우 라벨에만.

---

## ⑤ 스페이싱 & 그리드

### 기본 단위: 8px

    --space-xs:  4px    /* 아이콘-텍스트 */
    --space-sm:  8px
    --space-md:  16px   /* 기본 gap */
    --space-lg:  24px   /* 카드 패딩 */
    --space-xl:  48px   /* 섹션 내 그룹 */
    --space-2xl: 96px   /* 섹션 간 여백 */

### Radius / Border / Shadow

    --radius-sm:   6px     /* 버튼, 입력창 */
    --radius-md:   12px    /* 카드 */
    --radius-lg:   20px    /* 이미지 블록, 대형 배너 */
    --radius-full: 999px   /* 뱃지, 로고 배지, 아바타 */

    --border-ink:     1.5px solid #452A1B;   /* 레트로 카드·아이콘 아웃라인 (기본) */
    --border-soft:    1px solid #DFD9CE;     /* 흰 카드 */
    --border-cream:   1px solid #E0CB9E;     /* 크림 위 구분선 */
    --shadow-card:    0 2px 10px rgba(69,42,27,0.08);
    /* 그림자보다 코코아 아웃라인으로 입체를 만든다 */

### 그리드

    컨테이너 max-width: 1200px / 좌우 패딩 24px (모바일 20px)
    12 컬럼 / 거터 24px
    카드 그리드: repeat(auto-fit, minmax(260px, 1fr)); gap 24px
    본문 텍스트 최대 폭: 640px
    로고 배지: 원형, 최소 크기 64px. 여백(clear space)은 배지 지름의 20% 이상
    슬로건 락업: 야자수 아이콘 + 슬로건 가로 배치, 아이콘 높이 = 슬로건 캡 높이 × 1.2

---

## ⑥ 컴포넌트 가이드

### 버튼 (높이 44px / padding 0 24px / radius 6px / font 14px·600)

    Primary(오렌지) default : bg #DE672B  text #FFFFFF
                    hover   : bg #A94818
                    disabled: bg #F0ECE4  text #A79C8D
    Teal            default : bg #2E7C6E  text #FDF8EC
                    hover   : bg #1B5449
    Outline         default : bg transparent  text #452A1B  border 1.5px #452A1B
                    hover   : bg #FAF0DC
    Ghost           default : bg transparent  text #A94818
                    hover   : bg #FCEEE3

    틸 배경 위 버튼: bg #FDF8EC / text #1B5449.
    사진 위 버튼: 오렌지 Primary 그대로. 반투명 버튼 금지.

### 입력창 (높이 46px / padding 0 14px / radius 6px / font 14px)

    Default : bg #FFFFFF  border 1px #DFD9CE  text #452A1B  placeholder #A79C8D
    Hover   : border 1px #A79C8D
    Focus   : border 1.5px #2E7C6E  box-shadow 0 0 0 3px #E7F1EE  outline none
    Error   : border 1.5px #C4453A  box-shadow 0 0 0 3px #FAEAE8
              + 하단 헬퍼 12px, color #C4453A
    Disabled: bg #FAF8F4  border 1px #F0ECE4  text #A79C8D

    라벨: 상단 13px·600, color #6B4630, margin-bottom 6px

### 카드

    크림형(기본, 레트로)
      bg #FAF0DC  border 1.5px #452A1B  radius 12px  padding 20px
      제목 #452A1B / 본문 #6B4630 / 아이콘 #2E7C6E
    틸형(강조)
      bg #2E7C6E  radius 12px  padding 20px  border none
      제목 #FDF8EC / 본문 #C3DED7 / 아이콘 #F2E3C2
    화이트형(정보 밀도 높을 때)
      bg #FFFFFF  border 1px #DFD9CE  radius 12px  padding 20px  shadow --shadow-card
    레슨 카드 구조
      이미지(16:10, radius 8px) → 뱃지 → 제목 18px·600 → 설명 13px → CTA

### 뱃지 · 태그 (높이 22px / padding 0 10px / radius 999px / font 11px·600)

    Cream   : bg #FAF0DC  text #452A1B    /* 난이도, 소요시간 */
    Accent  : bg #FCEEE3  text #A94818    /* 인기, 추천 */
    Solid   : bg #DE672B  text #FFFFFF    /* 강조 카드 전용 */
    Teal    : bg #E7F1EE  text #1B5449    /* 스팟, 포함 사항 */

### 데이터 시각화 (대시보드·차트·리포트)

브랜드 색은 4개뿐이라 차트에 그대로 쓰면 색이 모자라거나, 의미가 어긋난다.
**오렌지는 차트에서 데이터 색으로 쓰지 않는다.** 오렌지는 CTA·슬로건 색이라
차트에 등장하는 순간 "여기를 보라"는 신호가 되어, 강조 의도가 없는 계열까지 강조된다.

    데이터 계열 — 틸 단일 램프 (순서 고정, 순환 금지)
    --series-1: #2E7C6E    ← 기본. 단일 계열이면 이것만
    --series-2: #74B3A4
    --series-3: #C3DED7
    --series-4: #1B5449
    --series-5: #A79C8D    ← 5번째부터는 뉴트럴. 그 이상은 '기타'로 접는다

    순차(크기·밀도 — 히트맵, 지도)
    #E7F1EE → #C3DED7 → #74B3A4 → #2E7C6E → #1B5449   (틸 단일 색조)

    강조(하나만 부각)
    강조 계열 #2E7C6E + 나머지 전부 #DFD9CE (뉴트럴). 색을 늘리지 말고 회색으로 눕힌다.

    경고·이상치 (드물게)
    #C4453A. 실제로 문제인 값에만. 그룹·범주 구분용으로 쓰지 않는다.

    차트 크롬
    배경 #FFFFFF (카드) 또는 #FDF8EC / 그리드선 #F0ECE4 1px / 축선 #DFD9CE
    축 라벨 #A79C8D 12px / 값 라벨 #452A1B / 범례 #6B4630 12px
    숫자는 tabular-nums. 세로 그리드선은 시간축에 긋지 않는다

    규칙
    - 색은 '무엇인가'를 나타낸다. 순위나 크기를 나타내지 않는다 — 정렬해도 색이 바뀌지 않게
    - 색만으로 구분하지 않는다. 범례 라벨과 값을 함께 붙인다
    - 이중 축 금지. 스케일이 둘이면 차트를 둘로 나눈다
    - 막대 두께 24px 이하, 데이터 끝만 4px 라운드
    - 단일 계열이면 범례를 생략한다 (제목이 계열명을 말한다)

### 명함 규격 (기존 자산 기준)

    앞면: 상단 중앙에 슬로건 락업(야자수 + Good Waves, Good Vibes / 오렌지)
          좌측 크림 원형 배지 로고, 우측 직함(코코아 700, 28px) + 연락처 3줄
          연락처 아이콘: WhatsApp 그린 / 이메일 코코아 / 웹 오렌지 — 원형 또는 단색 아이콘
    뒷면: 상단 슬로건 락업 → 중앙 가로형 로고(심볼 + 워드마크) → 하단 셀링 포인트 3줄
          (Beginner & Kids Friendly / Experienced Local Surf Instructor / Photo & Video Included)
    배경: 화이트 또는 크림. 여백을 넉넉히, 요소는 중앙 정렬.

---

## ⑦ 미리보기 샘플 (레슨 카드 — 크림형)

    <div style="background:#FAF0DC;border:1.5px solid #452A1B;border-radius:12px;padding:20px;
                max-width:280px;font-family:'Poppins','Pretendard',sans-serif;">
      <span style="display:inline-flex;height:22px;padding:0 10px;align-items:center;
                   border-radius:999px;background:#FCEEE3;color:#A94818;
                   font-size:11px;font-weight:600;">Beginner friendly</span>
      <p style="margin:12px 0 6px;font-size:18px;font-weight:600;color:#452A1B;">
        Private surf lesson</p>
      <p style="margin:0 0 16px;font-size:13px;color:#6B4630;line-height:1.6;">
        로컬 강사와 1:1. 보드·래시가드·사진·영상 모두 포함됩니다.</p>
      <button style="width:100%;height:44px;border:none;border-radius:6px;background:#DE672B;
                     color:#FFFFFF;font-size:14px;font-weight:600;">Book now</button>
    </div>

---

## ⑧ 적용 지침 (LLM용)

1. 이 대화의 모든 시각 결과물에 위 토큰만 사용한다. 새 HEX를 발명하지 않는다.
2. 색의 역할: 크림=배경, 틸=면, 오렌지=점(CTA·슬로건), 코코아=선과 글자. 5번째 색 금지.
   **차트·대시보드에서는 오렌지를 데이터 색으로 쓰지 않는다.** 계열 구분은 틸 램프로.
3. 슬로건 'Good Waves, Good Vibes'는 항상 오렌지 스크립트체, 야자수 아이콘과 함께 락업으로.
   본문 카피로 풀어 쓰거나 색을 바꾸지 않는다.
4. 로고는 재현하지 말고 제공된 이미지 에셋을 사용한다. 배지 주변 여백 20% 이상 확보.
5. 섹션 리듬: 크림 → 흰 카드 → 틸 풀블리드 → 크림. 같은 배경을 연달아 두지 않는다.
6. 카피는 영문 헤드라인 + 한국어 본문 병기 가능. 짧고 구어체. 과장된 마케팅 표현 금지.
7. 이모지 대신 두꺼운 아웃라인 아이콘(코코아 선 + 단색 면).
