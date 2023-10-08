import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";

function getMessages(ctx: Context) {
  ctx.response.body = "Hello Basic Chat!";
}

function getMessage(ctx: Context) {
  // TODO
}

function addMessage(ctx: Context) {
  // TODO
}

function updateMessage(ctx: Context) {
  // TODO
}

function deleteMessage(ctx: Context) {
  // TODO
}

// deno-fmt-ignore
export { 
  getMessages, 
  getMessage, 
  addMessage, 
  updateMessage, 
  deleteMessage 
};
