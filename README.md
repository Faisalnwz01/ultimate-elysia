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

## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd starter
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Environment Setup**
   Copy the `.env.example` file to `.env` and update the variables:
   ```bash
   cp .env.example .env
   ```
   Required environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - Other auth-related variables as needed

4. **Database Setup**
   ```bash
   # Generate Prisma client
   bun run prisma:generate

   # Push database schema
   bun run prisma:push
   ```

## 💻 Development

Start the development server with hot reload:
```bash
bun run dev
```

The server will start at `http://localhost:3000`

### Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run prisma:generate` - Generate Prisma client
- `bun run prisma:push` - Push database schema changes
- `bun run prisma:studio` - Open Prisma Studio for database management

## 📚 API Documentation

Once the server is running, access the Swagger documentation at:
```
http://localhost:3000/swagger
```

## 🏗️ Project Structure

```
src/
├── index.ts          # Application entry point
├── routes/           # API routes
├── controllers/      # Request handlers and business logic controllers
├── middleware/       # Custom middleware
├── services/         # Business logic and data access services
├── types/           # TypeScript type definitions
└── utils/           # Helper functions

prisma/
├── schema.prisma    # Database schema
```

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

## 🔒 Authentication

The template uses `better-auth` for authentication. Configure your auth settings in the environment variables.

## 💳 Stripe Integration

Stripe is pre-configured for payment processing. Set your Stripe secret key in the `.env` file to get started.

## 📊 Monitoring

OpenTelemetry is configured for monitoring and observability. Configure your preferred metrics collector in the environment variables.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## 🙏 Acknowledgments

- [Bun](https://bun.sh)
- [Elysia.js](https://elysiajs.com)
- [Prisma](https://prisma.io)
- All other amazing open source contributors