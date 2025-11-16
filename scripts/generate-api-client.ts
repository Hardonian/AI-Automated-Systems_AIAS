#!/usr/bin/env tsx
/**
 * API Client SDK Generator
 * 
 * Generates TypeScript API client from OpenAPI specification
 * 
 * Usage: tsx scripts/generate-api-client.ts
 */

import fs from "fs";
import path from "path";

const OPENAPI_SPEC_PATH = path.join(process.cwd(), "openapi.json");
const OUTPUT_PATH = path.join(process.cwd(), "lib", "api", "generated-client.ts");

async function generateClient() {
  console.log("🔧 Generating API client from OpenAPI spec...\n");

  try {
    const spec = JSON.parse(fs.readFileSync(OPENAPI_SPEC_PATH, "utf-8"));

    let clientCode = `/**
 * Auto-generated API Client
 * 
 * Generated from OpenAPI specification
 * DO NOT EDIT MANUALLY - Regenerate with: npm run generate:api-client
 */

export interface ApiError {
  error: string;
  message?: string;
  details?: Record<string, unknown>;
}

export class ApiClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string = "${spec.servers[0]?.url || "/api"}", apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.apiKey) {
      headers["Authorization"] = \`Bearer \${this.apiKey}\`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: "Unknown error",
        message: \`HTTP \${response.status}: \${response.statusText}\`,
      }));
      throw error;
    }

    return response.json();
  }

`;

    // Generate methods for each endpoint
    for (const [path, methods] of Object.entries(spec.paths)) {
      for (const [method, operation]: [string, any][] = Object.entries(methods)) {
        if (method === "get" || method === "post" || method === "put" || method === "delete") {
          const operationId = operation.operationId || `${method}${path.replace(/\//g, "").replace(/\{/g, "").replace(/\}/g, "")}`;
          const methodName = operationId.charAt(0).toLowerCase() + operationId.slice(1);

          // Extract path parameters
          const pathParams = operation.parameters?.filter((p: any) => p.in === "path") || [];
          const queryParams = operation.parameters?.filter((p: any) => p.in === "query") || [];

          let methodSignature = `  async ${methodName}(`;
          const params: string[] = [];

          if (pathParams.length > 0) {
            pathParams.forEach((param: any) => {
              params.push(`${param.name}: string`);
            });
          }

          if (method === "post" || method === "put") {
            const requestBody = operation.requestBody;
            if (requestBody) {
              params.push(`body: ${operationId}Request`);
            }
          }

          if (queryParams.length > 0) {
            params.push(`query?: ${operationId}Query`);
          }

          methodSignature += params.join(", ");
          methodSignature += `): Promise<${operationId}Response> {`;

          let methodBody = `    const url = \`${path.replace(/\{(\w+)\}/g, "${$1}")}\`;`;

          if (queryParams.length > 0) {
            methodBody += `\n    const searchParams = new URLSearchParams();`;
            methodBody += `\n    if (query) {`;
            queryParams.forEach((param: any) => {
              methodBody += `\n      if (query.${param.name}) searchParams.set("${param.name}", String(query.${param.name}));`;
            });
            methodBody += `\n    }`;
            methodBody += `\n    const queryString = searchParams.toString();`;
            methodBody += `\n    const fullUrl = queryString ? \`\${url}?\${queryString}\` : url;`;
          }

          if (method === "post" || method === "put") {
            methodBody += `\n    return this.request<${operationId}Response>(fullUrl, {`;
            methodBody += `\n      method: "${method.toUpperCase()}",`;
            methodBody += `\n      body: JSON.stringify(body),`;
            methodBody += `\n    });`;
          } else {
            methodBody += `\n    return this.request<${operationId}Response>(fullUrl, {`;
            methodBody += `\n      method: "${method.toUpperCase()}",`;
            methodBody += `\n    });`;
          }

          methodBody += `\n  }`;

          clientCode += methodSignature + "\n" + methodBody + "\n\n";

          // Generate types
          if (method === "post" || method === "put") {
            clientCode += `export interface ${operationId}Request {\n`;
            // Add request body properties based on schema
            clientCode += `  // TODO: Add properties based on requestBody schema\n`;
            clientCode += `}\n\n`;
          }

          if (queryParams.length > 0) {
            clientCode += `export interface ${operationId}Query {\n`;
            queryParams.forEach((param: any) => {
              const type = param.schema?.type || "string";
              clientCode += `  ${param.name}${param.required ? "" : "?"}: ${type};\n`;
            });
            clientCode += `}\n\n`;
          }

          // Generate response type
          const responses = operation.responses;
          const successResponse = responses["200"] || responses["201"];
          if (successResponse?.content?.["application/json"]?.schema) {
            clientCode += `export type ${operationId}Response = ${JSON.stringify(successResponse.content["application/json"].schema, null, 2).replace(/"/g, "")};\n\n`;
          } else {
            clientCode += `export type ${operationId}Response = unknown;\n\n`;
          }
        }
      }
    }

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, clientCode);
    console.log(`✅ API client generated at: ${OUTPUT_PATH}`);
    console.log("\n⚠️  Note: Some types may need manual refinement");
  } catch (error) {
    console.error("❌ Error generating API client:", error);
    process.exit(1);
  }
}

generateClient();
