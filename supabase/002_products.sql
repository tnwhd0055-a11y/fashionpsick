-- 상품 가격·재고 초기값. 가격은 data.js 와 같다.
-- 재고는 2026-08 기준 메모(셔츠 M2/L4/XL4 · 목걸이 · 벨트 4)라 실제와 다를 수 있다 → Supabase Table Editor 에서 고치면 된다.
-- 이미 있는 줄은 이름·가격만 맞추고 재고는 건드리지 않는다.
insert into public.products (id, option, name, price, stock, active, sort) values
  ('stone-bead',          '',           'EP.1 내추럴 스톤 비즈 목걸이',   19900, 10, true, 10),
  ('blackpoint-necklace', '',           '플라티즈마 블랙 비즈 목걸이',     19900, 10, true, 20),
  ('mesh-shirt',          'M',          '델토이드 메쉬 반팔 셔츠',         29900,  2, true, 30),
  ('mesh-shirt',          'L',          '델토이드 메쉬 반팔 셔츠',         29900,  4, true, 31),
  ('mesh-shirt',          'XL',         '델토이드 메쉬 반팔 셔츠',         29900,  4, true, 32),
  ('semicrop-tee',        'Black',      '세미크롭 반팔 티셔츠',            18900,  0, true, 40),
  ('semicrop-tee',        'Light Grey', '세미크롭 반팔 티셔츠',            18900,  0, true, 41),
  ('semicrop-tee-2pack',  '',           '세미크롭 반팔 티셔츠 [2-PACK]',   29900,  0, true, 50),
  ('western-belt',        '',           '웨이스트 웨스턴 벨트',            24900,  4, true, 60)
on conflict (id, option) do update set name = excluded.name, price = excluded.price, sort = excluded.sort;
