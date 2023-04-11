import { setupWorker, rest as restImpl } from "msw";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

export const rest = restImpl;
