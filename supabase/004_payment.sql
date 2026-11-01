-- SIK 자체 주문 — 2단계: 간편결제·카드(포트원) 결제 확정
-- 서버 함수(supabase/functions/portone)가 포트원에 실제 결제 내역을 물어본 뒤에만 부른다.
-- 브라우저에서는 부를 수 없다 (service_role 전용).

-- 결제 금액이 주문 금액과 같으면 '결제 완료'. 다르면 'MISMATCH' 를 돌려주고 함수가 결제를 취소한다.
create or replace function public.confirm_payment(p_order_no text, p_payment_id text, p_paid_amount int, p_method text)
returns text language plpgsql security definer set search_path = public as $$
declare o orders%rowtype;
begin
  select * into o from orders where order_no = p_order_no for update;
  if not found then return 'NO_ORDER'; end if;
  if o.status = 'paid' and o.payment_id = p_payment_id then return 'ALREADY'; end if;   -- 웹훅과 화면이 둘 다 부를 수 있다
  if o.status <> 'pending' then return 'BAD_STATUS:' || o.status; end if;
  if o.amount <> p_paid_amount then return 'MISMATCH'; end if;
  update orders set status = 'paid', paid_at = now(), payment_id = p_payment_id,
         pay_method = case when p_method in ('kakaopay','naverpay','card') then p_method else pay_method end
   where id = o.id;
  return 'PAID';
end $$;

-- 금액이 안 맞거나 결제를 못 한 주문은 바로 취소하고 재고를 되돌린다
create or replace function public.fail_payment(p_order_no text, p_note text)
returns void language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  select id into v_id from orders where order_no = p_order_no and status = 'pending';
  if found then perform _cancel_order(v_id, p_note); end if;
end $$;

revoke all on function public.confirm_payment(text, text, int, text) from public, anon, authenticated;
revoke all on function public.fail_payment(text, text) from public, anon, authenticated;
grant execute on function public.confirm_payment(text, text, int, text) to service_role;
grant execute on function public.fail_payment(text, text) to service_role;

-- 관리자 환불 — 서버 함수가 포트원 결제 취소에 성공한 뒤에 부른다. 발송 전(결제 완료) 주문만 재고를 되돌린다.
create or replace function public.refund_order(p_order_no text, p_note text default '')
returns text language plpgsql security definer set search_path = public as $$
declare o orders%rowtype;
begin
  select * into o from orders where order_no = p_order_no for update;
  if not found then return 'NO_ORDER'; end if;
  if o.status = 'paid' then
    update products p set stock = p.stock + i.qty from order_items i
     where i.order_id = o.id and p.id = i.product_id and p.option = i.option;
  end if;
  update orders set status = 'refunded', cancelled_at = now(), admin_note = trim(admin_note || ' ' || coalesce(p_note, '')) where id = o.id;
  return 'REFUNDED';
end $$;
revoke all on function public.refund_order(text, text) from public, anon, authenticated;
grant execute on function public.refund_order(text, text) to service_role;
