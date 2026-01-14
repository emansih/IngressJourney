SELECT DISTINCT ON (b.id)
    ST_Y(g.location::geometry) AS lat,
    ST_X(g.location::geometry) AS lon
FROM beacon_battles b
    JOIN gamelog g ON g.event_time >= b.time
    AND g.event_time <= b.time + make_interval(secs => $1)
    AND ST_X(g.location::geometry) != 0
    AND ST_Y(g.location::geometry) != 0
    WHERE b.time BETWEEN $2 AND $3
ORDER BY b.id, g.event_time ASC
