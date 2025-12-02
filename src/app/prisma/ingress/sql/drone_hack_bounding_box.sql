WITH moved AS (
        SELECT DISTINCT ON (location)
          id,
          ST_Y(location::geometry) AS latitude,
          ST_X(location::geometry) AS longitude,
          event_time
        FROM gamelog
        WHERE action = 'drone moved'
        AND ST_Within(
          location::geometry,
          ST_MakeEnvelope($1, $2, $3, $4, 4326)
        )
        ORDER BY location, event_time
)
  SELECT 
    h.id,
    ST_Y(h.location::geometry) AS lat,
    ST_X(h.location::geometry) AS lon,
    h.event_time AS first_seen_time
  FROM gamelog h
  JOIN moved m ON h.id = m.id + 1
  WHERE h.action LIKE 'hacked%'
  ORDER BY h.event_time;