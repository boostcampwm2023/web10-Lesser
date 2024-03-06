import { rest } from "msw";
import { LOGIN } from "./responses";

export const handlers = [
  rest.get("http://localhost:5173/test", (req, res, ctx) => {
    const request = req;
    request;
    return res(ctx.json(["This", "is", "test"]));
  }),
  // rest.get(LOGIN.GITHUB_URL.URL, (req, res, ctx) => {
  //   const request = req;
  //   request;
  //   return res(ctx.json(LOGIN.GITHUB_URL.RESPONSE));
  // }),
  // rest.post(LOGIN.GITHUB_CODE.URL, (req, res, ctx) => {
  //   const request = req;
  //   request;
  //   return res(ctx.status(LOGIN.GITHUB_CODE.STATUS), ctx.json(LOGIN.GITHUB_CODE.RESPONSE));
  // }),
];
