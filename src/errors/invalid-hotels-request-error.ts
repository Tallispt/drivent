import { ApplicationError } from "@/protocols";

export function invalidHotelRequisitonError(): ApplicationError {
  return {
    name: "InvalidHotelRequisiton",
    message: "Could not show hotels without valid ticket!",
  };
}
