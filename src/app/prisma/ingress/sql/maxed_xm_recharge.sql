  SELECT 
    DATE("time") AS recharge_date,
    SUM(value) AS total_xm
  FROM xm_recharged
  GROUP BY recharge_date
  ORDER BY total_xm DESC
  LIMIT 1;
