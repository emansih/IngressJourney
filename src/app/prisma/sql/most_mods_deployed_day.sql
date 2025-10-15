SELECT 
    DATE(event_time) AS day,
    COUNT(*) AS mod_count
FROM 
    public.gamelog
WHERE 
    action = 'mod deployed'
GROUP BY 
    DATE(event_time)
ORDER BY 
    mod_count DESC
LIMIT 1;
