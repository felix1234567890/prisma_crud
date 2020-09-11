# Migration `20200911082619-added-property-type`

This migration has been generated by felix1234567890 at 9/11/2020, 10:26:19 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `emp`.`users` MODIFY `resetPasswordExpire` datetime(3)
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200911082327-added-two-fields-to-user..20200911082619-added-property-type
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
@@ -19,11 +19,10 @@
   role Role @default(USER)
   createdAt DateTime @default(now())
   books Book[]
   reviews Review[]
-  profile Profile
   resetPasswordToken String?
-  resetPasswordExpire String?
+  resetPasswordExpire DateTime?
   @@map(name:"users")
 }
 model Book {
   id Int @default(autoincrement()) @id
```

