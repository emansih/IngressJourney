SELECT 
    DATE(event_time) AS day,
    COUNT(*) AS destroyed_count
FROM 
    public.gamelog
WHERE 
    action = 'resonator destroyed'
GROUP BY 
    DATE(event_time)
ORDER BY 
    destroyed_count DESC
LIMIT 1;
