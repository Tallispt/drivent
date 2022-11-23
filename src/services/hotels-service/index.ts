import { notFoundError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";

async function findHotels() {
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
