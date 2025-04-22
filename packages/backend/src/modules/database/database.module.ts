import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      // Vì ConfigModule đã được set global nên không cần import lại
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        console.log('Connecting to MongoDB with URI:', uri ? `${uri.substring(0, 15)}...` : 'undefined');
        
        return {
          uri: uri,
          connectionFactory: (connection) => {
            console.log('MongoDB connection factory called');
            connection.on('error', (error) => {
              console.error('MongoDB connection error:', error);
            });
            connection.on('disconnected', () => {
              console.log('MongoDB disconnected');
            });
            connection.on('connected', () => {
              console.log('MongoDB connected successfully');
              // Log the collections in the database
              connection.db.listCollections().toArray((err, collections) => {
                if (err) {
                  console.error('Error listing collections:', err);
                } else {
                  console.log('Available collections:', collections.map(c => c.name).join(', '));
                }
              });
            });
            return connection;
          },
          connectionErrorFactory: (error) => {
            console.error('MongoDB connection error in factory:', error);
            return error;
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
