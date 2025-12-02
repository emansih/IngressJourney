 INSERT INTO "anomaly"("location", "timezone", "series_name", "site", "start_time", "end_time", "cover_photo") 
 VALUES (ST_SetSRID(ST_MakePoint($1::float8,$2::float8), 4326)::geography, $3,$4,$5,$6,$7,$8)
