/**
 * Strapi Application Bootstrap
 */

import Strapi from '@strapi/strapi';

async function bootstrap() {
  try {
    const strapi = await Strapi().start();
    console.log('🚀 Strapi server started successfully');
  } catch (error) {
    console.error('❌ Error starting Strapi server:', error);
    process.exit(1);
  }
}

bootstrap();
