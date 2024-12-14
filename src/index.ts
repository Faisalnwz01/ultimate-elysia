import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import betterAuthView from "./lib/auth/auth-view";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'

const app = new Elysia();
app.use(cors()).use(swagger()).all("/api/auth/*", betterAuthView);
app.get("/", () => "Hello starter").listen(3000);
app.state('version', 1).decorate('getDate', () => Date.now());
app.use(
		opentelemetry({
			spanProcessors: [
				new BatchSpanProcessor(
					new OTLPTraceExporter()
				)
			]
		})
	)

console.log(
  `🦊 starter is running at ${app.server?.hostname}:${app.server?.port}`
);
