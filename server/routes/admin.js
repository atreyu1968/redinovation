import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// Get system status
router.get('/status', async (req, res) => {
  try {
    const dbStatus = await db.get('PRAGMA quick_check');
    const stats = {
      database: dbStatus === 'ok',
      lastCheck: new Date().toISOString()
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system configuration
router.get('/config', async (req, res) => {
  try {
    const config = await db.get('SELECT * FROM system_config');
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update system configuration
router.put('/config', async (req, res) => {
  try {
    const { branding, email, integrations } = req.body;
    
    await db.run('BEGIN TRANSACTION');

    // Update branding config
    if (branding) {
      await db.run(
        `UPDATE system_config SET 
          logoUrl = ?, faviconUrl = ?, primaryColor = ?,
          secondaryColor = ?, accentColor = ?, font = ?
        WHERE id = 1`,
        [
          branding.logoUrl,
          branding.faviconUrl,
          branding.colors.primary,
          branding.colors.secondary,
          branding.colors.accent,
          branding.font
        ]
      );
    }

    // Update email config
    if (email) {
      await db.run(
        `UPDATE email_config SET
          provider = ?, host = ?, port = ?, username = ?,
          password = ?, fromName = ?, fromEmail = ?, enabled = ?
        WHERE id = 1`,
        [
          email.provider,
          email.settings.host,
          email.settings.port,
          email.settings.username,
          email.settings.password,
          email.settings.fromName,
          email.settings.fromEmail,
          email.enabled ? 1 : 0
        ]
      );
    }

    // Update integrations config
    if (integrations) {
      for (const [key, value] of Object.entries(integrations)) {
        await db.run(
          `UPDATE integration_config SET
            enabled = ?, settings = ?
          WHERE name = ?`,
          [value.enabled ? 1 : 0, JSON.stringify(value.settings), key]
        );
      }
    }

    await db.run('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await db.run('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
});

export default router;