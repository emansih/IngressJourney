SELECT 
  ST_Y(geometry) AS latitude,
  ST_X(geometry) AS longitude,
  COUNT(*) AS occurrences
FROM gamelog
WHERE action = 'captured portal'
GROUP BY geometry
ORDER BY occurrences DESC
LIMIT $1;
