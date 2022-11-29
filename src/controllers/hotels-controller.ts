import { AuthenticatedRequest } from "@/middlewares";
import hotelServices from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const hotels = await hotelServices.findHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "InvalidHotelRequisiton") {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}

export async function getHotelsWithParam(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { hotelId } = req.params;

  try {
    const hotel = await hotelServices.findHotelById(userId, Number(hotelId));
    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}
