SELECT mu.time, mu.value, g.event_time, 
    g.action,     
    ST_Y(g.location::geometry) AS lat,
    ST_X(g.location::geometry) AS lon
FROM mind_units_controlled AS mu
    INNER JOIN gamelog_new AS g
      ON g.event_time = mu.time
    AND g.action = 'created link'
    ORDER BY mu.value DESC
    LIMIT 1
