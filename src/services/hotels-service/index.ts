import { invalidHotelRequisitonError, notFoundError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";
import ticketsRepository from "@/repositories/ticket-repository";

async function findHotels(userId: number) {
  await validTicket(userId);

  return await hotelRepository.find();
}

async function findHotelById(userId: number, hotelId: number) {
  await validTicket(userId);

  const hotel = await hotelRepository.findByHotelId(hotelId);

  if (!hotel) {
    throw notFoundError();
  }
  return hotel;
}

async function validTicket(userId: number) {
  const ticket = await ticketsRepository.findByUserId(userId);

  if (!ticket || ticket?.TicketType.isRemote || ticket?.status !== "PAID" || !ticket?.TicketType.includesHotel) {
    throw invalidHotelRequisitonError();
  }
}

const hotelServices = {
  findHotels,
  findHotelById
};

export default hotelServices;
