-- SIK — 상품 문의(Q&A) · 구매 후기 · 사장님 카톡 알림
-- 브라우저는 표를 직접 못 건드리고 아래 함수만 부른다. 비밀번호는 해시(pgcrypto)로만 저장한다.

create extension if not exists pg_net;

-- ── 상품 문의 ───────────────────────────────────────────────
create table if not exists public.qna (
  id bigserial primary key,
  product_id text not null,
  author text not null,                    -- 화면엔 첫 글자만 보이게 가린다
  pw_hash text not null,                   -- 비밀글 확인·삭제용 4자리 이상 비밀번호 (해시)
  is_private boolean not null default false,
  question text not null,
  answer text,
  answered_at timestamptz,
  hidden boolean not null default false,   -- 관리자가 숨긴 글 (스팸 등)
  created_at timestamptz not null default now()
);
create index if not exists qna_product_idx on public.qna (product_id, created_at desc);
alter table public.qna enable row level security;
drop policy if exists "관리자는 문의를 본다" on public.qna;
create policy "관리자는 문의를 본다" on public.qna for select using (public.is_admin());

create or replace function public._mask(n text) returns text language sql immutable as $$
  select left(coalesce(n, ''), 1) || repeat('*', greatest(char_length(coalesce(n, '')) - 1, 1));
$$;

-- 상품의 문의 목록. 비밀글은 내용 대신 null
create or replace function public.qna_list(p_product_id text)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
      'id', id, 'author', _mask(author), 'is_private', is_private, 'created_at', created_at,
      'question', case when is_private then null else question end,
      'answer', case when is_private then null else answer end,
      'answered', answer is not null) order by created_at desc), '[]'::jsonb)
  from qna where product_id = p_product_id and not hidden;
$$;

create or replace function public.qna_ask(p_product_id text, p_author text, p_password text, p_question text, p_private boolean)
returns bigint language plpgsql security definer set search_path = public, extensions as $$
declare v_id bigint;
begin
  if not exists (select 1 from products where id = p_product_id) then raise exception 'SIK:NO_PRODUCT:%', p_product_id; end if;
  if length(trim(coalesce(p_author, ''))) not between 1 and 20 then raise exception 'SIK:QNA:author'; end if;
  if length(coalesce(p_password, '')) not between 4 and 20 then raise exception 'SIK:QNA:password'; end if;
  if length(trim(coalesce(p_question, ''))) not between 2 and 1000 then raise exception 'SIK:QNA:question'; end if;
  -- 도배 방지: 같은 상품에 1분 안에 3개 넘게 못 쓴다
  if (select count(*) from qna where product_id = p_product_id and created_at > now() - interval '1 minute') >= 3 then raise exception 'SIK:QNA:slow'; end if;
  insert into qna (product_id, author, pw_hash, is_private, question)
  values (p_product_id, trim(p_author), crypt(p_password, gen_salt('bf')), coalesce(p_private, false), trim(p_question))
  returning id into v_id;
  return v_id;
end $$;

-- 비밀글 열어보기 (작성할 때 정한 비밀번호)
create or replace function public.qna_view(p_id bigint, p_password text)
returns jsonb language sql stable security definer set search_path = public, extensions as $$
  select jsonb_build_object('question', question, 'answer', answer)
  from qna where id = p_id and not hidden and pw_hash = crypt(coalesce(p_password, ''), pw_hash);
$$;

-- 관리자 답변 · 숨기기
create or replace function public.qna_admin(p_id bigint, p_answer text, p_hidden boolean default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'SIK:FORBIDDEN:'; end if;
  update qna set
    answer = case when p_answer is null then answer when trim(p_answer) = '' then null else trim(p_answer) end,
    answered_at = case when p_answer is null then answered_at when trim(p_answer) = '' then null else now() end,
    hidden = coalesce(p_hidden, hidden)
  where id = p_id;
end $$;

-- ── 구매 후기 ───────────────────────────────────────────────
-- 배송이 시작된 주문의 상품만 쓸 수 있다 (주문번호 + 주문 휴대폰 번호, 또는 그 주문의 카카오 회원)
create table if not exists public.reviews (
  id bigserial primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  option text not null default '',
  author text not null,
  rating int not null check (rating between 1 and 5),
  body text not null,
  photos text[] not null default '{}',     -- review-photos 저장소의 공개 주소
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  unique (order_id, product_id, option)
);
create index if not exists reviews_product_idx on public.reviews (product_id, created_at desc);
alter table public.reviews enable row level security;
drop policy if exists "관리자는 후기를 본다" on public.reviews;
create policy "관리자는 후기를 본다" on public.reviews for select using (public.is_admin());

create or replace function public.review_list(p_product_id text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'count', count(*), 'avg', round(avg(rating)::numeric, 1),
    'items', coalesce(jsonb_agg(jsonb_build_object('id', id, 'author', _mask(author), 'rating', rating, 'body', body,
               'photos', photos, 'option', option, 'created_at', created_at) order by created_at desc), '[]'::jsonb))
  from reviews where product_id = p_product_id and not hidden;
$$;

-- 후기를 쓸 수 있는 품목 찾기
create or replace function public._review_order(p_order_no text, p_phone text)
returns orders language plpgsql stable security definer set search_path = public as $$
declare o orders%rowtype;
begin
  select * into o from orders where order_no = upper(trim(p_order_no))
    and (phone = regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g') or (auth.uid() is not null and user_id = auth.uid()));
  return o;
end $$;
revoke all on function public._review_order(text, text) from public, anon, authenticated;

create or replace function public.review_targets(p_order_no text, p_phone text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare o orders%rowtype;
begin
  o := _review_order(p_order_no, p_phone);
  if o.id is null then return jsonb_build_object('ok', false, 'code', 'NO_ORDER'); end if;
  if o.status not in ('shipped', 'delivered') then return jsonb_build_object('ok', false, 'code', 'NOT_SHIPPED'); end if;
  return jsonb_build_object('ok', true, 'items', (
    select jsonb_agg(jsonb_build_object('product_id', i.product_id, 'option', i.option, 'name', i.name,
             'done', exists (select 1 from reviews r where r.order_id = o.id and r.product_id = i.product_id and r.option = i.option)) order by i.id)
    from order_items i where i.order_id = o.id));
end $$;

create or replace function public.review_create(p_order_no text, p_phone text, p_product_id text, p_option text,
                                                p_author text, p_rating int, p_body text, p_photos text[])
returns bigint language plpgsql security definer set search_path = public as $$
declare o orders%rowtype; v_id bigint;
begin
  o := _review_order(p_order_no, p_phone);
  if o.id is null then raise exception 'SIK:NO_ORDER:'; end if;
  if o.status not in ('shipped', 'delivered') then raise exception 'SIK:NOT_SHIPPED:'; end if;
  if not exists (select 1 from order_items where order_id = o.id and product_id = p_product_id and option = coalesce(p_option, '')) then raise exception 'SIK:NO_PRODUCT:%', p_product_id; end if;
  if p_rating not between 1 and 5 then raise exception 'SIK:REVIEW:rating'; end if;
  if length(trim(coalesce(p_body, ''))) not between 5 and 2000 then raise exception 'SIK:REVIEW:body'; end if;
  -- 사진은 우리 저장소 주소만, 최대 4장
  if coalesce(array_length(p_photos, 1), 0) > 4 then raise exception 'SIK:REVIEW:photos'; end if;
  if exists (select 1 from unnest(coalesce(p_photos, '{}')) u where u !~ '^https://[a-z0-9]+\.supabase\.co/storage/v1/object/public/review-photos/') then raise exception 'SIK:REVIEW:photos'; end if;
  insert into reviews (order_id, product_id, option, author, rating, body, photos)
  values (o.id, p_product_id, coalesce(p_option, ''), coalesce(nullif(trim(p_author), ''), o.buyer_name), p_rating, trim(p_body), coalesce(p_photos, '{}'))
  returning id into v_id;
  return v_id;
exception when unique_violation then raise exception 'SIK:REVIEW:dup';
end $$;

create or replace function public.review_admin(p_id bigint, p_hidden boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'SIK:FORBIDDEN:'; end if;
  update reviews set hidden = p_hidden where id = p_id;
end $$;

-- 후기 사진 저장소: 누구나 볼 수 있고, 올리기는 reviews/ 아래 이미지만 (크기 3MB 제한은 버킷 설정)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('review-photos', 'review-photos', true, 3145728, array['image/jpeg', 'image/webp', 'image/png'])
on conflict (id) do update set public = true, file_size_limit = 3145728, allowed_mime_types = array['image/jpeg', 'image/webp', 'image/png'];
drop policy if exists "후기 사진 올리기" on storage.objects;
create policy "후기 사진 올리기" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'review-photos' and (storage.foldername(name))[1] = 'reviews');

-- ── 사장님 카톡 알림 ────────────────────────────────────────
-- 카톡 '나에게 보내기' 토큰과, 서버 함수를 부를 때 쓰는 비밀값. 브라우저에서는 절대 못 읽는다 (정책 없음 = 전부 막힘)
create table if not exists public.notify_config (
  id int primary key default 1 check (id = 1),
  hook_secret text not null default encode(extensions.gen_random_bytes(24), 'hex'),
  kakao_refresh text,
  kakao_access text,
  kakao_access_until timestamptz,
  kakao_connected_at timestamptz,
  enabled boolean not null default true
);
insert into public.notify_config (id) values (1) on conflict do nothing;
alter table public.notify_config enable row level security;

-- 알림 보내기: 서버 함수(notify)에 '무슨 일이 생겼는지'만 넘긴다. 실패해도 주문은 그대로 진행된다.
create or replace function public._notify(p_kind text, p_ref text)
returns void language plpgsql security definer set search_path = public as $$
declare c notify_config%rowtype;
begin
  select * into c from notify_config where id = 1;
  if c.kakao_refresh is null or not c.enabled then return; end if;
  perform net.http_post(
    url := 'https://dotbjjvcetbpcxpsjgxi.supabase.co/functions/v1/notify',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-sik-hook', c.hook_secret),
    body := jsonb_build_object('kind', p_kind, 'ref', p_ref));
exception when others then null;
end $$;
revoke all on function public._notify(text, text) from public, anon, authenticated;

-- 주문: 무통장 주문 접수(입금 대기) · 결제 완료 때
create or replace function public._order_notify() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- ① 무통장 주문 접수: create_order 가 넣은 뒤 금액을 채우는 update 순간 (금액 0 → 확정)
  -- ② 카드·간편결제 결제 완료. 관리자가 직접 누른 무통장 '입금 확인'은 알리지 않는다
  if (new.status = 'awaiting_deposit' and old.amount = 0 and new.amount > 0)
     or (new.status = 'paid' and old.status <> 'paid' and new.pay_method <> 'bank') then
    perform _notify('order', new.order_no);
  end if;
  return new;
end $$;
drop trigger if exists orders_notify on public.orders;
-- create_order 는 넣은 뒤 금액을 update 하므로, 금액이 확정된 update 시점에 보낸다
create trigger orders_notify after update on public.orders for each row execute function public._order_notify();

create or replace function public._qna_notify() returns trigger
language plpgsql security definer set search_path = public as $$
begin perform _notify('qna', new.id::text); return new; end $$;
drop trigger if exists qna_notify on public.qna;
create trigger qna_notify after insert on public.qna for each row execute function public._qna_notify();

create or replace function public._review_notify() returns trigger
language plpgsql security definer set search_path = public as $$
begin perform _notify('review', new.id::text); return new; end $$;
drop trigger if exists review_notify on public.reviews;
create trigger review_notify after insert on public.reviews for each row execute function public._review_notify();

-- 관리자 화면: 카톡 알림 연결 상태
create or replace function public.notify_status()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'SIK:FORBIDDEN:'; end if;
  return (select jsonb_build_object('connected', kakao_refresh is not null, 'connected_at', kakao_connected_at, 'enabled', enabled) from notify_config where id = 1);
end $$;

-- 브라우저가 부를 수 있는 것
grant execute on function public.qna_list(text), public.qna_ask(text, text, text, text, boolean), public.qna_view(bigint, text),
  public.review_list(text), public.review_targets(text, text), public.review_create(text, text, text, text, text, int, text, text[]) to anon, authenticated;
grant execute on function public.qna_admin(bigint, text, boolean), public.review_admin(bigint, boolean), public.notify_status() to authenticated;
