import { invalidHotelRequisitonError, notFoundError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";
import ticketsRepository from "@/repositories/ticket-repository";

async function findHotels(userId: number) {
  const ticket = await ticketsRepository.findByUserId(userId);

  if (!ticket || ticket?.TicketType.isRemote || ticket?.status !== "PAID") {
    throw invalidHotelRequisitonError();
  }

  return await hotelRepository.find();
}

async function findHotelById(hotelId: number) {
  const hotel = await hotelRepository.findByHotelId(hotelId);

  if (!hotel) {
    throw notFoundError();
  }
  return hotel;
}

const hotelServices = {
  findHotels,
  findHotelById
};

export default hotelServices;
