SELECT *
FROM gamelog
WHERE action = 'drone moved'
  AND ST_Within(
    geometry,
    ST_MakeEnvelope($1, $2, $3, $4, 4326)
  );