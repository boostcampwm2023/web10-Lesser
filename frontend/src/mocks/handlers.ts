import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("http://localhost:5173/test", () => {
    return HttpResponse.json(["This", "is", "test"]);
  }),
];
