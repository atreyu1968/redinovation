import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// Get observatory items with filters
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM observatory_items WHERE 1=1';
    const params = [];

    // Apply filters
    if (req.query.type) {
      query += ' AND type = ?';
      params.push(req.query.type);
    }

    if (req.query.network) {
      query += ' AND network = ?';
      params.push(req.query.network);
    }

    if (req.query.topic) {
      query += ' AND topic = ?';
      params.push(req.query.topic);
    }

    if (req.query.startDate) {
      query += ' AND publishDate >= ?';
      params.push(req.query.startDate);
    }

    if (req.query.endDate) {
      query += ' AND publishDate <= ?';
      params.push(req.query.endDate);
    }

    // Get items with tags
    const items = await db.all(query, params);
    const itemTags = await db.all('SELECT * FROM observatory_item_tags');

    // Map tags to items
    const fullItems = items.map(item => ({
      ...item,
      tags: itemTags
        .filter(it => it.itemId === item.id)
        .map(it => it.tag),
    }));

    res.json(fullItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create observatory item
router.post('/', async (req, res) => {
  try {
    const {
      type,
      network,
      title,
      topic,
      description,
      resourceUrl,
      publishDate,
      tags,
    } = req.body;

    await db.run('BEGIN TRANSACTION');

    // Insert item
    const itemId = Date.now().toString();
    await db.run(
      `INSERT INTO observatory_items (
        id, type, network, title, topic, description,
        resourceUrl, publishDate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        itemId, type, network, title, topic, description,
        resourceUrl, publishDate
      ]
    );

    // Insert tags
    for (const tag of tags) {
      await db.run(
        'INSERT INTO observatory_item_tags (itemId, tag) VALUES (?, ?)',
        [itemId, tag]
      );
    }

    await db.run('COMMIT');
    res.status(201).json({ id: itemId });
  } catch (error) {
    await db.run('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
});

// Import items from CSV/Excel
router.post('/import', async (req, res) => {
  try {
    const { items } = req.body;

    await db.run('BEGIN TRANSACTION');

    const importedItems = [];
    const errors = [];

    for (const [index, item] of items.entries()) {
      try {
        // Validate required fields
        if (!item.title || !item.description || !item.resourceUrl) {
          throw new Error('Missing required fields');
        }

        // Insert item
        const itemId = Date.now().toString() + index;
        await db.run(
          `INSERT INTO observatory_items (
            id, type, network, title, topic, description,
            resourceUrl, publishDate
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            itemId,
            item.type || 'practice',
            item.network,
            item.title,
            item.topic,
            item.description,
            item.resourceUrl,
            item.publishDate || new Date().toISOString().split('T')[0]
          ]
        );

        // Insert tags
        const tags = item.tags?.split(',').map((t: string) => t.trim()) || [];
        for (const tag of tags) {
          await db.run(
            'INSERT INTO observatory_item_tags (itemId, tag) VALUES (?, ?)',
            [itemId, tag]
          );
        }

        importedItems.push(itemId);
      } catch (error) {
        errors.push({
          row: index + 2,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    await db.run('COMMIT');
    res.json({ imported: importedItems.length, errors });
  } catch (error) {
    await db.run('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
});

export default router;