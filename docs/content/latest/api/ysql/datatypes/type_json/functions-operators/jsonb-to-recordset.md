---
title: jsonb_to_recordset() and json_to_recordset() [JSON]
headerTitle: jsonb_to_recordset() and json_to_recordset()
linkTitle: jsonb_to_recordset()
description: Use these JSON functions to convert a homogeneous JSON array of JSON objects into the equivalent set of SQL records.
summary: jsonb_to_recordset() and json_to_recordset()
menu:
  latest:
    identifier: jsonb-to-recordset
    parent: functions-operators
    weight: 240
isTocNested: true
showAsideToc: true
---

**Purpose:** Convert a homogeneous JSON _array_ of JSON _objects_ into the equivalent set of SQL _records_.

**Signature** For the `jsonb` variant:

```
input value:       jsonb
return value:      SETOF record
```

**Notes:** The function `jsonb_to_recordset()` bears the same relationship to `jsonb_to_record()` as  `jsonb_populate_recordset()` bears to `jsonb_populate_record()`.

Therefore, the `DO` block that demonstrated `jsonb_populate_recordset()`'s functionality can be easily extended to demonstrate `jsonb_to_recordset()`'s functionality as well and to show that their results are identical. The `DO` block needs the same type `t` and function `same_as()` that the _ysqlsh_ script for `jsonb_populate_recordset()`defined.

```postgresql
do $body$
declare
  array_of_objects constant jsonb :=
    '[
      {"a": 1, "b": 2},
      {"b": 4, "a": 3},
      {"a": 5, "c": 6},
      {"b": 7, "d": 8},
      {"c": 9, "d": 0}
    ]';

  rows_1 t[];
  rows_2 t[];
  expected_rows constant t[] :=
    array[
      (   1,    2)::t,
      (   3,    4)::t,
      (   5, null)::t,
      (null,    7)::t,
      (null, null)::t
    ];
  row t;
  n int := 0;
begin
  for row in (
    select a, b
    from jsonb_populate_recordset(null::t, array_of_objects)
    )
  loop
    n := n + 1;
    rows_1[n] := row;
  end loop;

  for row in (
    select a, b
    from jsonb_to_recordset(array_of_objects)
    as on_the_fly(a int, b int)
    )
  loop
    n := n + 1;
    rows_2[n] := row;
  end loop;

  assert
    same_as(rows_1, expected_rows) and
    same_as(rows_2, expected_rows),
  'unexpected';
end;
$body$;
```

The same considerations apply here as do for `to jsonb_to_record()` if the target `record` data type has a non-primitive field. The `jsonb_to_recordset()` syntax variant therefore has no practical advantage over the `jsonb_populate_recordset()` variant.
