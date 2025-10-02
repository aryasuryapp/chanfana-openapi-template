import { contentJson, OpenAPIRoute } from "chanfana";
import { AppContext } from "../types";
import { z } from "zod";

export class TestEndpoint extends OpenAPIRoute {
  public schema = {
    tags: ["Test"],
    summary: "Test endpoint that returns the request body",
    operationId: "test-endpoint",
    request: {
      body: contentJson(
        z.any().describe("Any JSON object to be echoed back"),
      ),
    },
    responses: {
      "200": {
        description: "Returns the request body as received",
        ...contentJson({
          success: Boolean,
          result: z.any(),
        }),
      },
    },
  };

  public async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();

    return {
      success: true,
      result: data.body,
    };
  }
}