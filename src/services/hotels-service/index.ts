import { invalidHotelRequisitonError, notFoundError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";
import ticketsRepository from "@/repositories/ticket-repository";
import { TicketStatus } from "@prisma/client";

async function findHotels(userId: number) {
  await validateTicket(userId);

  return await hotelRepository.find();
}

async function findHotelById(userId: number, hotelId: number) {
  await validateTicket(userId);

  const hotel = await hotelRepository.findByHotelId(hotelId);

  if (!hotel) {
    throw notFoundError();
  }
  return hotel;
}

async function validateTicket(userId: number) {
  const ticket = await ticketsRepository.findByUserId(userId);

  if (!ticket || ticket?.TicketType.isRemote || ticket?.status !== TicketStatus.PAID || !ticket?.TicketType.includesHotel) {
    throw invalidHotelRequisitonError();
  }
}

const hotelServices = {
  findHotels,
  findHotelById
};

export default hotelServices;
