import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { 
  PhotographyService, 
  PhotographyPackageType,
  PhotographyServiceStatus 
} from '../../models/photography.model';

@Injectable()
export class PhotographySeedService {
  constructor(
    @InjectModel(PhotographyService.name) 
    private photographyServiceModel: Model<PhotographyService>
  ) {}

  async seed() {
    const count = await this.photographyServiceModel.countDocuments();
    if (count > 0) {
      console.log('Photography services already exist, skipping seed');
      return;
    }

    const sampleServices = [
      {
        name: 'Pre-Wedding Classic Package',
        packageType: PhotographyPackageType.PRE_WEDDING,
        description: 'Capture the romance and excitement before your big day with our classic pre-wedding photoshoot package.',
        price: 599,
        duration: '4 hours',
        location: 'Studio or one outdoor location',
        photographer: 'Professional photographer with 5+ years experience',
        status: PhotographyServiceStatus.AVAILABLE,
        imageUrls: [
          'https://images.unsplash.com/photo-1583939003579-730e3918a45a',
          'https://images.unsplash.com/photo-1537633552985-df8429e8048b'
        ],
        features: [
          '4-hour photoshoot session',
          '2 outfit changes',
          '100+ professionally edited photos',
          'Online gallery for sharing'
        ]
      },
      {
        name: 'Wedding Day Complete Coverage',
        packageType: PhotographyPackageType.WEDDING_DAY,
        description: 'Comprehensive coverage of your special day from start to finish with our professional team.',
        price: 1299,
        duration: '8 hours',
        location: 'Ceremony & reception venues',
        photographer: 'Lead photographer + assistant',
        status: PhotographyServiceStatus.AVAILABLE,
        imageUrls: [
          'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6',
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc'
        ],
        features: [
          '8-hour coverage with 2 photographers',
          'Getting ready, ceremony & reception',
          '300+ professionally edited photos',
          'Premium wedding album (30 pages)'
        ]
      },
      {
        name: 'Studio Portrait Session',
        packageType: PhotographyPackageType.STUDIO,
        description: 'Professional studio portraits with controlled lighting and premium backdrops.',
        price: 399,
        duration: '2 hours',
        location: 'Indoor studio',
        photographer: 'Studio specialist photographer',
        status: PhotographyServiceStatus.AVAILABLE,
        imageUrls: [
          'https://images.unsplash.com/photo-1611042553365-9b564ddd7929',
          'https://images.unsplash.com/photo-1581192322313-56037681608d'
        ],
        features: [
          '2-hour studio session',
          '3 backdrop options',
          '50+ professionally edited photos',
          'Digital delivery within 7 days'
        ]
      },
      {
        name: 'Outdoor Adventure Session',
        packageType: PhotographyPackageType.OUTDOOR,
        description: 'Capture stunning natural moments in beautiful outdoor settings.',
        price: 699,
        duration: '5 hours',
        location: 'Beach, mountain, or park settings',
        photographer: 'Outdoor specialist photographer',
        status: PhotographyServiceStatus.AVAILABLE,
        imageUrls: [
          'https://images.unsplash.com/photo-1583939411023-14607f6ad381',
          'https://images.unsplash.com/photo-1591604466107-ec97de577aff'
        ],
        features: [
          '5-hour outdoor session',
          'Multiple locations possible',
          '150+ professionally edited photos',
          'Sunset/golden hour timing option'
        ]
      },
      {
        name: 'Custom Photography Package',
        packageType: PhotographyPackageType.CUSTOM,
        description: 'Tailor-made photography package designed to your specific requirements.',
        price: 999,
        duration: 'Custom',
        location: 'Your choice',
        photographer: 'Matched to your specific needs',
        status: PhotographyServiceStatus.AVAILABLE,
        imageUrls: [
          'https://images.unsplash.com/photo-1522673607200-164d1b3ce551',
          'https://images.unsplash.com/photo-1494774157365-9e04c6720e47'
        ],
        features: [
          'Flexible session duration',
          'Multiple locations possible',
          'Custom number of edited photos',
          'Add-on services available (drone, video, etc.)'
        ]
      }
    ];

    await this.photographyServiceModel.insertMany(sampleServices);
    console.log('Added sample photography services');
  }
}
