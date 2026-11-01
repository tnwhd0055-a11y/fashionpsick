-- SIK 자체 주문 — 관리자 화면에서 상품 가격·재고와 배송비·계좌 설정을 고칠 수 있게
-- (001_shop.sql 의 create_order 가 아래 shipping_fee_for 를 쓴다 — 이 파일을 001 보다 먼저 한 번 적용해야 한다)

-- 도서산간: 우편번호 구간 목록 "40200-40240, 23100-23136" 형식. 택배사 계약 때 받는 도서산간 목록으로 채운다.
alter table public.settings add column if not exists remote_extra_fee int not null default 3000;
alter table public.settings add column if not exists remote_zips text not null default '40200-40240';   -- 기본값: 울릉군

-- 배송비 계산 — 주문 만들기와 화면 표시가 같은 규칙을 쓴다
create or replace function public.is_remote_zip(p_zip text, p_ranges text)
returns boolean language plpgsql immutable as $$
declare r text; a int; b int; z int;
begin
  if p_zip !~ '^[0-9]{5}$' then return false; end if;
  z := p_zip::int;
  foreach r in array regexp_split_to_array(coalesce(p_ranges, ''), '\s*,\s*') loop
    r := trim(r);
    if r ~ '^[0-9]{5}$' then a := r::int; b := a;
    elsif r ~ '^[0-9]{5}\s*-\s*[0-9]{5}$' then a := split_part(r, '-', 1)::int; b := trim(split_part(r, '-', 2))::int;
    else continue; end if;
    if z between a and b then return true; end if;
  end loop;
  return false;
end $$;

create or replace function public.shipping_fee_for(p_sum int, p_zip text)
returns int language sql stable security definer set search_path = public as $$
  select (case when p_sum >= s.free_shipping_over then 0 else s.shipping_fee end)
       + (case when coalesce(p_zip, '') like '63%' then s.jeju_extra_fee
               when public.is_remote_zip(p_zip, s.remote_zips) then s.remote_extra_fee else 0 end)
  from settings s where s.id = 1;
$$;

-- 화면 표시용 배송 규칙 (계좌 등 나머지 설정은 공개하지 않는다)
create or replace function public.shipping_rules()
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object('fee', shipping_fee, 'freeOver', free_shipping_over, 'jeju', jeju_extra_fee,
                            'remote', remote_extra_fee, 'remoteZips', remote_zips)
  from settings where id = 1;
$$;
grant execute on function public.shipping_rules() to anon, authenticated;

-- 관리자는 설정을 고칠 수 있다
drop policy if exists "관리자는 설정을 고친다" on public.settings;
create policy "관리자는 설정을 고친다" on public.settings for update using (public.is_admin()) with check (public.is_admin());
