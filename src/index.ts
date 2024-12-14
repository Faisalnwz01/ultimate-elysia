import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import betterAuthView from "./lib/auth/auth-view";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { jobController } from "./app/controllers/job.controller";
import { paymentController } from "./app/controllers/payment.controller";
const port = process.env.PORT || 3000;

const app = new Elysia()
	.use(cors())
	.use(swagger())
	.all("/api/auth/*", betterAuthView)
	.get("/", () => "Hello starter")
	.state('version', 1)
	.decorate('getDate', () => Date.now())
	.use(
		opentelemetry({
			spanProcessors: [
				new BatchSpanProcessor(
					new OTLPTraceExporter()
				)
			]
		})
	)
	.use(jobController)
	.use(paymentController)
	.listen(port);


console.log(
  `🦊 starter is running at ${app.server?.hostname}:${app.server?.port}`
);
