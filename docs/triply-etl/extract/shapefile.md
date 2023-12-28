[TOC]

## Shapefile extractor

The ESRI Shapefile format was developed by Esri (Environmental Systems Research Institute) for interoperability between Geographic Information Systems (GIS). An ESRI Shapefile is a ZIP with six files in it (file name extension `.shapefile.zip`).

*Currently only one of the file in a Shapefile ZIP file is supported: the `.shp` file.*



## Basic usage

The Shapefile extractor is imported in the following way:

```ts
import { fromShapefile, Source } from '@triplyetl/etl/generic'
```

The following code snippet extracts records from a local Shapefile:

```ts
fromShapefile(Source.file('example.shp'))
```

The following code snippet extracts records from a Shapefile that is stored as a TriplyDB Asset:

```ts
fromShapeFile(
  Source.TriplyDb.asset(
    'some-account',
    'some-dataset',
    { name: 'example.shp' }
  )
),
```



### Record representation

The following example record is obtained from a file called `nl_1km.shp` that is published by the [European Environment Agency](https://www.eea.europa.eu/data-and-maps/data/eea-reference-grids-2/gis-files/netherlands-shapefile):

```ts
{
  '$recordId': 1,
  '$environment': 'Development',
  '$fileName': 'nl_1km.shp',    
  type: 'Feature',
  properties: {
    CELLCODE: '1kmE3793N3217',
    EOFORIGIN: 3793000,       
    NOFORIGIN: 3217000        
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [ 3793000, 3217000 ],
        [ 3793000, 3218000 ],
        [ 3794000, 3218000 ],
        [ 3794000, 3217000 ],
        [ 3793000, 3217000 ]
      ]
    ]
  }
}
```
