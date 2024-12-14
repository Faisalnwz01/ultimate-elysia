# Modern Bun + Elysia Starter Template

A powerful, production-ready starter template built with Bun and Elysia, featuring Prisma ORM, Swagger documentation, OpenTelemetry, authentication, and Stripe integration.

## 🚀 Features

- ⚡️ **Bun Runtime** - Ultra-fast JavaScript runtime and toolkit
- 🏗️ **Elysia.js** - Type-safe, high-performance web framework
- 🔒 **Authentication** - Built-in auth system using better-auth
- 📚 **Swagger Documentation** - Automatic API documentation
- 🗄️ **Prisma ORM** - Type-safe database operations
- 📊 **OpenTelemetry** - Built-in observability and monitoring
- 💳 **Stripe Integration** - Ready for payment processing
- 🔍 **Logging** - Structured logging with Pino
- 🛡️ **CORS Support** - Configured cross-origin resource sharing

## 📋 Prerequisites

- [Bun](https://bun.sh) installed on your machine
- A PostgreSQL database (for Prisma)
- Node.js 18+ (recommended)

## 🛠️ Quick Start

### Using as a Template

1. **Create a new project using this template**
   ```bash
   bun create github.com/faisalnwz01/ultimate-elysia my-app
   cd my-app
   ```

2. **Install dependencies and set up the project**
   ```bash
   bun run setup
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   STRIPE_SECRET_KEY="your-stripe-key"
   ```

4. **Start the development server**
   ```bash
   bun run dev
   ```

Your server will be running at `http://localhost:3000` with Swagger docs at `/swagger`

### Manual Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/faisalnwz01/bun-elysia-starter.git
   cd bun-elysia-starter
   ```

2. Follow steps 2-4 from the Quick Start section above.

## 📚 Documentation

### Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run start` - Start production server
- `bun run setup` - Install dependencies and generate Prisma client
- `bun run prisma:generate` - Generate Prisma client
- `bun run prisma:push` - Push database schema changes
- `bun run prisma:studio` - Open Prisma Studio for database management

### Project Structure

```
├── src/
│   ├── index.ts          # Application entry point
│   ├── routes/           # API routes
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic
│   ├── types/           # TypeScript types
│   └── utils/           # Helper functions
├── prisma/
│   └── schema.prisma    # Database schema
├── .env.example         # Example environment variables
├── package.json         # Project configuration
└── tsconfig.json        # TypeScript configuration
```

### API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:3000/swagger`
- API endpoint: `http://localhost:3000/api`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Bun](https://bun.sh) - For the amazing runtime
- [Elysia](https://elysiajs.com) - For the fantastic web framework
- All other open-source contributors

## 🔒 Authentication

The template uses `better-auth` for authentication. Configure your auth settings in the environment variables.

## 💳 Stripe Integration

Stripe is pre-configured for payment processing. Set your Stripe secret key in the `.env` file to get started.

## 📊 Monitoring

OpenTelemetry is configured for monitoring and observability. Configure your preferred metrics collector in the environment variables.

## 📝 Adding New Controllers

Controllers handle the HTTP request/response cycle. Here's how to add a new controller:

1. Create a new file in `src/controllers` (e.g., `userController.ts`):
```typescript
import { Elysia } from 'elysia';
import { UserService } from '../services/userService';

export class UserController {
  constructor(private userService: UserService) {}

  routes = (app: Elysia) =>
    app.group('/users', (app) =>
      app
        .get('/', () => this.getAllUsers())
        .get('/:id', ({ params: { id } }) => this.getUser(id))
        .post('/', ({ body }) => this.createUser(body))
    );

  private async getAllUsers() {
    return await this.userService.findAll();
  }

  private async getUser(id: string) {
    return await this.userService.findById(id);
  }

  private async createUser(data: any) {
    return await this.userService.create(data);
  }
}
```

2. Register the controller in `src/index.ts`:
```typescript
import { UserController } from './controllers/userController';
import { UserService } from './services/userService';

const app = new Elysia();
const userService = new UserService();
const userController = new UserController(userService);

app.use(userController.routes);
```

## 🔧 Adding New Services

Services handle business logic and data access. Here's how to create a new service:

1. Create a new file in `src/services` (e.g., `userService.ts`):
```typescript
import { PrismaClient } from '@prisma/client';

export class UserService {
  private prisma = new PrismaClient();

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id }
    });
  }

  async create(data: any) {
    return await this.prisma.user.create({
      data
    });
  }
}
```

2. Best Practices for Services:
   - Keep services focused on a single responsibility
   - Use dependency injection for external dependencies
   - Implement error handling and validation
   - Use TypeScript interfaces for type safety

## 🔐 Next-Auth Setup

This template supports authentication with Next-Auth. Here's how to set it up:

1. **Install Dependencies**
```bash
bun add next-auth @auth/prisma-adapter
```

2. **Configure Environment Variables**
Add these to your `.env` file:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret
```

3. **Create Auth Configuration**
Create `src/auth/auth.config.ts`:
```typescript
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};
```

4. **Add Prisma Schema for Auth**
Add these models to your `schema.prisma`:
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

5. **Update Database**
```bash
bun run prisma:push
```

6. **Protect Routes**
Example of a protected route in your controller:
```typescript
import { auth } from '../auth/auth.config';

export class ProtectedController {
  routes = (app: Elysia) =>
    app.group('/protected', (app) =>
      app.get('/', async ({ request }) => {
        const session = await auth(request);
        if (!session) throw new Error('Unauthorized');
        return { message: 'Protected data' };
      })
    );
}
```