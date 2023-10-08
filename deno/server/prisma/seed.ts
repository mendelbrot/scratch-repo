import { PrismaClient } from "./generated/client/deno/edge.ts";
import { load } from "https://deno.land/std@0.203.0/dotenv/mod.ts";

const env = await load();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
});

const user1 = await prisma.user.create({
  data: {
    username: "user1",
    hash: "password hash",
  },
});
console.log("user1", user1);
const user2 = await prisma.user.create({
  data: {
    username: "user2",
    hash: "password hash",
  },
});
console.log("user2", user2);
const _message1 = await prisma.user.create({
  data: {
    user_id: user1.id,
    message: "Hello from user1",
  },
});
console.log("_message1", _message1);
const _message2 = await prisma.user.create({
  data: {
    user_id: user2.id,
    message: "Hello from user2",
  },
});
console.log("_message2", _message1);
console.log("Seeding finished.");

await prisma.$disconnect();
