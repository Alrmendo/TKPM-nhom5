import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('TKPM API')
    .setDescription('The TKPM API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Function to check if a port is available
  const isPortAvailable = async (port: number): Promise<boolean> => {
    try {
      await app.listen(port);
      await app.close();
      return true;
    } catch {
      return false;
    }
  };

  // Function to find an available port
  const findAvailablePort = async (startPort: number): Promise<number> => {
    let port = startPort;
    while (!(await isPortAvailable(port))) {
      port++;
    }
    return port;
  };

  // Get initial port from environment variable or use default
  const initialPort = parseInt(process.env.PORT || '3000', 10);
  
  // Find and use an available port
  const port = await findAvailablePort(initialPort);
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api`);
}
bootstrap();
