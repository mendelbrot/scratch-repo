import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import app from "../main.ts";

const url = "http://localhost:9000";

Deno.test("it should respond with message", async () => {
  const request = await superoak(url);
  await request.get("/api/v1/messages").expect("Hello Basic Chat!");
});
