import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as net from 'net';

// Function to check if a port is available
const isPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = net.createServer()
      .once('error', () => {
        resolve(false);
      })
      .once('listening', () => {
        server.close();
        resolve(true);
      })
      .listen(port);
  });
};

// Function to find an available port
const findAvailablePort = async (startPort: number): Promise<number> => {
  let port = startPort;
  const maxPort = startPort + 100; // Try up to 100 ports after the start port
  
  while (port < maxPort) {
    if (await isPortAvailable(port)) {
      return port;
    }
    port++;
  }
  throw new Error(`No available ports found between ${startPort} and ${maxPort}`);
};

async function bootstrap() {
  try {
    // Find available ports for both app and debug
    const initialAppPort = parseInt(process.env.PORT || '3000', 10);
    const initialDebugPort = parseInt(process.env.DEBUG_PORT || '9229', 10);
    
    const appPort = await findAvailablePort(initialAppPort);
    const debugPort = await findAvailablePort(initialDebugPort);

    // Set debug port for Node.js inspector
    process.env.DEBUG_PORT = debugPort.toString();
    
    // Create the NestJS application
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'debug', 'verbose'],
    });
    
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

    // Start the server
    await app.listen(appPort);
    
    // Log information about ports
    if (appPort !== initialAppPort) {
      console.log(`⚠️  Port ${initialAppPort} was in use, switched to port ${appPort}`);
    }
    if (debugPort !== initialDebugPort) {
      console.log(`⚠️  Debug port ${initialDebugPort} was in use, switched to port ${debugPort}`);
    }
    
    console.log(`🚀 Application is running on: http://localhost:${appPort}`);
    console.log(`📚 Swagger documentation is available at: http://localhost:${appPort}/api`);
    console.log(`🔍 Debug port is running on: ${debugPort}`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
