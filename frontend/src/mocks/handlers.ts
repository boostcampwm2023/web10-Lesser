import { rest } from "msw";

export const handlers = [
  rest.get("http://localhost:5173/test", (req, res, ctx) => {
    const request = req;
    request;
    return res(ctx.json(["This", "is", "test"]));
  }),
];
