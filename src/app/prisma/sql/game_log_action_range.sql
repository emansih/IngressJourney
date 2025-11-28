SELECT id,
    ST_Y(location::geometry) AS latitude,
    ST_X(location::geometry) AS longitude,
    event_time, action, comment
 FROM gamelog_new
WHERE event_time >= $1 AND event_time <= $2
  AND NOT (
        ST_Y(location::geometry) = 0
        AND ST_X(location::geometry) = 0
    )
    ORDER BY event_time ASC;
