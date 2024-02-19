import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/test", () => {
    return HttpResponse.json(["This", "is", "test"]);
  }),
];
