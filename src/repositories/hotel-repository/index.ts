import { prisma } from "@/config";

async function find() {
  return await prisma.hotel.findMany();
}

async function findByHotelId(id: number) {
  return await prisma.hotel.findFirst({
    where: {
      id
    }
  });
}

const hotelRepository = {
  find,
  findByHotelId
};

export default hotelRepository;
