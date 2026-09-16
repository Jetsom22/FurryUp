# 퍼리업 (FurryUp) 전투 프로토타입

전투 기획서 Ver01 · 스테이지 기획서 V0.2 · 정비 화면 기획서 Ver01 을 바탕으로
"전투가 굴러가는" 최소 루프를 웹에서 검증하기 위한 프로토타입입니다.
전투 규칙과 캐릭터 데이터는 **전투 실험실 α-02** (https://kimkumo.github.io/FurryUp-BattleSimulator/) 를 그대로 따릅니다.

- 16:9 (1920×1080) PC 게임 기준 화면. 브라우저 창 크기에 맞춰 비율 유지 스케일
- Phaser 3 (로컬 파일 `vendor/phaser.min.js`), 빌드 도구 없음
- 라이브: https://jetsom22.github.io/FurryUp/

## 실행

```bash
npx serve .            # 또는
python3 -m http.server 8080
```
(`file://` 직접 열기는 브라우저 보안 정책 때문에 권장하지 않음)

## 배포

빌드 단계가 없는 순수 정적 사이트라 저장소 루트를 그대로 올리면 됩니다.
- **GitHub Pages**: `.github/workflows/pages.yml` 이 `main` push 시 테스트 후 루트를 배포합니다.
- **Cloudflare Pages**: Build command 비움, Build output directory `/`.

## 플레이 흐름 (구현 범위)

```
아웃게임(타이틀) → 플레이 → 챕터 선택(1챕터만 열림) → 도전
  → 첫 동료 선택 (42종 중 12종 잠금, 30종 중 1마리)
  → 팀 편성 (편성 순서 1~5)
  → [스테이지 진입]  스토리 / 이벤트 / 전투(일반·중간보스·보스)
  → 클리어 → 정비 화면 (상점에서 캐릭터 구매 · 배치 · 부활 · 리롤 · 맵) → 다음 스테이지
  → … → 1-15 보스 클리어 → 아웃게임  /  전멸 → 아웃게임
```

## 전투 규칙 (α-02)

| 항목 | 규칙 |
| --- | --- |
| 능력치 | 체력·공격·방어·속도 4종 (실험실 값). 최대 HP = 체력 × 10 |
| 기본 피해 | max(1, ⌊공격 × 2 − 방어⌋) |
| 행동 순서 | 턴 시작에 스킬 우선도(사용 가능할 때만) ↓ → 속도 ↓ → 편성 순서 ↑ → 동률이면 아군 먼저 |
| 투지 | 모든 행동 종료 후 +1. 캐릭터별 스킬 투지 요구량(2~10) 이상이면 자동 사용 |
| 문서 미정 캐릭터 | 개별 스킬이 없는 25종은 공통 스킬(투지 3, 고정 피해 2)만 사용. 패시브는 역할군 효과만 |
| 상태이상 | 독(턴 종료마다 현재 HP 2→4→8%…, 보호막 무시) / 출혈(최대 HP 5%/턴) / 표식(피해 ×1.2) / 기절(행동 1회 건너뜀) / 물살(3턴마다 투지 −1) |
| 종료 | 100턴까지 승패가 없으면 클리어 실패 처리 |

역할군 5종 (전투 기획서 p.8): 암살자(가장 뒤 슬롯 우선) · 보호자(시작 시 최대 HP 10% 보호막) · 돌격자(처치 시 최대 HP 5% 회복) · 결전자(8턴 시작 시 공·방·속 +1, 1회) · 교란자(피격당 15% 회피).
리메이크 문서의 추격자 → 돌격자, 치유자 → 보호자로 판정합니다 (`sourceRole` 에 원래 표기 보존).

문서 반영 17종(CHR_001~017)의 패시브·스킬은 실험실 `app.js` 의 판정을 그대로 옮겼습니다 (자폭, 약자포식, 바다의 독, 축복, 목긋기, 사냥 시작, 박살, 바다의 물결, 날숨, 전탄 발사, 왕의 도약, 탈피, 만찬시간, 속박, 날카로운 이빨, 인내, 잎새의 보호).

화면은 전투 기획서 p.9 UI 와이어프레임의 10개 요소를 1920×1080 으로 환산해 그대로 배치합니다.

### 스테이지 (스테이지 기획서 / 1챕터 배치 조건)
- 15 스테이지: 1-1 스토리, 1-2 일반 고정, 1-14 스토리, 1-15 보스 고정
- 중간보스는 1-8~1-13 랜덤, 이벤트 4개는 1-3~1-13 랜덤 (3연속 금지), 나머지 일반 7
- 이벤트 하위 효과: 도박 25 / 이로운 45 / 해로운 20 / 일반 10 (%). 첫 이벤트는 이로운·도박만, 해로운은 챕터당 최대 2회, 중간보스 이후 해로운 제외

### 정비 화면 (정비 화면 기획서)
- 구현: 도감, 캐릭터 칸 1~5, 캐릭터 배치, 부활(50G), 맵, 골드, 상점(캐릭터 4종), 리롤(10G), 상점 닫기, 다음 스테이지. 상인은 안내자(CHR_901)
- **미구현(범위 외)**: 유물, 버프, 아이템(경험치), 칸 강화

## 데이터

| 파일 | 내용 | 손으로 고치나 |
| --- | --- | --- |
| `data/source/alpha02/characters.js` | 실험실 `characters.js` 원본 (그대로 복사) | 실험실이 갱신되면 교체 |
| `data/source/alpha02/app.reference.js` | 실험실 `app.js` 참고 사본 (판정 원문) | ✗ |
| `data/characters.js` | 위에서 변환한 42종 (역할군 5종, 잠금, 초상 경로) | ✗ 생성물 |
| `data/balance.js` | `RULES`: 실험실 설정값(HP 배수, 공격 계수, 최소 피해, 공통 스킬, 투지 획득, 회피율, 최대 턴) + 역할군 효과 + 적 배율·골드·이벤트 | ○ |
| `data/stages.js` | 챕터별 스테이지 수·고정 배치·랜덤 구간, 이벤트 확률/제약, 스토리 대사 | ○ |
| `data/enemies.js` | **적 편성 (임시)**. 확정 적 리스트를 받으면 이 파일만 교체 | ○ |
| `data/source/rocketmonster/` | 이전 로켓몬스터 마스터 표 보관 (현재 미사용) | – |

### 실험실 데이터가 바뀌었을 때
```bash
curl -o data/source/alpha02/characters.js https://kimkumo.github.io/FurryUp-BattleSimulator/characters.js
node tools/import-alpha02.js
node tests/engine.test.js
```
새 스킬 id 가 추가되면 `src/core/battle.js` 의 `executeSkill` / 패시브 분기에 판정을 더해야 합니다. 잠금 12종은 변환기의 `LOCKED` 에서 바꿉니다.

### 적 리스트 넣는 법 (`data/enemies.js`)
```js
window.ENEMY_FORMATIONS = {
  3: [ { id: 'CHR_012' }, { id: 'CHR_021', hp: 80, atk: 7 } ],            // 배열 순서 = 편성 순서
  15: [ { id: 'CHR_012', name: '들판의 폭군', boss: true }, ... ],
};
```
고정 편성이 없는 스테이지는 `ENEMY_POOL` + `ENEMY_COUNT_BY_STAGE` 규칙으로 랜덤 생성됩니다.
적 능력치 = 실험실 값 × 0.85 × (1 + 0.035 × (스테이지 − 1)), 중간보스 HP×1.8, 보스 HP×3.0 (`data/balance.js` ENEMY).

## 구조

```
index.html            진입점 (스크립트 로드 순서)
vendor/phaser.min.js  Phaser 3.80.1
assets/characters/    CHR_xxx_ST_F.png (서 있는 앞모습) / CHR_xxx_PT.png (초상) 43종
data/                 데이터 (위 표)
tools/import-alpha02.js         실험실 characters.js -> data/characters.js 변환기
tools/legacy/                   이전 로켓몬스터 표 변환기 (미사용)
src/core/             렌더링과 분리된 순수 로직
  rng.js              시드 난수
  stagegen.js         스테이지 배치 / 이벤트 하위 효과 결정
  battle.js           전투 엔진 α-02 (턴 → 이벤트 배열)
  run.js              런 상태 (보유/편성/골드/상점/부활/이벤트 효과)
src/ui/theme.js       공용 UI 헬퍼
src/flow.js           씬 전환 규칙
src/scenes/           Boot / Title(아웃게임) / Pick / Formation / Battle / Story / Event / Shop
tests/engine.test.js  단위 테스트 (node)
```

## 테스트

```bash
node tests/engine.test.js
```
데이터 변환, 스테이지 배치 제약, 피해식, 행동 순서, 대상 선택, 역할군 5종, 공통 스킬, 문서 반영 패시브·스킬 7종, 42종 실데이터 전투, 상점/부활/이벤트를 검증합니다.

## 디버그 팁

- 콘솔에서 `game.registry.get('run')` 으로 현재 런 상태(골드, 편성, 스테이지 목록, 시드) 확인
- 전투 중 `game.scene.getScene('BattleScene').battle` 로 유닛 상태(투지, 상태이상, 차지) 확인
- 전투 화면 설정(⚙) 팝업에 현재 규칙 요약이 표시됩니다
