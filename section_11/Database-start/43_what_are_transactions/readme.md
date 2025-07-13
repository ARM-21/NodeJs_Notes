Transaction in a database is a sequence of write operations performed as a single unit of work. It ensures that either all operations are executed successfully or none at all, maintaining the integrity of the database.
Note:- Write operations can include inserting, updating, or deleting records in the database.
select & find are not considered as write operations as they do not modify the state of the database.

Prerequisites for a transaction include:

1. session:- session is created and a transaction is started.
   - A session is a connection to the database that allows you to perform operations.
   - A transaction is initiated within a session, and it can include multiple write operations.

   -> start a using client.startSession() method to create a session.
   -> start a transaction using session.startTransaction() method.
   -> write and commit the transaction using session.commitTransaction() method.
   -> if any operation fails, you can abort the transaction using session.abortTransaction() method.

   
2. replica:- it is like a backing up of the database.

   - A replica is a copy of the database that can be used for backup or failover purposes.
   - It ensures that data is not lost in case of a failure.

   Firstly, we have to create a replica set in MongoDB to enable transactions. A replica set is a group of MongoDB servers that maintain the same data set, providing redundancy and high availability.

   MongoDB.conf -> setReplName: "myReplicaSet" -> uncomment replication -> in windows
   in Linux -? replSet=myReplicaSet 
   connection string: mongodb://localhost:27017/myDatabase?replicaSet=myReplicaSet
   #Terminal -> mongosh -> access rs(replica set object) -> rs.initiate() -> rs.status() -> rs.conf()

 #  Why do we need a replica set for transactions?

   - A replica set provides the necessary infrastructure for distributed transactions in MongoDB.
   - It ensures that all nodes in the replica set have the same data, allowing for consistent reads and writes across the cluster.
   - In case of a primary node failure, a secondary node can be elected as the new primary, ensuring high availability and minimal downtime for transactions.

   Without a replica set, transactions cannot be performed in MongoDB as it requires a distributed environment to ensure data consistency and integrity. As it follows the ACID properties (Atomicity, Consistency, Isolation, Durability) to ensure that transactions are processed reliably.

A transaction ensure the ACID properties (to ensure data integrity):

**Atomicity**: Ensures that all operations within the transaction are completed successfully. If any operation fails, the entire transaction is rolled back, leaving the database in a consistent state.
  - single unit of work, if one operation fails, all operations are rolled back.
  e.g. directory and user creation act as a single unit of work, if directory creation fails, user creation should also be rolled back.

**Consistency**: Ensures that the database remains in a valid state before and after the transaction. All data modifications within the transaction must adhere to the defined rules and constraints of the database.
  - accurate, consistent accross all the system in an organization.
  - valid data set which follows constraints and rules.
  e.g: Directory got inserted , but user is not inserted, then the directory should be deleted to maintain consistency.

**Isolation**:
Ensure that each transaction is executed independently of other and don't interfere with each other. This prevents issues like dirty reads, non-repeatable reads, and phantom reads.
  - multiple transactions can be executed concurrently without affecting each other.
  e.g: user trying to pay with debit card  of 2000 and same user withdraws money from app 2000 ->
  each transaction should be isolated from each other, so that the user can either pay or withdraw money, not both.

**Durability**: Ensures that once a transaction is committed, its changes are permanent and will survive any subsequent system failures. The data is written to the database in a way that it can be recovered even in the event of a crash.