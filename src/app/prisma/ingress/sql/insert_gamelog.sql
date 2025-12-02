 INSERT INTO "gamelog"("event_time", "action", "comment", "location")
        SELECT 
            unnest($1::timestamptz[]),
            unnest($2::text[]),
            unnest($3::text[]),
            ST_SetSRID(ST_MakePoint(
                unnest($4::float8[]),
                unnest($5::float8[])
            ), 4326)::geography