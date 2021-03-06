---
title: Benchmark YSQL performance using YCSB
headerTitle: YCSB
linkTitle: YCSB
description: Benchmark YugabyteDB YSQL performance using YCSB.
headcontent: Benchmark YugabyteDB YSQL performance using YCSB.
menu:
  latest:
    identifier: ycsb-1-ysql
    parent: benchmark
    weight: 5
aliases:
  - /benchmark/ycsb/
showAsideToc: true
isTocNested: true
---

<ul class="nav nav-tabs-alt nav-tabs-yb">

  <li >
    <a href="/latest/benchmark/ycsb-ysql/" class="nav-link active">
      <i class="icon-postgres" aria-hidden="true"></i>
      YSQL
    </a>
  </li>

  <li >
    <a href="/latest/benchmark/ycsb-ycql/" class="nav-link">
      <i class="icon-cassandra" aria-hidden="true"></i>
      YCQL
    </a>
  </li>

</ul>

{{< note title="Note" >}}

For more information about YCSB, see: 

* YCSB Wiki: https://github.com/brianfrankcooper/YCSB/wiki
* Workload info: https://github.com/brianfrankcooper/YCSB/wiki/Core-Workloads

{{< /note >}}

## Step 1. Download the YCSB binaries

You can do this by running the following commands.

```sh
$ cd $HOME
$ wget https://github.com/yugabyte/YCSB/releases/download/1.0/ycsb.tar.gz
$ tar -zxvf ycsb.tar.gz
$ cd YCSB
```

{{< note title="Note" >}}
The binaries are compiled with JAVA 13 and it is recommended to run these binaries with that version.
{{< /note >}}

## Step 2. Start YugabyteDB

Start your YugabyteDB cluster by following the steps in [Quick start](https://docs.yugabyte.com/latest/quick-start/explore-ysql/).

## Step 3. Configure YCSB connection properties

Set the following connection configurations in `db.properties`:

```sh
db.driver=org.postgresql.Driver
db.url=jdbc:postgresql://<ip1>:5433/ycsb;jdbc:postgresql://<ip2>:5433/ycsb;jdbc:postgresql://<ip3>:5433/ycsb;
db.user=yugabyte
db.passwd=
```

The other configuration parameters, are described in detail at [this page](https://github.com/brianfrankcooper/YCSB/wiki/Core-Properties)

{{< note title="Note" >}}
The db.url field should be populated with the IPs of all the tserver nodes that are part of the cluster.
{{< /note >}}

## Step 4. Run the workloads
There is a handy script(run_sql.sh) that loads and runs all the workloads.
First we need to supply the paths to the ycsb binary and the ysqlsh binary(which is distributed as part of the database package) along with the IP of the tserver node.
Then you simply run the workloads as:

```sh
$ ./run_sql.sh
```

The script creates 2 result files per workload, one for the loading and one for the execution phase with the details of throughput and latency.

{{< note title="Note" >}}
To get the maximum performance out of the system, you would have to tune the threadcount parameter in the script. As a reference, for a c5.4xlarge instance with 16 cores and 32GB RAM, we used a threadcount of 32 for the loading phase and 256 for the execution phase.
{{< /note >}}

## Manually running the workloads

Create the database and table using the `ysqlsh` tool.
The `ysqlsh` tool is distributed as part of the database package.

```sh
$ ./bin/ysqlsh -h <ip> -c 'create database ycsb;'
$ ./bin/ysqlsh -h <ip> -d ycsb -c 'CREATE TABLE usertable (YCSB_KEY VARCHAR(255) PRIMARY KEY, FIELD0 TEXT, FIELD1 TEXT, FIELD2 TEXT, FIELD3 TEXT, FIELD4 TEXT, FIELD5 TEXT, FIELD6 TEXT, FIELD7 TEXT, FIELD8 TEXT, FIELD9 TEXT);'
```

Before starting the `yugabyteSQL` workload, you will need to load the data first.

```sh
$ ./bin/ycsb load yugabyteSQL -P yugabyteSQL/db.properties -P workloads/workloada
```

Then, you can run the workload:

```sh
$ ./bin/ycsb run yugabyteSQL -P yugabyteSQL/db.properties -P workloads/workloada
```

To run the other workloads (for example, `workloadb`), all you need to do is change that argument in the above command.

```sh
$ ./bin/ycsb run yugabyteSQL -P yugabyteSQL/db.properties -P workloads/workloadb
```
