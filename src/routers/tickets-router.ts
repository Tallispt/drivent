import { getTickets, getTypes, postTicket } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { ticketTypeIdSchema } from "@/schemas/tickets-schema";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTypes)
  .get("/", getTickets)
  .post("/", validateBody(ticketTypeIdSchema), postTicket);

export { ticketsRouter };
