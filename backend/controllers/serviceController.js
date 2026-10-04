import { dbRepository } from '../utils/store.js';
import { sanitizeInput } from '../middleware/authMiddleware.js';

export const getServices = async (req, res) => {
  try {
    const status = req.query.status ? String(req.query.status) : undefined;
    const services = await dbRepository.getAllServices(status);
    return res.json({
      success: true,
      count: services.length,
      services,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch services from MongoDB.',
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await dbRepository.getServiceByIdOrSlug(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Requested moving service was not found.',
      });
    }
    return res.json({
      success: true,
      service,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Error retrieving service details.',
    });
  }
};

export const createService = async (req, res) => {
  try {
    const name = sanitizeInput(req.body.name);
    const category = sanitizeInput(req.body.category) || 'Relocation Logistics';
    const shortDescription = sanitizeInput(req.body.shortDescription || req.body.description);
    const description = sanitizeInput(req.body.description);
    const image =
      sanitizeInput(req.body.image) ||
      '/assets/images/service_house_shifting_1791097439455.jpg';
    const basePrice = Number(req.body.basePrice) || 5000;
    const priceUnit = sanitizeInput(req.body.priceUnit) || 'Standard Package';
    const estimatedDuration = sanitizeInput(req.body.estimatedDuration) || '1 - 2 Days';
    const status = req.body.status === 'Inactive' ? 'Inactive' : 'Active';

    const features = Array.isArray(req.body.features)
      ? req.body.features.map((f) => sanitizeInput(f)).filter(Boolean)
      : String(req.body.features || '')
          .split('\n')
          .map((f) => sanitizeInput(f))
          .filter(Boolean);

    const benefits = Array.isArray(req.body.benefits)
      ? req.body.benefits.map((b) => sanitizeInput(b)).filter(Boolean)
      : String(req.body.benefits || '')
          .split('\n')
          .map((b) => sanitizeInput(b))
          .filter(Boolean);

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Service name and detailed description are required.',
      });
    }

    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Math.floor(100 + Math.random() * 900);

    const created = await dbRepository.createService({
      name,
      slug,
      category,
      shortDescription: shortDescription.slice(0, 180),
      description,
      image,
      basePrice,
      priceUnit,
      estimatedDuration,
      features:
        features.length > 0
          ? features
          : ['Multi-layer protective packaging', 'Trained handling crew'],
      benefits:
        benefits.length > 0 ? benefits : ['Safe transit assurance', 'Transparent tariff'],
      status,
    });

    return res.status(201).json({
      success: true,
      message: 'Service created and persisted in MongoDB.',
      service: created,
    });
  } catch (err) {
    console.error('[Create Service Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create service in database.',
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const existing = await dbRepository.getServiceByIdOrSlug(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    const updates = {};
    if (req.body.name !== undefined) updates.name = sanitizeInput(req.body.name);
    if (req.body.category !== undefined) updates.category = sanitizeInput(req.body.category);
    if (req.body.shortDescription !== undefined)
      updates.shortDescription = sanitizeInput(req.body.shortDescription);
    if (req.body.description !== undefined) updates.description = sanitizeInput(req.body.description);
    if (req.body.image !== undefined) updates.image = sanitizeInput(req.body.image);
    if (req.body.basePrice !== undefined) updates.basePrice = Number(req.body.basePrice);
    if (req.body.priceUnit !== undefined) updates.priceUnit = sanitizeInput(req.body.priceUnit);
    if (req.body.estimatedDuration !== undefined)
      updates.estimatedDuration = sanitizeInput(req.body.estimatedDuration);
    if (req.body.status !== undefined)
      updates.status = req.body.status === 'Inactive' ? 'Inactive' : 'Active';

    if (req.body.features !== undefined) {
      updates.features = Array.isArray(req.body.features)
        ? req.body.features.map((f) => sanitizeInput(f)).filter(Boolean)
        : String(req.body.features)
            .split('\n')
            .map((f) => sanitizeInput(f))
            .filter(Boolean);
    }

    if (req.body.benefits !== undefined) {
      updates.benefits = Array.isArray(req.body.benefits)
        ? req.body.benefits.map((b) => sanitizeInput(b)).filter(Boolean)
        : String(req.body.benefits)
            .split('\n')
            .map((b) => sanitizeInput(b))
            .filter(Boolean);
    }

    const updated = await dbRepository.updateService(existing._id, updates);
    return res.json({
      success: true,
      message: 'Service updated successfully in MongoDB.',
      service: updated,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to update service.',
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const deleted = await dbRepository.deleteService(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Service not found in MongoDB.',
      });
    }
    return res.json({
      success: true,
      message: 'Service deleted permanently from MongoDB.',
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Error deleting service.',
    });
  }
};
