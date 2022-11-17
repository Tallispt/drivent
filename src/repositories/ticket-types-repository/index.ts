import { prisma } from "@/config";

async function find() {
  return await prisma.ticketType.findMany();
}

async function findById(id: number) {
  return await prisma.ticketType.findUnique({
    where: {
      id
    }
  });
}

const ticketTypesRepository = {
  find,
  findById
};

export default ticketTypesRepository;
