const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const cloudinary = require('cloudinary').v2;

// Load .env if not already set
if (!process.env.CLOUDINARY_NAME) {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx > -1) {
        const key = trimmed.substring(0, idx).trim();
        let val = trimmed.substring(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

async function main() {
  const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
  if (!fs.existsSync(dbPath)) {
    console.error('Database not found at', dbPath);
    process.exit(1);
  }

  // Backup database
  const backupPath = path.join(__dirname, '..', '.tmp', 'data.db.backup');
  fs.copyFileSync(dbPath, backupPath);
  console.log(`[Backup] Database backed up to ${backupPath}`);

  const db = new Database(dbPath, { timeout: 10000 });

  const files = db.prepare("SELECT * FROM files WHERE provider = 'local'").all();
  console.log(`Found ${files.length} local files to upload to Cloudinary.`);

  if (files.length === 0) {
    console.log('No local files left to sync!');
    process.exit(0);
  }

  const updateStmt = db.prepare(`
    UPDATE files
    SET url = ?, provider = 'cloudinary', provider_metadata = ?, formats = ?
    WHERE id = ?
  `);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(__dirname, '..', 'public', file.url);

    if (!fs.existsSync(filePath)) {
      console.warn(`[${i + 1}/${files.length}] File not found on disk: ${filePath}`);
      continue;
    }

    const isVideo = file.ext === '.mp4' || file.mime?.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';

    console.log(`[${i + 1}/${files.length}] Uploading ${file.name} (${(file.size / 1024).toFixed(1)} KB, ${resourceType})...`);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'tsp_lead_magnet',
        resource_type: resourceType,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });

      // Update formats so thumbnails point to Cloudinary instead of broken local paths
      let updatedFormats = file.formats;
      if (file.formats && typeof file.formats === 'string') {
        try {
          const parsed = JSON.parse(file.formats);
          for (const key of Object.keys(parsed)) {
            // Point format URL to the secure Cloudinary URL
            parsed[key].url = result.secure_url;
            parsed[key].provider_metadata = {
              public_id: result.public_id,
              resource_type: result.resource_type,
            };
          }
          updatedFormats = JSON.stringify(parsed);
        } catch {
          // keep original if parse fails
        }
      }

      const providerMetadata = JSON.stringify({
        public_id: result.public_id,
        resource_type: result.resource_type,
      });

      updateStmt.run(result.secure_url, providerMetadata, updatedFormats, file.id);
      console.log(`  ✓ Uploaded & updated id ${file.id}: ${result.secure_url}`);
      successCount++;
    } catch (err) {
      console.error(`  ✗ Failed to upload ${file.name}:`, err.message || err);
      errorCount++;
    }
  }

  console.log('\n--- Sync Complete ---');
  console.log(`Successfully migrated: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Remaining local files: ${files.length - successCount}`);
}

main().catch((err) => {
  console.error('Fatal error in sync:', err);
  process.exit(1);
});
