-- SIK 자체 주문 — 1단계: 상품·주문 표, 주문 만들기, 주문 조회, 관리자 처리
-- 설계: 패피식 1억 쇼핑몰/docs/자체몰-주문결제-설계.md
-- 적용: node "패피식 1억 쇼핑몰/scripts/shop/apply.mjs" supabase/001_shop.sql  (여러 번 돌려도 안전하게 작성)
--
-- 원칙: 가격·재고·배송비는 전부 DB 가 정한다. 브라우저가 보낸 금액은 믿지 않는다.
--       브라우저는 표를 직접 읽고 쓰지 못하고, 아래 함수만 부를 수 있다.

-- ── 설정 (한 줄짜리) ─────────────────────────────────────────
create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  shipping_fee int not null default 3000,          -- 스마트스토어와 같게 (scripts/naver-upload.mjs)
  free_shipping_over int not null default 30000,
  jeju_extra_fee int not null default 2000,        -- 제주(우편번호 63xxx). 도서산간 목록은 아직 없음
  bank_name text not null default '',
  bank_account text not null default '',
  bank_holder text not null default '',
  deposit_days int not null default 3
);
insert into public.settings (id) values (1) on conflict do nothing;

-- ── 상품 (가격·재고의 기준) ─────────────────────────────────
-- id 는 사이트 data.js 의 product.id 와 같다. option 은 사이즈·색 (없으면 '').
create table if not exists public.products (
  id text not null,
  option text not null default '',
  name text not null,
  price int not null check (price >= 0),
  stock int not null default 0 check (stock >= 0),
  active boolean not null default true,
  sort int not null default 0,
  primary key (id, option)
);

-- ── 주문 ────────────────────────────────────────────────────
create sequence if not exists public.order_seq;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text unique not null,
  status text not null check (status in ('pending','awaiting_deposit','paid','shipped','delivered','cancelled','refunded')),
  pay_method text not null check (pay_method in ('bank','kakaopay','naverpay','card')),
  items_amount int not null default 0,
  shipping_fee int not null default 0,
  amount int not null default 0,
  buyer_name text not null,
  phone text not null,                 -- 숫자만 저장 (01012345678)
  zipcode text not null,
  address1 text not null,
  address2 text not null default '',
  memo text not null default '',
  depositor text not null default '',
  deposit_deadline timestamptz,
  payment_id text,                     -- 포트원 결제 id (2단계)
  courier text not null default '',
  tracking_no text not null default '',
  kakao_id text,
  privacy_agreed_at timestamptz not null,
  admin_note text not null default '',
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  shipped_at timestamptz,
  cancelled_at timestamptz
);
create index if not exists orders_status_idx on public.orders (status, created_at desc);

create table if not exists public.order_items (
  id bigserial primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  option text not null default '',
  name text not null,                  -- 주문 당시 이름·가격을 그대로 남긴다
  unit_price int not null,
  qty int not null check (qty between 1 and 10)
);
create index if not exists order_items_order_idx on public.order_items (order_id);

-- ── 관리자 ──────────────────────────────────────────────────
-- Supabase Auth 로 로그인한 계정 중 이 표에 있는 사람만 주문을 볼 수 있다.
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- ── 잠금 (RLS) ──────────────────────────────────────────────
alter table public.settings enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admins enable row level security;

drop policy if exists "상품은 누구나 본다" on public.products;
create policy "상품은 누구나 본다" on public.products for select using (true);
drop policy if exists "관리자는 상품을 고친다" on public.products;
create policy "관리자는 상품을 고친다" on public.products for update using (public.is_admin());
drop policy if exists "관리자는 설정을 본다" on public.settings;
create policy "관리자는 설정을 본다" on public.settings for select using (public.is_admin());
drop policy if exists "관리자는 주문을 본다" on public.orders;
create policy "관리자는 주문을 본다" on public.orders for select using (public.is_admin());
drop policy if exists "관리자는 주문 품목을 본다" on public.order_items;
create policy "관리자는 주문 품목을 본다" on public.order_items for select using (public.is_admin());
drop policy if exists "관리자 본인 확인" on public.admins;
create policy "관리자 본인 확인" on public.admins for select using (user_id = auth.uid());

-- ── 주문 만들기 ─────────────────────────────────────────────
-- p_items: [{"id":"mesh-shirt","option":"L","qty":1}, ...]
-- p_buyer: {"name","phone","zipcode","address1","address2","memo","depositor","privacy_agreed":true}
-- 에러는 'SIK:코드:내용' 형태 — 사이트가 코드를 보고 한국어 안내를 띄운다.
create or replace function public.create_order(p_items jsonb, p_buyer jsonb, p_pay_method text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  s settings%rowtype;
  v_id uuid;
  v_no text;
  v_sum int := 0;
  v_fee int;
  v_it jsonb;
  v_p products%rowtype;
  v_qty int;
  v_phone text := regexp_replace(coalesce(p_buyer->>'phone', ''), '[^0-9]', '', 'g');
  v_zip text := coalesce(p_buyer->>'zipcode', '');
  v_status text;
  v_deadline timestamptz;
begin
  if p_pay_method not in ('bank','kakaopay','naverpay','card') then raise exception 'SIK:PAY_METHOD:'; end if;
  if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) not between 1 and 20 then raise exception 'SIK:EMPTY_CART:'; end if;
  if length(trim(coalesce(p_buyer->>'name', ''))) not between 1 and 30 then raise exception 'SIK:BUYER:name'; end if;
  if v_phone !~ '^01[016789][0-9]{7,8}$' then raise exception 'SIK:BUYER:phone'; end if;
  if v_zip !~ '^[0-9]{5}$' then raise exception 'SIK:BUYER:zipcode'; end if;
  if length(trim(coalesce(p_buyer->>'address1', ''))) not between 1 and 200 then raise exception 'SIK:BUYER:address1'; end if;
  if length(coalesce(p_buyer->>'address2', '')) > 100 or length(coalesce(p_buyer->>'memo', '')) > 200 then raise exception 'SIK:BUYER:long'; end if;
  if p_pay_method = 'bank' and length(trim(coalesce(p_buyer->>'depositor', ''))) not between 1 and 30 then raise exception 'SIK:BUYER:depositor'; end if;
  if coalesce((p_buyer->>'privacy_agreed')::boolean, false) is not true then raise exception 'SIK:PRIVACY:'; end if;

  select * into s from settings where id = 1;
  if p_pay_method = 'bank' then
    v_status := 'awaiting_deposit';
    v_deadline := now() + make_interval(days => s.deposit_days);
  else
    v_status := 'pending';
  end if;
  v_no := 'SIK-' || to_char(now() at time zone 'Asia/Seoul', 'YYMMDD') || '-' || lpad(nextval('order_seq')::text, 4, '0');

  insert into orders (order_no, status, pay_method, buyer_name, phone, zipcode, address1, address2, memo,
                      depositor, deposit_deadline, privacy_agreed_at)
  values (v_no, v_status, p_pay_method, trim(p_buyer->>'name'), v_phone, v_zip, trim(p_buyer->>'address1'),
          trim(coalesce(p_buyer->>'address2', '')), trim(coalesce(p_buyer->>'memo', '')),
          trim(coalesce(p_buyer->>'depositor', '')), v_deadline, now())
  returning id into v_id;

  for v_it in select * from jsonb_array_elements(p_items) loop
    v_qty := nullif(v_it->>'qty', '')::int;
    if v_qty is null or v_qty not between 1 and 10 then raise exception 'SIK:QTY:'; end if;
    select * into v_p from products
      where id = v_it->>'id' and option = coalesce(v_it->>'option', '') and active
      for update;
    if not found then raise exception 'SIK:NO_PRODUCT:%', v_it->>'id'; end if;
    if v_p.stock < v_qty then raise exception 'SIK:SOLD_OUT:%', trim(v_p.name || ' ' || v_p.option); end if;
    update products set stock = stock - v_qty where id = v_p.id and option = v_p.option;
    insert into order_items (order_id, product_id, option, name, unit_price, qty)
      values (v_id, v_p.id, v_p.option, v_p.name, v_p.price, v_qty);
    v_sum := v_sum + v_p.price * v_qty;
  end loop;

  v_fee := case when v_sum >= s.free_shipping_over then 0 else s.shipping_fee end
         + case when v_zip like '63%' then s.jeju_extra_fee else 0 end;
  update orders set items_amount = v_sum, shipping_fee = v_fee, amount = v_sum + v_fee where id = v_id;

  return jsonb_build_object(
    'order_no', v_no, 'status', v_status, 'pay_method', p_pay_method,
    'items_amount', v_sum, 'shipping_fee', v_fee, 'amount', v_sum + v_fee,
    'deposit_deadline', v_deadline,
    'bank', case when p_pay_method = 'bank'
                 then jsonb_build_object('name', s.bank_name, 'account', s.bank_account, 'holder', s.bank_holder) end);
end $$;

-- ── 주문 조회 (주문번호 + 전화번호) ─────────────────────────
create or replace function public.lookup_order(p_order_no text, p_phone text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare o orders%rowtype; s settings%rowtype;
begin
  select * into o from orders
    where order_no = upper(trim(p_order_no))
      and phone = regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g');
  if not found then return null; end if;
  select * into s from settings where id = 1;
  return jsonb_build_object(
    'order_no', o.order_no, 'status', o.status, 'pay_method', o.pay_method,
    'items_amount', o.items_amount, 'shipping_fee', o.shipping_fee, 'amount', o.amount,
    'buyer_name', left(o.buyer_name, 1) || repeat('*', greatest(char_length(o.buyer_name) - 1, 1)),
    'address', o.address1,
    'courier', o.courier, 'tracking_no', o.tracking_no,
    'deposit_deadline', o.deposit_deadline,
    'bank', case when o.status = 'awaiting_deposit'
                 then jsonb_build_object('name', s.bank_name, 'account', s.bank_account, 'holder', s.bank_holder) end,
    'created_at', o.created_at, 'paid_at', o.paid_at, 'shipped_at', o.shipped_at,
    'items', (select jsonb_agg(jsonb_build_object('name', name, 'option', option, 'unit_price', unit_price, 'qty', qty) order by id)
              from order_items where order_id = o.id));
end $$;

-- ── 취소 (재고 원복) — 내부용 ───────────────────────────────
create or replace function public._cancel_order(p_id uuid, p_note text default '')
returns void language plpgsql security definer set search_path = public as $$
begin
  update products p set stock = p.stock + i.qty
    from order_items i
   where i.order_id = p_id and p.id = i.product_id and p.option = i.option
     and exists (select 1 from orders where id = p_id and status in ('pending','awaiting_deposit','paid'));
  update orders set status = 'cancelled', cancelled_at = now(),
         admin_note = trim(admin_note || ' ' || coalesce(p_note, ''))
   where id = p_id and status in ('pending','awaiting_deposit','paid');
end $$;
revoke all on function public._cancel_order(uuid, text) from public, anon, authenticated;

-- ── 관리자 처리 ─────────────────────────────────────────────
create or replace function public.admin_update_order(p_order_no text, p_action text, p_courier text default '', p_tracking text default '', p_note text default '')
returns jsonb language plpgsql security definer set search_path = public as $$
declare o orders%rowtype;
begin
  if not is_admin() then raise exception 'SIK:FORBIDDEN:'; end if;
  select * into o from orders where order_no = p_order_no for update;
  if not found then raise exception 'SIK:NO_ORDER:%', p_order_no; end if;

  if p_action = 'mark_paid' then
    if o.status <> 'awaiting_deposit' then raise exception 'SIK:BAD_STATUS:%', o.status; end if;
    update orders set status = 'paid', paid_at = now() where id = o.id;
  elsif p_action = 'ship' then
    if o.status not in ('paid','shipped') then raise exception 'SIK:BAD_STATUS:%', o.status; end if;
    if length(trim(coalesce(p_courier, ''))) = 0 or length(trim(coalesce(p_tracking, ''))) = 0 then raise exception 'SIK:TRACKING:'; end if;
    update orders set status = 'shipped', courier = trim(p_courier), tracking_no = regexp_replace(p_tracking, '[^0-9A-Za-z]', '', 'g'),
           shipped_at = coalesce(shipped_at, now()) where id = o.id;
  elsif p_action = 'deliver' then
    if o.status <> 'shipped' then raise exception 'SIK:BAD_STATUS:%', o.status; end if;
    update orders set status = 'delivered' where id = o.id;
  elsif p_action = 'cancel' then
    -- 카드·간편결제로 이미 결제된 주문은 포트원 환불(2단계)을 거쳐야 한다. 지금은 미결제·무통장만.
    if o.status = 'paid' and o.pay_method <> 'bank' then raise exception 'SIK:NEEDS_REFUND:'; end if;
    perform _cancel_order(o.id, p_note);
  elsif p_action = 'note' then
    update orders set admin_note = coalesce(p_note, '') where id = o.id;
  else
    raise exception 'SIK:ACTION:%', p_action;
  end if;
  select * into o from orders where id = o.id;
  return to_jsonb(o);
end $$;

-- ── 기한 지난 주문 자동 취소 ────────────────────────────────
-- 무통장: 입금 기한 초과 / 간편결제: 결제창만 열고 1시간 동안 결제 안 함
create or replace function public.expire_orders()
returns int language plpgsql security definer set search_path = public as $$
declare r record; n int := 0;
begin
  for r in select id from orders
            where (status = 'awaiting_deposit' and deposit_deadline < now())
               or (status = 'pending' and created_at < now() - interval '1 hour') loop
    perform _cancel_order(r.id, '[자동취소: 기한 초과]');
    n := n + 1;
  end loop;
  return n;
end $$;
revoke all on function public.expire_orders() from public, anon, authenticated;

-- 브라우저(anon)가 부를 수 있는 건 주문 만들기·조회뿐
revoke all on function public.create_order(jsonb, jsonb, text) from public;
revoke all on function public.lookup_order(text, text) from public;
revoke all on function public.admin_update_order(text, text, text, text, text) from public;
grant execute on function public.create_order(jsonb, jsonb, text) to anon, authenticated;
grant execute on function public.lookup_order(text, text) to anon, authenticated;
grant execute on function public.admin_update_order(text, text, text, text, text) to authenticated;
