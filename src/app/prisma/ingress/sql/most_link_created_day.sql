SELECT 
    DATE(event_time) AS day,
    COUNT(*) AS link_count
FROM 
    public.gamelog
WHERE 
    action = 'created link'
GROUP BY 
    DATE(event_time)
ORDER BY 
    link_count DESC
LIMIT 1;
