SELECT 
    DATE(event_time) AS day,
    COUNT(*) AS field_count
FROM 
    public.gamelog_new
WHERE 
    action = 'created field'
GROUP BY 
    DATE(event_time)
ORDER BY 
    field_count DESC
LIMIT 1;
