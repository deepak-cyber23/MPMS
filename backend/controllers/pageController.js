import { dbRepository } from '../utils/store.js';
import { sanitizeInput } from '../middleware/authMiddleware.js';

export const getPages = async (_req, res) => {
  try {
    const pages = await dbRepository.getAllPages();
    return res.json({
      success: true,
      pages,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to load website page content.',
    });
  }
};

export const updatePage = async (req, res) => {
  try {
    const slug = sanitizeInput(req.params.slug) || 'about-us';
    const updates = {};

    if (req.body.title !== undefined) updates.title = sanitizeInput(req.body.title);
    if (req.body.subtitle !== undefined) updates.subtitle = sanitizeInput(req.body.subtitle);
    if (req.body.content !== undefined) updates.content = sanitizeInput(req.body.content);
    if (req.body.mission !== undefined) updates.mission = sanitizeInput(req.body.mission);
    if (req.body.vision !== undefined) updates.vision = sanitizeInput(req.body.vision);
    if (req.body.contactEmail !== undefined)
      updates.contactEmail = sanitizeInput(req.body.contactEmail);
    if (req.body.contactPhone !== undefined)
      updates.contactPhone = sanitizeInput(req.body.contactPhone);
    if (req.body.headquarters !== undefined)
      updates.headquarters = sanitizeInput(req.body.headquarters);
    if (req.body.workingHours !== undefined)
      updates.workingHours = sanitizeInput(req.body.workingHours);

    const updated = await dbRepository.updatePageBySlug(slug, updates);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Website page not found.',
      });
    }

    return res.json({
      success: true,
      message: 'Website page content updated in MongoDB.',
      page: updated,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to update page content.',
    });
  }
};
