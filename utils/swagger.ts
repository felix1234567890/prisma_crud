import path from 'path';

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
  apis: [path.resolve(__dirname, '../docs/**/*.yml')],
};
export default options;
