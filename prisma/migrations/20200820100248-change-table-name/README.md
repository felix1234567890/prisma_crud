# Migration `20200820100248-change-table-name`

This migration has been generated by felix1234567890 at 8/20/2020, 12:02:48 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE `emp`.`users` (
`id` int  NOT NULL  AUTO_INCREMENT,
`username` varchar(191)  NOT NULL ,
`email` varchar(191)  NOT NULL ,
`password` varchar(191)  NOT NULL ,
`married` boolean  ,
`role` ENUM('USER', 'ADMIN')  NOT NULL DEFAULT 'USER',
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
UNIQUE Index `users.username_unique`(`username`),
UNIQUE Index `users.email_unique`(`email`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

DROP TABLE `emp`.`User`
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200820095530-user-created..20200820100248-change-table-name
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "mysql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -17,8 +17,9 @@
   password String
   married Boolean?
   role Role @default(USER)
   createdAt DateTime @default(now())
+  @@map(name:"users")
 }
 enum Role {
   USER
   ADMIN
```

