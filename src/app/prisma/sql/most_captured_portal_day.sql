SELECT 
    DATE(event_time) AS day,
    COUNT(*) AS captured_count
FROM 
    public.gamelog_new
WHERE 
    action = 'captured portal'
GROUP BY 
    DATE(event_time)
ORDER BY 
    captured_count DESC
LIMIT 1;
