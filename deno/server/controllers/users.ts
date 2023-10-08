import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";

function getUsers(ctx: Context) {
  ctx.response.body = "Hello Basic Chat!";
}

function getUser(ctx: Context) {
  // TODO
}

function addUser(ctx: Context) {
  // TODO
}

function updateUser(ctx: Context) {
  // TODO
}

function deleteUser(ctx: Context) {
  // TODO
}

// deno-fmt-ignore
export { 
  getUsers, 
  getUser, 
  addUser, 
  updateUser, 
  deleteUser 
};
