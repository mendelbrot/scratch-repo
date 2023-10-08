import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
// deno-fmt-ignore
import {
  addMessage,
  deleteMessage,
  getMessage,
  getMessages,
  updateMessage,
} from "./controllers/messages.ts";
// deno-fmt-ignore
import {
  getUsers, 
  getUser, 
  addUser, 
  updateUser, 
  deleteUser 
} from "./controllers/users.ts";
// deno-fmt-ignore
import { 
  changePassword, 
  signin, 
} from "./controllers/auth.ts";

const router = new Router();

router
  .get("/api/v1/messages", getMessages)
  .get("/api/v1/messages/:id", getMessage)
  .post("/api/v1/messages", addMessage)
  .put("/api/v1/messages/:id", updateMessage)
  .delete("/api/v1/messages/:id", deleteMessage)
  .get("/api/v1/users", getUsers)
  .get("/api/v1/users/:id", getUser)
  .post("/api/v1/users", addUser)
  .put("/api/v1/users/:id", updateUser)
  .delete("/api/v1/users/:id", deleteUser)
  .post("/api/v1/auth/signin", signin)
  .post("/api/v1/change-password", changePassword);

export default router;
