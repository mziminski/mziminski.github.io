---
title: Spatial pipelines fail in space
description: A draft on why a healthy row count can still publish a map that is quietly wrong, and what to count instead.
date: 2026-11-12
draft: true
---

A file can arrive on time, match last week’s row count, and still be the wrong map. The geometries are in another CRS. A ring is open. A join key that used to be a county code is now a name, and the features that do not match are dropped without a number attached to the drop. The monitor is green because it was watching the table.

Spatial pipelines fail in space. The checks that catch it are not exotic. They are the checks a careful person would run once, written down so the next run does them too.

## Counts that are about the ground

I want four numbers next to “rows in, rows out”:

1. Features refused as invalid geometry.
2. Features refused as empty or out of the bounds you declared.
3. Features lost in a join, named by the key that missed, not only as a total.
4. The age of the source at the moment of publish, next to the version that is live.

None of these is a model metric. They are how you notice that a county disappeared. The [pipeline study](/work/spatial-pipeline/) puts them in a fixed order: land the bytes, check the schema, check the geometry, transform into a new version, compare a golden area, then publish. The golden area is a handful of features whose ids and extents you already believe. If they move and nobody changed a rule, you stop.

## The interface has the same job

A map that cannot be read as a list is a map you cannot trust when the tiles fail. The [smoke and trails sample](/work/smoke-trails/) is a small version of that idea: the segment’s condition is a sentence, and the map is one view of it. The sample geometry is invented. The rule is not. If the only correct answer lives in a canvas, you have built a picture, not a record.

## What I am not claiming

I am not claiming a pipeline in production, a freshness SLO, or a dataset. This is a sample draft for the site, dated with the rebuild, and it should be edited or removed before it is treated as a published note. The blanks on the case studies are the same kind of honesty. A number belongs here only after it has been measured on a run you can point to.
