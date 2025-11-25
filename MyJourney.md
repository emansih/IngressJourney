My journey while making the Ingress Journey application

### Gamelog

##### Time Travel

It appears that there is a bug between 2024-12-28 and 2025-01-01. The dates given has not occurred yet(Oct 2025)

2024-12-28 -> 2025-12-29 -> 2025-12-30 -> 2025-12-31 -> 2025-01-01


##### Data collection start dates

NIA only started saving user's action in gamelog on 2015-09-29.  


### Unique IDs

They aren't unique at all! In a couple of files, `beacon_battles.tsv`, `portal_guids_visited.tsv` and many others, the `Unique ID` column contain repeated values. If you are using a relational database to store and  analyse your data, **DO NOT** rely on those "unique" values. 


### Drone Hacks

NIA has not released a unique drone layer in the game as of writing(26 Nov 2025). I made a IITC plugin where you can view the unique portals that your drone has visited. 1 caveat is that, my software assumes that you hack the portal after moving the drone. If you were to do any other actions such as deploying modds, link, destroy resonators, deploy resonators, etc. the software will not consider it as a unique drone portal visited. 

