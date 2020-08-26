import express, { Application } from "express";
import userRoutes from "./routes/users";
import bookRoutes from "./routes/books";
import reviewRoutes from "./routes/reviews";
import profileRoutes from "./routes/profiles";
import { PrismaClient } from "@prisma/client";
import fileupload from "express-fileupload";
import path from "path";

export const prisma = new PrismaClient({
  errorFormat: "pretty",
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
});
async function main() {
  const app: Application = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));
  app.use(fileupload());
  app.use("/users", userRoutes);
  app.use("/profiles", profileRoutes);
  app.use("/books", bookRoutes);
  app.use("/reviews", reviewRoutes);
  app.listen(3000);
}
main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
