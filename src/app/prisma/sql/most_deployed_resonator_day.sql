SELECT 
    DATE(event_time) AS day,
    COUNT(*) AS resonator_count
FROM 
    public.gamelog_new
WHERE 
    action = 'resonator deployed'
GROUP BY 
    DATE(event_time)
ORDER BY 
    resonator_count DESC
LIMIT 1;
