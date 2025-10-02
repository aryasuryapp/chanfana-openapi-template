import { Hono } from "hono";
import { fromHono } from "chanfana";
import { BookingCreate } from "./bookingCreate";

export const bookingRouter = fromHono(new Hono());

bookingRouter.post("/", BookingCreate);