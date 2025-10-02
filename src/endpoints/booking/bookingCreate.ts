import { contentJson, OpenAPIRoute } from "chanfana";
import { AppContext } from "../../types";
import { z } from "zod";

export class BookingCreate extends OpenAPIRoute {
  public schema = {
    tags: ["Booking"],
    summary: "Create a new booking",
    operationId: "create-booking",
    request: {
      body: contentJson(
        z.object({
          customerName: z.string().min(1, "Customer name is required"),
          email: z.string().email("Valid email is required"),
          phone: z.string().min(10, "Valid phone number is required"),
          checkInDate: z.string().datetime("Valid check-in date is required"),
          checkOutDate: z.string().datetime("Valid check-out date is required"),
          roomType: z.enum(["standard", "deluxe", "suite", "presidential"]),
          numberOfGuests: z.number().int().min(1, "At least 1 guest is required"),
          specialRequests: z.string().optional(),
        }),
      ),
    },
    responses: {
      "201": {
        description: "Booking created successfully",
        ...contentJson({
          success: z.boolean(),
          result: z.object({
            id: z.string(),
            customerName: z.string(),
            email: z.string(),
            phone: z.string(),
            checkInDate: z.string(),
            checkOutDate: z.string(),
            roomType: z.string(),
            numberOfGuests: z.number(),
            specialRequests: z.string().optional(),
            totalAmount: z.number(),
            status: z.string(),
            createdAt: z.string(),
          }),
        }),
      },
      "400": {
        description: "Bad request - invalid input data",
        ...contentJson({
          success: z.boolean(),
          errors: z.array(z.object({
            code: z.number(),
            message: z.string(),
          })),
        }),
      },
    },
  };

  public async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();

    // Generate sample booking ID
    const bookingId = `BK${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    // Calculate sample total amount based on room type and number of nights
    const checkIn = new Date(data.body.checkInDate);
    const checkOut = new Date(data.body.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    const baseRates = {
      standard: 150,
      deluxe: 250,
      suite: 400,
      presidential: 800,
    };
    
    const baseRate = baseRates[data.body.roomType];
    const totalAmount = baseRate * nights * (data.body.numberOfGuests > 2 ? 1.2 : 1); // 20% surcharge for more than 2 guests

    // Return sample booking data
    const booking = {
      id: bookingId,
      customerName: data.body.customerName,
      email: data.body.email,
      phone: data.body.phone,
      checkInDate: data.body.checkInDate,
      checkOutDate: data.body.checkOutDate,
      roomType: data.body.roomType,
      numberOfGuests: data.body.numberOfGuests,
      specialRequests: data.body.specialRequests || null,
      totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    return c.json({
      success: true,
      result: booking,
    }, 201);
  }
}