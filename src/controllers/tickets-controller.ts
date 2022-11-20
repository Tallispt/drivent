import { AuthenticatedRequest } from "@/middlewares";
import ticketsServices from "@/services/tickets-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getTypes(_req: Request, res: Response) {
  try {
    const ticketType = await ticketsServices.getAllTicketTypes();
    return res.status(httpStatus.OK).send(ticketType);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const tickets = await ticketsServices.getAllTickets(userId);
    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;

  try {
    const result = await ticketsServices.createTicket(ticketTypeId, userId);
    return res.status(httpStatus.CREATED).send(result);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
