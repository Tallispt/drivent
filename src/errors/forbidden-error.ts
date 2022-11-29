import { ApplicationError } from "@/protocols";

export function forbiddenError(): ApplicationError {
  return {
    name: "ForbiddenRequisition",
    message: "Forbidden Requisition",
  };
}
