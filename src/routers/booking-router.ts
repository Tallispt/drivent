import { getBooking, postBooking, putBooking } from "@/controllers";
import { authenticateToken, validateBody, validateParams } from "@/middlewares";
import { BookingIdSchema, RoomIdSchema } from "@/schemas";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", validateBody(RoomIdSchema), postBooking)
  .put("/:bookingId", validateBody(RoomIdSchema), validateParams(BookingIdSchema), putBooking);

export { bookingRouter };
