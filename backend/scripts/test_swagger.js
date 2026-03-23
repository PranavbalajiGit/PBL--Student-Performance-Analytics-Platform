const swaggerSpec = require('../config/swagger.js');
if (swaggerSpec && swaggerSpec.paths) {
  console.log('Swagger definition generated successfully!');
  console.log(`Found ${Object.keys(swaggerSpec.paths).length} API paths documented.`);
  process.exit(0);
} else {
  console.error('Failed to generate Swagger definition.');
  process.exit(1);
}
