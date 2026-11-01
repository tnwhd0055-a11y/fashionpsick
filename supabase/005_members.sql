-- SIK 자체 주문 — 3단계: 카카오 로그인 회원
-- 로그인한 손님이 주문하면 주문에 계정을 붙여서 '내 주문 내역'에서 볼 수 있게 한다. 비회원 주문은 그대로.

alter table public.orders add column if not exists user_id uuid references auth.users(id) on delete set null;
create index if not exists orders_user_idx on public.orders (user_id, created_at desc);

-- 주문 만들기에 계정 연결 — 로그인 토큰이 있으면 auth.uid() 가 들어온다 (없으면 null = 비회원)
create or replace function public._attach_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.user_id is null then new.user_id := auth.uid(); end if;
  return new;
end $$;
drop trigger if exists orders_attach_user on public.orders;
create trigger orders_attach_user before insert on public.orders for each row execute function public._attach_user();

-- 내 주문 내역 (로그인한 본인 것만)
create or replace function public.my_orders()
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
      'order_no', o.order_no, 'status', o.status, 'pay_method', o.pay_method, 'amount', o.amount,
      'courier', o.courier, 'tracking_no', o.tracking_no, 'created_at', o.created_at,
      'items', (select jsonb_agg(jsonb_build_object('name', i.name, 'option', i.option, 'qty', i.qty, 'unit_price', i.unit_price) order by i.id)
                from order_items i where i.order_id = o.id))
    order by o.created_at desc), '[]'::jsonb)
  from orders o where o.user_id = auth.uid() and auth.uid() is not null;
$$;
revoke all on function public.my_orders() from public, anon;
grant execute on function public.my_orders() to authenticated;
