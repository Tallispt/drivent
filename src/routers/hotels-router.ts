import { getHotels, getHotelsWithParam } from "@/controllers";
import { authenticateToken, validateParams } from "@/middlewares";
import { hotelIdSchema } from "@/schemas";
import { Router } from "express";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", getHotels)
  .get("/:hotelId", validateParams(hotelIdSchema), getHotelsWithParam);

export { hotelsRouter };
