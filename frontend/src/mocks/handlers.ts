import { rest } from "msw";
import { LOGIN } from "./responses";

export const handlers = [
  rest.get("http://localhost:5173/test", (req, res, ctx) => {
    const request = req;
    request;
    return res(ctx.json(["This", "is", "test"]));
  }),
  rest.get(LOGIN.GITHIB_URL.URL, (requ, res, ctx) => {
    const request = requ;
    request;
    return res(ctx.json(LOGIN.GITHIB_URL.RESPONSE));
  }),
];
