import { prisma } from "@/config";

async function findById(id: number) {
  return await prisma.room.findFirst({
    where: {
      id
    },
    include: {
      Booking: true
    }
  });
}

const roomsRepository = {
  findById
};

export default roomsRepository;
