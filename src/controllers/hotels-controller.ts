import hotelServices from "@/services/hotels-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getHotels(_req: Request, res: Response) {
  try {
    const hotels = await hotelServices.findHotels();
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}

export async function getHotelsWithParam(req: Request, res: Response) {
  const { hotelId } = req.params;

  try {
    const hotel = await hotelServices.findHotelById(Number(hotelId));
    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}
