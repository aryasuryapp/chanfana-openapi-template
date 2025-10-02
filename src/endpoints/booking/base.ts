import { z } from "zod";

export const booking = z.object({
  id: z.string(),
  customerName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  checkInDate: z.string().datetime(),
  checkOutDate: z.string().datetime(),
  roomType: z.enum(["standard", "deluxe", "suite", "presidential"]),
  numberOfGuests: z.number().int().min(1),
  specialRequests: z.string().optional(),
  totalAmount: z.number().positive(),
  status: z.enum(["confirmed", "pending", "cancelled"]),
  createdAt: z.string().datetime(),
});

export const BookingModel = {
  tableName: "bookings",
  primaryKeys: ["id"],
  schema: booking,
  serializer: (obj: Record<string, string | number | boolean>) => {
    return {
      ...obj,
      numberOfGuests: Number(obj.numberOfGuests),
      totalAmount: Number(obj.totalAmount),
    };
  },
  serializerObject: booking,
};