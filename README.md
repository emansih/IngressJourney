

This project is set out to explore your Ingress journey over the years. To run the software locally, make sure you have the following installed

- PostgreSQL
- NodeJS


You will have also have to get a Google Maps API key and Map ID(https://developers.google.com/maps/documentation/javascript/map-ids/mapid-over).

Populate `.env.sample` file with your environment variables.

To run the software, 

```
npm install 
npm run dev
```


To populate your database, email Niantic Spatial for your data. 


```
To: `privacy@nianticspatial.com`
Subject: Dump data request
Body: 

Dear Sir / Madam,

I'd like to request a dump of the raw data Niantic stores about my Ingress account @<YOUR_IGN_HERE>, as regulated under GDPR.

Yours sincerely,
YOUR_NAME_HERE
```

It will take about a month for Niantic Spatial to get back to you. 


The `scripts` directory contains neccessary SQL queries to setup the DB. 