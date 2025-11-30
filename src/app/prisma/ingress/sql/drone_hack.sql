      WITH moved AS (
        SELECT DISTINCT ON (latitude, longitude)
          id,
          latitude,
          longitude,
          event_time
        FROM gamelog
        WHERE action = 'drone moved'
        ORDER BY latitude, longitude, event_time
      )
      SELECT 
        h.id,
        h.latitude AS lat,
        h.longitude AS lon,
        h.event_time AS first_seen_time
      FROM gamelog h
      JOIN moved m ON h.id = m.id + 1
      WHERE h.action LIKE 'hacked%'
      ORDER BY h.event_time;
