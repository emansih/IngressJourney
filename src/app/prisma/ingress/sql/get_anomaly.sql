SELECT  id,           
        ST_Y(location::geometry) AS latitude,
        ST_X(location::geometry) AS longitude,
        timezone, 
        series_name,
        site,
        start_time,
        end_time,
        cover_photo
FROM anomaly ORDER BY start_time ASC;