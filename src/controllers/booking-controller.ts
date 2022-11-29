import { AuthenticatedRequest } from "@/middlewares";
import bookingServices from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingServices.findBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    await bookingServices.createBooking(userId, Number(...req.body));
    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    return res.status(httpStatus.FORBIDDEN).send(error);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    await bookingServices.editBooking(userId, Number(...req.body));
    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    return res.status(httpStatus.FORBIDDEN).send(error);
  }
}
