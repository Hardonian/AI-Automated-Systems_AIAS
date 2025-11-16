/**
 * OpenAPI Specification Endpoint
 * 
 * Serves the OpenAPI 3.1.0 specification for API documentation
 * Accessible at /api/openapi
 */

import { NextResponse } from "next/server";
import openApiSpec from "../../../openapi.json";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(openApiSpec, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
}
