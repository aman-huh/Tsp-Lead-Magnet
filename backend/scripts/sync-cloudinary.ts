const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { createStrapi } = require('@strapi/strapi');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

async function sync() {
  const strapi = await createStrapi().load();

  console.log('Fetching local files from Strapi...');
  const files = await strapi.db.query('plugin::upload.file').findMany({
    where: {
      provider: 'local',
    },
  });

  console.log(`Found ${files.length} local images to migrate to Cloudinary.`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Skip heavy screen recording if present
    if (file.name.includes('Screen_Recording') || file.size > 20000) {
      console.log(`Skipping large file: ${file.name}`);
      continue;
    }

    const filePath = path.join(__dirname, '..', 'public', file.url);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    try {
      console.log(`[${i + 1}/${files.length}] Uploading ${file.name}...`);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'tsp_lead_magnet',
        use_filename: true,
        unique_filename: false,
      });

      // Update database URL to the Cloudinary URL
      await strapi.db.query('plugin::upload.file').update({
        where: { id: file.id },
        data: {
          url: result.secure_url,
          provider: 'cloudinary',
          provider_metadata: {
            public_id: result.public_id,
            resource_type: result.resource_type,
          },
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : (err as any)?.message || String(err);
      console.error(`Error uploading ${file.name}:`, message);
    }
  }

  console.log('All images uploaded and linked to Cloudinary!');
  process.exit(0);
}

sync();
