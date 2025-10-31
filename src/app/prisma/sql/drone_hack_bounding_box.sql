SELECT DISTINCT ON (latitude, longitude) 
    id, 
    latitude, 
    longitude, 
    event_time
FROM gamelog
WHERE action = 'drone moved'
  AND ST_Within(
    geometry,
    ST_MakeEnvelope($1, $2, $3, $4, 4326)
  )
ORDER BY latitude, longitude, event_time;
