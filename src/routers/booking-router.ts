import { getBooking, postBooking, putBooking } from "@/controllers";
import { authenticateToken, validateBody, validateParams } from "@/middlewares";
import { RoomIdSchema } from "@/schemas";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", validateBody(RoomIdSchema), postBooking)
  .put("/:bookingId", validateParams(RoomIdSchema), putBooking);

export { bookingRouter };
