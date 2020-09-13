import 'reflect-metadata';
import express, { Application } from 'express';
import fileupload from 'express-fileupload';
import path from 'path';
import errorHandler from './utils/errorHandler';
import { errors } from 'celebrate';
import rateLimit from 'express-rate-limit';
import AppError from './utils/AppError';
import './utils/container';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {
  userRoutes,
  authRoutes,
  bookRoutes,
  profileRoutes,
  reviewRoutes,
} from './routes';

class App {
  private app: Application;
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupPostRouteMiddleware();
  }

  public getServer() {
    return this.app;
  }

  private setupMiddleware() {
    this.app.use(
      rateLimit({
        windowMs: 10 * 60 * 100,
        max: 100,
      }),
    );
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(fileupload());
  }

  private setupRoutes() {
    this.app.use('/users', userRoutes);
    this.app.use('/profiles', profileRoutes);
    this.app.use('/books', bookRoutes);
    this.app.use('/reviews', reviewRoutes);
    this.app.use('/auth', authRoutes);
  }

  setupPostRouteMiddleware() {
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'User books with reviews API docs',
          version: '1.0.0',
          description:
            'This is a CRUD API application made with Express and documented with Swagger',
          license: {
            name: 'MIT',
            url: 'https://spdx.org/licenses/MIT.html',
          },
          contact: {
            name: 'Frane Lukin',
            email: 'blueskyandsea01@email.com',
          },
        },
        servers: [
          {
            url: 'http://localhost:3000/books',
          },
        ],
      },
      apis: [path.resolve(__dirname, './docs/**/*.yml')],
    };

    const specs = swaggerJsdoc(options);
    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(specs, { explorer: true }),
    );
    this.app.use((req, res, next) => {
      const error = new AppError('Not found', false, 404);
      throw error;
    });
    this.app.use(errorHandler);
  }
}
export default App;
