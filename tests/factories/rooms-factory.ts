import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { Prisma } from "@prisma/client";

export async function createRooms(hotelId: number, numberRooms = 1, capacity = faker.datatype.number({ min: 1, max: 5 })) {
  const datas = [] as Prisma.RoomCreateManyInput[];
  for (let i = 0; i < numberRooms; i++) {
    datas.push({
      name: faker.lorem.words(2),
      hotelId,
      capacity
    });
  }

  return await prisma.$transaction(
    datas.map((data) => prisma.room.create({ data }))
  );
}
