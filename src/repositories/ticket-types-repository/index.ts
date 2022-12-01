import { prisma } from "@/config";

async function find() {
  return await prisma.ticketType.findMany();
}

const ticketTypesRepository = {
  find
};

export default ticketTypesRepository;
