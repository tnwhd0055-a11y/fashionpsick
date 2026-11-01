-- 10분마다 기한 지난 주문을 자동 취소하고 재고를 되돌린다.
create extension if not exists pg_cron;
select cron.unschedule(jobid) from cron.job where jobname = 'sik-expire-orders';
select cron.schedule('sik-expire-orders', '*/10 * * * *', 'select public.expire_orders()');
