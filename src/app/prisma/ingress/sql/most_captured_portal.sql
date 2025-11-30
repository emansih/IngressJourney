SELECT 
  ST_Y(location::geometry) AS latitude,
  ST_X(location::geometry) AS longitude,
  COUNT(*) AS occurrences
FROM gamelog_new
WHERE action = 'captured portal'
GROUP BY location
ORDER BY occurrences DESC
LIMIT $1;
