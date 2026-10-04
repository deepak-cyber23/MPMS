import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import AdminModel from '../models/Admin.js';
import UserModel from '../models/User.js';
import ServiceModel from '../models/Service.js';
import BookingModel from '../models/Booking.js';
import EnquiryModel from '../models/Enquiry.js';
import PageModel from '../models/Page.js';

const DATA_DIR = path.resolve(process.cwd(), 'backend', 'data');
const DB_FILE = path.join(DATA_DIR, 'mpms_mongodb_collections.json');

let useLiveMongo = false;
let memoryStore = {
  admins: [],
  users: [],
  services: [],
  bookings: [],
  enquiries: [],
  pages: [],
};

export const generateObjectId = () => new mongoose.Types.ObjectId().toHexString();

const saveToDisk = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('[MPMS Store] Failed to persist collection data:', err);
  }
};

const getInitialSeedData = async () => {
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const customerPasswordHash = await bcrypt.hash('Customer@123', 10);

  const admins = [
    {
      _id: '6701a1000000000000000001',
      name: 'Vikramaditya Rao',
      email: 'admin@mpms.com',
      passwordHash: adminPasswordHash,
      phone: '+91 98450 77890',
      role: 'Super Admin',
      designation: 'Chief Logistics & Fleet Director',
      createdAt: '2026-01-10T08:00:00.000Z',
      updatedAt: '2026-09-28T10:30:00.000Z',
    },
  ];

  const services = [
    {
      _id: '6701b1000000000000000001',
      name: 'House Shifting',
      slug: 'house-shifting',
      category: 'Residential Relocation',
      shortDescription:
        'End-to-end household goods packing, multi-layer cushioning, dismantled furniture transit, and room-by-room placement.',
      description:
        'Our flagship House Shifting service eliminates residential relocation stress through systematic pre-move inventory surveying, 5-ply corrugated box packing, bubble-wrap edge guarding for fragile glassware, and hydraulic tail-lift loading. Dedicated move coordinators supervise every step from origin disassembly to destination reassembly.',
      image: '/assets/images/service_house_shifting_1791097439455.jpg',
      basePrice: 6500,
      priceUnit: '1 BHK — 4 BHK Villa',
      estimatedDuration: '6 - 14 Hours (Local) / 2 - 5 Days (Intercity)',
      features: [
        '5-layer corrugated & foam-lined protective packing',
        'Carpentry support for modular beds, wardrobes & TV units',
        'Dedicated closed-body weatherproof container truck',
        'Barcode-tagged carton inventory checklist',
      ],
      benefits: [
        'Zero breakage guarantee on packed fragile kitchenware & electronics',
        'Single point-of-contact Move Supervisor from pickup to setup',
        'Transparent volume-based pricing with no hidden floor charges',
      ],
      status: 'Active',
      createdAt: '2026-01-15T09:00:00.000Z',
      updatedAt: '2026-09-15T09:00:00.000Z',
    },
    {
      _id: '6701b1000000000000000002',
      name: 'Office Relocation',
      slug: 'office-relocation',
      category: 'Commercial & Corporate',
      shortDescription:
        'Zero-downtime corporate IT infrastructure, server rack, ergonomic workstation, and archival file relocation.',
      description:
        'Engineered for enterprises, startups, and commercial establishments, our Office Relocation protocol operates on weekend or overnight schedules to guarantee business continuity. IT servers, dual-monitor desks, conference room AV equipment, and confidential documents are crated in anti-static, tamper-evident rolling bins.',
      image: '/assets/images/service_office_relocation_1791097452333.jpg',
      basePrice: 18500,
      priceUnit: 'Per 15-Seat Floor Plan',
      estimatedDuration: '12 - 36 Hours (Weekend Window)',
      features: [
        'Anti-static bubble & hard-case crating for servers and monitors',
        'Color-coded floor-zone labeling for rapid desk re-deployment',
        'Overnight & weekend execution to prevent work-hour downtime',
        'Heavy safe, plotter, and UPS battery bank rigging equipment',
      ],
      benefits: [
        'Employees resume work Monday morning with IT setups intact',
        'Strict chain-of-custody protocol for enterprise assets',
        'GST-compliant commercial invoicing and transit insurance cover',
      ],
      status: 'Active',
      createdAt: '2026-01-16T10:00:00.000Z',
      updatedAt: '2026-09-16T10:00:00.000Z',
    },
    {
      _id: '6701b1000000000000000003',
      name: 'Vehicle Transportation',
      slug: 'vehicle-transportation',
      category: 'Automotive Transit',
      shortDescription:
        'Enclosed hydraulic car carrier and two-wheeler wheel-chock crating across 180+ national highway corridors.',
      description:
        'Transport your sedan, SUV, luxury EV, or superbike without adding a single kilometer to the odometer. Our specialized enclosed car carriers utilize hydraulic ramp loading, soft nylon wheel-straps (never metal chains), and GPS-monitored national highway convoys with door-to-door inspection reports.',
      image: '/assets/images/service_vehicle_transport_1791097464435.jpg',
      basePrice: 9200,
      priceUnit: 'Two-Wheeler / Four-Wheeler Carrier',
      estimatedDuration: '3 - 7 Days (Pan-India Corridor)',
      features: [
        'Hydraulic ramp enclosed multi-car & single-car carriers',
        '360-degree pre-loading dent, scratch & odometer condition report',
        'Soft nylon wheel-lock harnesses & shock-absorbing suspension',
        'Dedicated foam-wrapped timber crating for motorcycles & scooters',
      ],
      benefits: [
        'Complete protection from highway stone chips, dust, and rain',
        'Zero tire wear and zero odometer accumulation during transit',
        'Daily corridor checkpoint updates until doorstep handover',
      ],
      status: 'Active',
      createdAt: '2026-01-18T11:00:00.000Z',
      updatedAt: '2026-09-18T11:00:00.000Z',
    },
    {
      _id: '6701b1000000000000000004',
      name: 'Packing & Unpacking',
      slug: 'packing-unpacking',
      category: 'Specialized Handling',
      shortDescription:
        'White-glove export-grade crating, wardrobe hanger boxes, kitchenware cell dividers, and full destination unpacking.',
      description:
        'Whether you have already arranged transport or require museum-grade protection for heirlooms, chandeliers, pianos, and glassware, our trained packing crew arrives with industrial-grade consumables. At your destination, we unbox every carton, arrange kitchen cabinets, and clear 100% of packing debris.',
      image: '/assets/images/service_house_shifting_1791097439455.jpg',
      basePrice: 3800,
      priceUnit: 'Full Material + Crew Package',
      estimatedDuration: '4 - 8 Hours',
      features: [
        'Double-wall corrugated cartons, cellular glass dividers & stretch film',
        'Portable wardrobe boxes keeping formal attire crease-free on hangers',
        'Custom wooden slat crating for marble tables, artwork & LED TVs',
        'Complete post-move debris removal and carton recycling',
      ],
      benefits: [
        'Saves 20+ hours of exhausting manual packing before moving day',
        'Export-grade cushioning prevents vibration damage on long routes',
        'Immediate home livability on day one with full unpacking support',
      ],
      status: 'Active',
      createdAt: '2026-01-20T12:00:00.000Z',
      updatedAt: '2026-09-20T12:00:00.000Z',
    },
    {
      _id: '6701b1000000000000000005',
      name: 'Loading & Unloading',
      slug: 'loading-unloading',
      category: 'Trained Labor & Rigging',
      shortDescription:
        'Certified material-handling crew equipped with stair-climbing dollies, hydraulic pallet jacks, and furniture sliders.',
      description:
        'Improper lifting is the leading cause of both furniture damage and personal injury during a move. Our uniformed loading specialists use weight-distribution stacking matrices inside the container truck—placing heavy appliances at the bulkhead and securing tiers with industrial ratchet straps.',
      image: '/assets/images/hero_logistics_relocation_1791097426059.jpg',
      basePrice: 2900,
      priceUnit: '4-Member Certified Crew',
      estimatedDuration: '3 - 6 Hours',
      features: [
        'Heavy-duty L-type hand trucks, neoprene floor runners & shoulder harnesses',
        'High-density foam padding along doorways, banisters, and elevator walls',
        'Scientific center-of-gravity container stacking with ratchet tie-downs',
        'Safe rope-and-pulley balcony hoisting for oversized sofas where needed',
      ],
      benefits: [
        'Zero scratches to apartment corridors, wooden floors, or door frames',
        'Prevents internal cargo shifting during sudden highway braking',
        'Fully insured, background-verified material handling technicians',
      ],
      status: 'Active',
      createdAt: '2026-01-22T12:00:00.000Z',
      updatedAt: '2026-09-21T12:00:00.000Z',
    },
    {
      _id: '6701b1000000000000000006',
      name: 'Local Shifting',
      slug: 'local-shifting',
      category: 'Intra-City Express',
      shortDescription:
        'Same-day intra-city residential and studio relocation with dedicated mini-trucks and rapid 8-hour turnaround.',
      description:
        'Moving within the same metropolitan area requires speed, society gate-pass coordination, and nimble fleet sizing. Our Local Shifting service deploys 8ft Tata Ace or 14ft Eicher closed containers tailored to urban apartment complexes, completing packing, transit, and placement before evening.',
      image: '/assets/images/service_house_shifting_1791097439455.jpg',
      basePrice: 4800,
      priceUnit: 'Same-Day City Move (Within 40 km)',
      estimatedDuration: '5 - 9 Hours (Same Day)',
      features: [
        'Right-sized urban fleet (8ft, 10ft, 14ft, and 17ft closed vehicles)',
        'Pre-scheduled timing aligned with apartment RWA lift rules',
        'Appliance disconnection & reconnection support (washing machine, RO, TV)',
        'Fixed all-inclusive city tariff with fuel and toll included',
      ],
      benefits: [
        'Move out in the morning and sleep in your fully set up new home tonight',
        'No overnight storage fees or multi-day disruption to family routines',
        'Familiarity with local urban traffic windows and society regulations',
      ],
      status: 'Active',
      createdAt: '2026-01-25T12:00:00.000Z',
      updatedAt: '2026-09-22T12:00:00.000Z',
    },
    {
      _id: '6701b1000000000000000007',
      name: 'Intercity Relocation',
      slug: 'intercity-relocation',
      category: 'National Long-Haul',
      shortDescription:
        'Long-distance interstate household & corporate relocation across all major Indian metros with sealed GPS containers.',
      description:
        'Relocating across state borders demands moisture-proof packaging, digital e-Way bill documentation, and seasoned highway drivers. We offer both Dedicated Container options for rapid direct delivery and Part-Load Consolidated cubicles for cost-effective 1 BHK or student interstate moves.',
      image: '/assets/images/hero_logistics_relocation_1791097426059.jpg',
      basePrice: 14500,
      priceUnit: 'Interstate Corridor Tariff',
      estimatedDuration: '3 - 6 Days (Distance Dependent)',
      features: [
        'Tamper-evident numbered security seals locked in customer presence',
        'Waterproof tarpaulin & silica-gel moisture control inside steel containers',
        'Flexible Dedicated Full-Truckload (FTL) or Shared Part-Load (PTL) options',
        'Automated milestone status updates at every state border hub',
      ],
      benefits: [
        'Guaranteed delivery window with proactive transit tracking',
        'Up to 40% cost savings on smaller shipments via Shared Cube allocation',
        'Comprehensive all-risk transit insurance documentation',
      ],
      status: 'Active',
      createdAt: '2026-01-28T12:00:00.000Z',
      updatedAt: '2026-09-24T12:00:00.000Z',
    },
    {
      _id: '6701b1000000000000000008',
      name: 'Storage / Warehouse',
      slug: 'storage-warehouse',
      category: 'Climate-Controlled Vaults',
      shortDescription:
        '24/7 CCTV-monitored, pest-free, palletized household and commercial warehousing with flexible weekly or monthly plans.',
      description:
        'Renovating your home, traveling abroad on an onsite deputation, or awaiting possession of a new apartment? Store your household furniture, appliances, or commercial inventory in our raised-floor, fire-suppressed, palletized logistics hubs with barcoded digital inventory retrieval.',
      image: '/assets/images/service_office_relocation_1791097452333.jpg',
      basePrice: 3200,
      priceUnit: 'Per Month (1 BHK Pallet Bay)',
      estimatedDuration: 'Flexible (1 Week to 24 Months)',
      features: [
        'Elevated wooden pallet bays wrapped in dust-proof industrial shrink film',
        '24/7 infrared CCTV surveillance, biometric access & fire sprinklers',
        'Bi-weekly professional pest & humidity control audits',
        'On-demand partial or full retrieval delivered to any city address',
      ],
      benefits: [
        'Eliminates paying full apartment rent solely to store furniture',
        'Digital photo-cataloged manifest of every stored carton and item',
        'Seamless bridge between move-out date and new home possession',
      ],
      status: 'Active',
      createdAt: '2026-02-01T12:00:00.000Z',
      updatedAt: '2026-09-25T12:00:00.000Z',
    },
  ];

  const users = [
    {
      _id: '6701c1000000000000000001',
      name: 'Arjun Mehta',
      email: 'arjun.mehta@techcorp.in',
      mobile: '9845123401',
      passwordHash: customerPasswordHash,
      city: 'Bengaluru',
      address: 'Flat 402, Prestige Shantiniketan, Whitefield, Bengaluru',
      totalBookings: 2,
      createdAt: '2026-08-12T10:15:00.000Z',
      updatedAt: '2026-09-28T14:20:00.000Z',
    },
    {
      _id: '6701c1000000000000000002',
      name: 'Priya Nair',
      email: 'priya.nair@designstudio.co',
      mobile: '9820456712',
      passwordHash: customerPasswordHash,
      city: 'Mumbai',
      address: 'B-1204, Oberoi Woods, Goregaon East, Mumbai',
      totalBookings: 1,
      createdAt: '2026-08-20T11:30:00.000Z',
      updatedAt: '2026-09-25T09:10:00.000Z',
    },
    {
      _id: '6701c1000000000000000003',
      name: 'Rohan Deshmukh',
      email: 'rohan.d@finserve.org',
      mobile: '9765098123',
      passwordHash: customerPasswordHash,
      city: 'Pune',
      address: 'Villa 18, Amanora Park Town, Hadapsar, Pune',
      totalBookings: 2,
      createdAt: '2026-09-01T15:45:00.000Z',
      updatedAt: '2026-09-29T16:00:00.000Z',
    },
  ];

  const bookings = [
    {
      _id: '6701d1000000000000000001',
      bookingId: 'MPMS-2026-1042',
      userId: '6701c1000000000000000001',
      name: 'Arjun Mehta',
      email: 'arjun.mehta@techcorp.in',
      mobile: '9845123401',
      pickupAddress: 'Flat 402, Prestige Shantiniketan, Whitefield, Bengaluru 560048',
      dropAddress: 'Tower B-901, My Home Bhooja, HITEC City, Hyderabad 500081',
      movingDate: '2026-10-08',
      propertyType: '3 BHK Apartment',
      rooms: '3 BHK (Living + 3 Bedrooms + Kitchen)',
      service: 'Intercity Relocation',
      serviceId: '6701b1000000000000000007',
      approximateItems:
        'King bed (2), 6-seater dining table, L-shape sofa, 55" OLED TV, 420L refrigerator, front-load washer, ~38 cartons',
      message:
        'Need wooden crating for the 55-inch OLED TV and glass dining top. Society lift available 9 AM - 6 PM.',
      estimatedCost: 24500,
      distanceKm: 575,
      status: 'Confirmed',
      remarks:
        'Dedicated 17ft Eicher container allocated (KA-01-MP-4421). Pre-move packing scheduled for Oct 7 at 10:00 AM.',
      assignedVehicle: 'Eicher 17ft Sealed Container (KA-01-MP-4421)',
      createdAt: '2026-09-26T10:30:00.000Z',
      updatedAt: '2026-09-28T14:20:00.000Z',
    },
    {
      _id: '6701d1000000000000000002',
      bookingId: 'MPMS-2026-1048',
      userId: '6701c1000000000000000002',
      name: 'Priya Nair',
      email: 'priya.nair@designstudio.co',
      mobile: '9820456712',
      pickupAddress: 'B-1204, Oberoi Woods, Goregaon East, Mumbai 400063',
      dropAddress: 'A-702, Rustomjee Elements, Andheri West, Mumbai 400053',
      movingDate: '2026-09-29',
      propertyType: '2 BHK Apartment',
      rooms: '2 BHK',
      service: 'House Shifting',
      serviceId: '6701b1000000000000000001',
      approximateItems:
        'Queen beds (2), 3-seater fabric sofa, study desk, refrigerator, microwave, 22 wardrobe & kitchen boxes',
      message: 'Please bring extra wardrobe hanger cartons for studio garments.',
      estimatedCost: 9800,
      distanceKm: 14,
      status: 'Completed',
      remarks:
        'Relocation completed on schedule. All 22 cartons unpacked and debris cleared. Signed POD uploaded.',
      assignedVehicle: 'Eicher 14ft Urban Container (MH-02-CR-8810)',
      createdAt: '2026-09-22T09:15:00.000Z',
      updatedAt: '2026-09-29T18:45:00.000Z',
    },
    {
      _id: '6701d1000000000000000003',
      bookingId: 'MPMS-2026-1053',
      userId: '6701c1000000000000000001',
      name: 'Siddharth Verma',
      email: 'siddharth.v@cloudscale.io',
      mobile: '9811567432',
      pickupAddress: '3rd Floor, CyberGreens Tower B, DLF Phase III, Gurugram 122002',
      dropAddress: '9th Floor, One Horizon Center, Golf Course Road, Gurugram 122009',
      movingDate: '2026-10-04',
      propertyType: 'Corporate Office',
      rooms: '40-Workstation Floor + 2 Server Racks',
      service: 'Office Relocation',
      serviceId: '6701b1000000000000000002',
      approximateItems:
        '40 dual-monitor workstations, 40 Herman Miller chairs, 2x 42U server racks, conference table, 65 IT crates',
      message: 'Weekend execution window required. Building facility clearance approved.',
      estimatedCost: 46000,
      distanceKm: 11,
      status: 'In Progress',
      remarks:
        'Crew of 12 technicians on-site. Server racks crated in anti-static enclosures; Truck 1 in transit to Golf Course Road.',
      assignedVehicle: '2x BharatBenz 20ft Commercial Containers',
      createdAt: '2026-09-28T11:00:00.000Z',
      updatedAt: '2026-10-04T06:30:00.000Z',
    },
  ];

  const enquiries = [
    {
      _id: '6701e1000000000000000001',
      enquiryId: 'ENQ-2026-501',
      name: 'Dr. Meenakshi Iyer',
      email: 'meenakshi.iyer@apollohealth.org',
      mobile: '9840112233',
      subject: 'Specialized crating for grand piano and antique Tanjore paintings',
      message:
        'We are relocating from Chennai to Bengaluru next month. Do you provide custom timber crating and climate-shielded packaging for an acoustic upright piano and 6 framed Tanjore paintings?',
      readStatus: 'Unread',
      remarks: '',
      createdAt: '2026-10-03T09:15:00.000Z',
      updatedAt: '2026-10-03T09:15:00.000Z',
    },
    {
      _id: '6701e1000000000000000002',
      enquiryId: 'ENQ-2026-502',
      name: 'Karan Malhotra',
      email: 'karan.m@zetafintech.in',
      mobile: '9818990011',
      subject: 'Corporate empaneled relocation partner rate card for 80 employees',
      message:
        'Our HR & People Operations team is looking to empanel MPMS for new-hire employee relocations to Bengaluru and Hyderabad. Please share your B2B corporate SLA and GST billing process.',
      readStatus: 'Unread',
      remarks: '',
      createdAt: '2026-10-02T16:40:00.000Z',
      updatedAt: '2026-10-02T16:40:00.000Z',
    },
  ];

  const pages = [
    {
      _id: '6701f1000000000000000001',
      slug: 'about-us',
      title: 'Engineered Relocation & Precision Freight Logistics',
      subtitle:
        'ISO 9001:2015 Certified National Relocation Network · 180+ Highway Corridors · 42,000+ Verified Household & Corporate Moves',
      content:
        'Founded with the mission to replace fragmented, unorganized shifting practices with standardized engineering protocols, Movers & Packers Management System (MPMS) operates a digitally tracked fleet of closed-body containers, hydraulic car carriers, and climate-controlled pallet warehouses across India. Every relocation is governed by barcoded inventory manifests, 5-layer shock-absorbent packaging standards, and trained material-handling technicians.',
      mission:
        'To deliver damage-free, on-schedule residential and commercial relocations backed by transparent volume-based pricing, real-time booking visibility, and accountable crew supervision.',
      vision:
        'To set the national benchmark for technology-driven household and enterprise relocation logistics with 100% digital chain-of-custody tracking.',
      contactEmail: 'dispatch@mpms-logistics.in',
      contactPhone: '+91 80 4568 9200',
      headquarters:
        'Plot 42, Peenya Industrial Area Phase II, Bengaluru, Karnataka 560058',
      workingHours:
        'Mon - Sun: 06:00 AM - 11:00 PM IST (24/7 National Highway Control Room)',
      updatedAt: '2026-09-25T10:00:00.000Z',
    },
  ];

  return { admins, users, services, bookings, enquiries, pages };
};

export const initializeStore = async (liveMongo) => {
  useLiveMongo = liveMongo;

  if (useLiveMongo) {
    const adminCount = await AdminModel.countDocuments();
    if (adminCount === 0) {
      const seed = await getInitialSeedData();
      await AdminModel.insertMany(seed.admins);
      await ServiceModel.insertMany(seed.services);
      await UserModel.insertMany(seed.users);
      await BookingModel.insertMany(seed.bookings);
      await EnquiryModel.insertMany(seed.enquiries);
      await PageModel.insertMany(seed.pages);
      console.log('[MPMS MongoDB] Seeded initial collections into live MongoDB.');
    }
    return;
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.services) && parsed.services.length > 0) {
        memoryStore = parsed;
        return;
      }
    } catch {
      console.warn('[MPMS Store] Re-initializing seed data.');
    }
  }

  memoryStore = await getInitialSeedData();
  saveToDisk();
};

export const dbRepository = {
  // ADMINS
  async findAdminByEmail(email) {
    const clean = email.trim().toLowerCase();
    if (useLiveMongo) {
      const doc = await AdminModel.findOne({ email: clean }).lean();
      return doc ? { ...doc, _id: String(doc._id) } : null;
    }
    return memoryStore.admins.find((a) => a.email.toLowerCase() === clean) || null;
  },

  async findAdminById(id) {
    if (useLiveMongo) {
      const doc = await AdminModel.findById(id).lean();
      return doc ? { ...doc, _id: String(doc._id) } : null;
    }
    return memoryStore.admins.find((a) => a._id === id) || memoryStore.admins[0] || null;
  },

  async updateAdmin(id, updates) {
    if (useLiveMongo) {
      const doc = await AdminModel.findByIdAndUpdate(id, updates, { new: true }).lean();
      return doc ? { ...doc, _id: String(doc._id) } : null;
    }
    const idx = memoryStore.admins.findIndex((a) => a._id === id);
    const targetIdx = idx >= 0 ? idx : 0;
    if (!memoryStore.admins[targetIdx]) return null;
    memoryStore.admins[targetIdx] = {
      ...memoryStore.admins[targetIdx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToDisk();
    return memoryStore.admins[targetIdx];
  },

  // SERVICES
  async getAllServices(statusFilter) {
    if (useLiveMongo) {
      const filter = statusFilter ? { status: statusFilter } : {};
      const docs = await ServiceModel.find(filter).sort({ createdAt: 1 }).lean();
      return docs.map((d) => ({ ...d, _id: String(d._id) }));
    }
    let list = [...memoryStore.services];
    if (statusFilter) {
      list = list.filter((s) => s.status.toLowerCase() === statusFilter.toLowerCase());
    }
    return list;
  },

  async getServiceByIdOrSlug(idOrSlug) {
    if (useLiveMongo) {
      const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
      const doc = await ServiceModel.findOne(
        isObjectId ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] } : { slug: idOrSlug }
      ).lean();
      return doc ? { ...doc, _id: String(doc._id) } : null;
    }
    return (
      memoryStore.services.find((s) => s._id === idOrSlug || s.slug === idOrSlug) || null
    );
  },

  async createService(data) {
    const tempDoc = new ServiceModel(data);
    await tempDoc.validate();

    if (useLiveMongo) {
      const saved = await tempDoc.save();
      return { ...saved.toObject(), _id: String(saved._id) };
    }

    const now = new Date().toISOString();
    const newService = {
      ...data,
      _id: generateObjectId(),
      createdAt: now,
      updatedAt: now,
    };
    memoryStore.services.unshift(newService);
    saveToDisk();
    return newService;
  },

  async updateService(id, updates) {
    if (useLiveMongo) {
      const doc = await ServiceModel.findByIdAndUpdate(id, updates, { new: true }).lean();
      return doc ? { ...doc, _id: String(doc._id) } : null;
    }
    const idx = memoryStore.services.findIndex((s) => s._id === id);
    if (idx === -1) return null;
    memoryStore.services[idx] = {
      ...memoryStore.services[idx],
      ...updates,
      _id: id,
      updatedAt: new Date().toISOString(),
    };
    saveToDisk();
    return memoryStore.services[idx];
  },

  async deleteService(id) {
    if (useLiveMongo) {
      const res = await ServiceModel.findByIdAndDelete(id);
      return Boolean(res);
    }
    const initialLen = memoryStore.services.length;
    memoryStore.services = memoryStore.services.filter((s) => s._id !== id);
    if (memoryStore.services.length !== initialLen) {
      saveToDisk();
      return true;
    }
    return false;
  },

  // BOOKINGS
  async getAllBookings() {
    if (useLiveMongo) {
      const docs = await BookingModel.find().sort({ createdAt: -1 }).lean();
      return docs.map((d) => ({ ...d, _id: String(d._id) }));
    }
    return [...memoryStore.bookings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getBookingByIdOrCode(idOrCode) {
    const clean = idOrCode.trim();
    if (useLiveMongo) {
      const isObj = mongoose.Types.ObjectId.isValid(clean);
      const doc = await BookingModel.findOne(
        isObj
          ? { $or: [{ _id: clean }, { bookingId: new RegExp(`^${clean}$`, 'i') }] }
          : { bookingId: new RegExp(`^${clean}$`, 'i') }
      ).lean();
      return doc ? { ...doc, _id: String(doc._id) } : null;
    }
    return (
      memoryStore.bookings.find(
        (b) => b._id === clean || b.bookingId.toLowerCase() === clean.toLowerCase()
      ) || null
    );
  },

  async createBooking(data) {
    const tempDoc = new BookingModel(data);
    await tempDoc.validate();

    const cleanEmail = data.email.trim().toLowerCase();
    let user = await this.findUserByEmail(cleanEmail);
    if (!user) {
      user = await this.createUser({
        name: data.name,
        email: cleanEmail,
        mobile: data.mobile,
        city: data.pickupAddress.split(',').pop()?.trim() || 'India',
        address: data.pickupAddress,
        totalBookings: 1,
      });
    } else {
      await this.updateUser(user._id, { totalBookings: (user.totalBookings || 0) + 1 });
    }

    const payloadWithUser = { ...data, userId: user._id };

    if (useLiveMongo) {
      const created = await BookingModel.create(payloadWithUser);
      return { ...created.toObject(), _id: String(created._id) };
    }

    const now = new Date().toISOString();
    const newBooking = {
      ...payloadWithUser,
      _id: generateObjectId(),
      createdAt: now,
      updatedAt: now,
    };
    memoryStore.bookings.unshift(newBooking);
    saveToDisk();
    return newBooking;
  },

  async updateBooking(id, updates) {
    if (useLiveMongo) {
      const doc = await BookingModel.findByIdAndUpdate(id, updates, { new: true }).lean();
      return doc ? { ...doc, _id: String(doc._id) } : null;
    }
    const idx = memoryStore.bookings.findIndex((b) => b._id === id || b.bookingId === id);
    if (idx === -1) return null;
    memoryStore.bookings[idx] = {
      ...memoryStore.bookings[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToDisk();
    return memoryStore.bookings[idx];
  },

  async deleteBooking(id) {
    if (useLiveMongo) {
      const res = await BookingModel.findByIdAndDelete(id);
      return Boolean(res);
    }
    const initialLen = memoryStore.bookings.length;
    memoryStore.bookings = memoryStore.bookings.filter((b) => b._id !== id && b.bookingId !== id);
    if (memoryStore.bookings.length !== initialLen) {
      saveToDisk();
      return true;
    }
    return false;
  },

  // ENQUIRIES
  async getAllEnquiries() {
    if (useLiveMongo) {
      const docs = await EnquiryModel.find().sort({ createdAt: -1 }).lean();
      return docs.map((d) => ({ ...d, _id: String(d._id) }));
    }
    return [...memoryStore.enquiries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getEnquiryById(id) {
    if (useLiveMongo) {
      const doc = await EnquiryModel.findById(id).lean();
      return doc ? { ...doc, _id: String(doc._id) } : null;
    }
    return memoryStore.enquiries.find((e) => e._id === id || e.enquiryId === id) || null;
  },

  async createEnquiry(data) {
    const tempDoc = new EnquiryModel(data);
    await tempDoc.validate();

    if (useLiveMongo) {
      const created = await tempDoc.save();
      return { ...created.toObject(), _id: String(created._id) };
    }

    const now = new Date().toISOString();
    const newEnq = {
      ...data,
      _id: generateObjectId(),
      createdAt: now,
      updatedAt: now,
    };
    memoryStore.enquiries.unshift(newEnq);
    saveToDisk();
    return newEnq;
  },

  async updateEnquiry(id, updates) {
    if (useLiveMongo) {
      const doc = await EnquiryModel.findByIdAndUpdate(id, updates, { new: true }).lean();
      return doc ? { ...doc, _id: String(doc._id) } : null;
    }
    const idx = memoryStore.enquiries.findIndex((e) => e._id === id || e.enquiryId === id);
    if (idx === -1) return null;
    memoryStore.enquiries[idx] = {
      ...memoryStore.enquiries[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToDisk();
    return memoryStore.enquiries[idx];
  },

  async deleteEnquiry(id) {
    if (useLiveMongo) {
      const res = await EnquiryModel.findByIdAndDelete(id);
      return Boolean(res);
    }
    const initialLen = memoryStore.enquiries.length;
    memoryStore.enquiries = memoryStore.enquiries.filter((e) => e._id !== id && e.enquiryId !== id);
    if (memoryStore.enquiries.length !== initialLen) {
      saveToDisk();
      return true;
    }
    return false;
  },

  // USERS
  async getAllUsers() {
    if (useLiveMongo) {
      const docs = await UserModel.find().sort({ createdAt: -1 }).lean();
      return docs.map((d) => ({ ...d, _id: String(d._id) }));
    }
    return [...memoryStore.users].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async findUserByEmail(email) {
    const clean = email.trim().toLowerCase();
    if (useLiveMongo) {
      const doc = await UserModel.findOne({ email: clean }).lean();
      return doc ? { ...doc, _id: String(doc._id) } : null;
    }
    return memoryStore.users.find((u) => u.email.toLowerCase() === clean) || null;
  },

  async findUserById(id) {
    if (useLiveMongo) {
      const doc = await UserModel.findById(id).lean();
      return doc ? { ...doc, _id: String(doc._id) } : null;
    }
    return memoryStore.users.find((u) => u._id === id) || null;
  },

  async createUser(data) {
    const tempDoc = new UserModel(data);
    await tempDoc.validate();

    if (useLiveMongo) {
      const created = await tempDoc.save();
      return { ...created.toObject(), _id: String(created._id) };
    }

    const now = new Date().toISOString();
    const newUser = {
      ...data,
      _id: generateObjectId(),
      createdAt: now,
      updatedAt: now,
    };
    memoryStore.users.unshift(newUser);
    saveToDisk();
    return newUser;
  },

  async updateUser(id, updates) {
    if (useLiveMongo) {
      const doc = await UserModel.findByIdAndUpdate(id, updates, { new: true }).lean();
      return doc ? { ...doc, _id: String(doc._id) } : null;
    }
    const idx = memoryStore.users.findIndex((u) => u._id === id);
    if (idx === -1) return null;
    memoryStore.users[idx] = {
      ...memoryStore.users[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToDisk();
    return memoryStore.users[idx];
  },

  // PAGES
  async getAllPages() {
    if (useLiveMongo) {
      const docs = await PageModel.find().lean();
      return docs.map((d) => ({ ...d, _id: String(d._id) }));
    }
    return [...memoryStore.pages];
  },

  async updatePageBySlug(slug, updates) {
    if (useLiveMongo) {
      const doc = await PageModel.findOneAndUpdate({ slug }, updates, {
        new: true,
        upsert: true,
      }).lean();
      return doc ? { ...doc, _id: String(doc._id) } : null;
    }
    const idx = memoryStore.pages.findIndex((p) => p.slug === slug);
    if (idx === -1) return null;
    memoryStore.pages[idx] = {
      ...memoryStore.pages[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToDisk();
    return memoryStore.pages[idx];
  },
};
