

\copy store_purchases("Time", "Transaction Type", "Item", "New CMU balance", "Transaction Description")
FROM 'store_purchases.tsv'
DELIMITER E'\t' CSV HEADER;

