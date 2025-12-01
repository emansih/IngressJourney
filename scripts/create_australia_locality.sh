ogr2ogr \
  -f "PostgreSQL" \
  PG:"host=localhost dbname=australia_locality user=postgres password=hunter2" \
  VICMAP_ADMIN.gdb \
  -nlt PROMOTE_TO_MULTI \
  -lco GEOMETRY_NAME=geom \
  -progress
