const mongoose = require('mongoose');
const Paper = require('../models/Paper');

// Helper to escape regex special characters
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// Initial 52 realistic research papers matching reference screenshots
const INITIAL_PAPERS = [
  {
    _id: '67b300010000000000000001',
    paperId: 'P-105',
    title: 'Food Recommendation System',
    author: 'Aravind',
    publicationDate: new Date('2025-08-22'),
    price: 20000.0,
    createdAt: new Date('2025-08-22'),
    updatedAt: new Date('2025-08-22'),
  },
  {
    _id: '67b300010000000000000002',
    paperId: 'P-3050',
    title: 'Retrieval-Augmented Generation Systems',
    author: 'Leslie Lamport',
    publicationDate: new Date('2025-05-12'),
    price: 1999.0,
    createdAt: new Date('2025-05-12'),
    updatedAt: new Date('2025-05-12'),
  },
  {
    _id: '67b300010000000000000003',
    paperId: 'P-3040',
    title: 'CAP Revisited: Stronger Practical Tradeoffs',
    author: 'Eric Brewer',
    publicationDate: new Date('2024-06-18'),
    price: 1699.0,
    createdAt: new Date('2024-06-18'),
    updatedAt: new Date('2024-06-18'),
  },
  {
    _id: '67b300010000000000000004',
    paperId: 'P-3025',
    title: 'AI Safety: Formal Methods and Practice',
    author: 'Stuart Russell',
    publicationDate: new Date('2024-05-05'),
    price: 1790.0,
    createdAt: new Date('2024-05-05'),
    updatedAt: new Date('2024-05-05'),
  },
  {
    _id: '67b300010000000000000005',
    paperId: 'P-3047',
    title: 'Accelerating AI with Heterogeneous Hardware',
    author: 'Mark Dean',
    publicationDate: new Date('2024-04-02'),
    price: 1790.0,
    createdAt: new Date('2024-04-02'),
    updatedAt: new Date('2024-04-02'),
  },
  {
    _id: '67b300010000000000000006',
    paperId: 'P-3014',
    title: 'Deep Learning for Speech Recognition',
    author: 'Andrew Ng',
    publicationDate: new Date('2024-03-18'),
    price: 1699.0,
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-18'),
  },
  {
    _id: '67b300010000000000000007',
    paperId: 'P-3005',
    title: 'Algorithms in Auto-Grad Optimization',
    author: 'Yann LeCun',
    publicationDate: new Date('2024-02-10'),
    price: 1500.0,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    _id: '67b300010000000000000008',
    paperId: 'P-2098',
    title: 'Attention Mechanisms in Transformer Networks',
    author: 'Ashish Vaswani',
    publicationDate: new Date('2024-01-15'),
    price: 2450.0,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    _id: '67b300010000000000000009',
    paperId: 'P-2090',
    title: 'Distributed Consensus via Raft Protocol',
    author: 'Diego Ongaro',
    publicationDate: new Date('2023-12-05'),
    price: 1850.0,
    createdAt: new Date('2023-12-05'),
    updatedAt: new Date('2023-12-05'),
  },
  {
    _id: '67b300010000000000000010',
    paperId: 'P-2085',
    title: 'Quantum Key Distribution for Modern Cryptography',
    author: 'Artur Ekert',
    publicationDate: new Date('2023-11-20'),
    price: 3200.0,
    createdAt: new Date('2023-11-20'),
    updatedAt: new Date('2023-11-20'),
  },
  {
    _id: '67b300010000000000000011',
    paperId: 'P-2077',
    title: 'Zero-Knowledge Proofs in Decentralized Ledgers',
    author: 'Shafi Goldwasser',
    publicationDate: new Date('2023-10-14'),
    price: 2100.0,
    createdAt: new Date('2023-10-14'),
    updatedAt: new Date('2023-10-14'),
  },
  {
    _id: '67b300010000000000000012',
    paperId: 'P-2070',
    title: 'Scalable Graph Neural Networks for Drug Discovery',
    author: 'Jure Leskovec',
    publicationDate: new Date('2023-09-28'),
    price: 2890.0,
    createdAt: new Date('2023-09-28'),
    updatedAt: new Date('2023-09-28'),
  },
  {
    _id: '67b300010000000000000013',
    paperId: 'P-2065',
    title: 'Fault-Tolerant Distributed Storage at Planetary Scale',
    author: 'Jeff Dean',
    publicationDate: new Date('2023-08-19'),
    price: 1950.0,
    createdAt: new Date('2023-08-19'),
    updatedAt: new Date('2023-08-19'),
  },
  {
    _id: '67b300010000000000000014',
    paperId: 'P-2060',
    title: 'Reinforcement Learning with Verifiable Constraints',
    author: 'Richard Sutton',
    publicationDate: new Date('2023-07-11'),
    price: 2300.0,
    createdAt: new Date('2023-07-11'),
    updatedAt: new Date('2023-07-11'),
  },
  {
    _id: '67b300010000000000000015',
    paperId: 'P-2055',
    title: 'End-to-End Autonomous Vehicle Perception',
    author: 'Sebastian Thrun',
    publicationDate: new Date('2023-06-30'),
    price: 3500.0,
    createdAt: new Date('2023-06-30'),
    updatedAt: new Date('2023-06-30'),
  },
  {
    _id: '67b300010000000000000016',
    paperId: 'P-2050',
    title: 'Edge Computing Architectures for Real-Time IoT',
    author: 'Mahadev Satyanarayanan',
    publicationDate: new Date('2023-05-18'),
    price: 1450.0,
    createdAt: new Date('2023-05-18'),
    updatedAt: new Date('2023-05-18'),
  },
  {
    _id: '67b300010000000000000017',
    paperId: 'P-2045',
    title: 'Differential Privacy in Large Language Models',
    author: 'Cynthia Dwork',
    publicationDate: new Date('2023-04-22'),
    price: 2750.0,
    createdAt: new Date('2023-04-22'),
    updatedAt: new Date('2023-04-22'),
  },
  {
    _id: '67b300010000000000000018',
    paperId: 'P-2040',
    title: 'Neuromorphic Computing with Spiking Neurons',
    author: 'Carver Mead',
    publicationDate: new Date('2023-03-15'),
    price: 3100.0,
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2023-03-15'),
  },
  {
    _id: '67b300010000000000000019',
    paperId: 'P-2035',
    title: 'High-Performance Asynchronous I/O Systems',
    author: 'Jens Axboe',
    publicationDate: new Date('2023-02-28'),
    price: 1600.0,
    createdAt: new Date('2023-02-28'),
    updatedAt: new Date('2023-02-28'),
  },
  {
    _id: '67b300010000000000000020',
    paperId: 'P-2030',
    title: 'Self-Supervised Visual Representation Learning',
    author: 'Kaiming He',
    publicationDate: new Date('2023-01-19'),
    price: 2200.0,
    createdAt: new Date('2023-01-19'),
    updatedAt: new Date('2023-01-19'),
  },
  {
    _id: '67b300010000000000000021',
    paperId: 'P-2025',
    title: 'Energy-Efficient Datacenter Microarchitectures',
    author: 'David Patterson',
    publicationDate: new Date('2022-12-10'),
    price: 2600.0,
    createdAt: new Date('2022-12-10'),
    updatedAt: new Date('2022-12-10'),
  },
  {
    _id: '67b300010000000000000022',
    paperId: 'P-2020',
    title: 'Dynamic Web Compilation with WebAssembly',
    author: 'Brendan Eich',
    publicationDate: new Date('2022-11-05'),
    price: 1350.0,
    createdAt: new Date('2022-11-05'),
    updatedAt: new Date('2022-11-05'),
  },
  {
    _id: '67b300010000000000000023',
    paperId: 'P-2015',
    title: 'Multi-Agent Reinforcement Learning for Game Theory',
    author: 'Demis Hassabis',
    publicationDate: new Date('2022-10-12'),
    price: 2900.0,
    createdAt: new Date('2022-10-12'),
    updatedAt: new Date('2022-10-12'),
  },
  {
    _id: '67b300010000000000000024',
    paperId: 'P-2010',
    title: 'Hardware-Assisted Memory Safety in Modern Kernels',
    author: 'Linus Torvalds',
    publicationDate: new Date('2022-09-08'),
    price: 2150.0,
    createdAt: new Date('2022-09-08'),
    updatedAt: new Date('2022-09-08'),
  },
  {
    _id: '67b300010000000000000025',
    paperId: 'P-2005',
    title: 'Fast Matrix Multiplication in Deep Learning Kernels',
    author: 'Virginia Vassilevska Williams',
    publicationDate: new Date('2022-08-25'),
    price: 3400.0,
    createdAt: new Date('2022-08-25'),
    updatedAt: new Date('2022-08-25'),
  },
  {
    _id: '67b300010000000000000026',
    paperId: 'P-2001',
    title: 'Automated Theorem Proving via Neural Search',
    author: 'Terence Tao',
    publicationDate: new Date('2022-07-14'),
    price: 3800.0,
    createdAt: new Date('2022-07-14'),
    updatedAt: new Date('2022-07-14'),
  },
  {
    _id: '67b300010000000000000027',
    paperId: 'P-1995',
    title: 'Resilient Microservice Mesh Communication',
    author: 'Martin Fowler',
    publicationDate: new Date('2022-06-03'),
    price: 1750.0,
    createdAt: new Date('2022-06-03'),
    updatedAt: new Date('2022-06-03'),
  },
  {
    _id: '67b300010000000000000028',
    paperId: 'P-1990',
    title: 'Time-Series Anomaly Detection with State Space Models',
    author: 'Rob Hyndman',
    publicationDate: new Date('2022-05-21'),
    price: 1980.0,
    createdAt: new Date('2022-05-21'),
    updatedAt: new Date('2022-05-21'),
  },
  {
    _id: '67b300010000000000000029',
    paperId: 'P-1985',
    title: 'Distributed Tracing for Serverless Architectures',
    author: 'Ben Sigelman',
    publicationDate: new Date('2022-04-16'),
    price: 1420.0,
    createdAt: new Date('2022-04-16'),
    updatedAt: new Date('2022-04-16'),
  },
  {
    _id: '67b300010000000000000030',
    paperId: 'P-1980',
    title: 'Optimizing Garbage Collection in Managed Runtimes',
    author: 'Barbara Liskov',
    publicationDate: new Date('2022-03-09'),
    price: 2250.0,
    createdAt: new Date('2022-03-09'),
    updatedAt: new Date('2022-03-09'),
  },
  {
    _id: '67b300010000000000000031',
    paperId: 'P-1975',
    title: 'Generative Adversarial Models for Medical Imaging',
    author: 'Ian Goodfellow',
    publicationDate: new Date('2022-02-18'),
    price: 3100.0,
    createdAt: new Date('2022-02-18'),
    updatedAt: new Date('2022-02-18'),
  },
  {
    _id: '67b300010000000000000032',
    paperId: 'P-1970',
    title: 'Low-Latency Streaming Dataflow Processing',
    author: 'Tyler Akidau',
    publicationDate: new Date('2022-01-27'),
    price: 1890.0,
    createdAt: new Date('2022-01-27'),
    updatedAt: new Date('2022-01-27'),
  },
  {
    _id: '67b300010000000000000033',
    paperId: 'P-1965',
    title: 'Federated Learning across Mobile Endpoints',
    author: 'H. Brendan McMahan',
    publicationDate: new Date('2021-12-14'),
    price: 2400.0,
    createdAt: new Date('2021-12-14'),
    updatedAt: new Date('2021-12-14'),
  },
  {
    _id: '67b300010000000000000034',
    paperId: 'P-1960',
    title: 'Semantic Parsing for Natural Language Interfaces',
    author: 'Christopher Manning',
    publicationDate: new Date('2021-11-19'),
    price: 2100.0,
    createdAt: new Date('2021-11-19'),
    updatedAt: new Date('2021-11-19'),
  },
  {
    _id: '67b300010000000000000035',
    paperId: 'P-1955',
    title: 'Formal Verification of Cryptographic Protocols',
    author: 'Ron Rivest',
    publicationDate: new Date('2021-10-08'),
    price: 3300.0,
    createdAt: new Date('2021-10-08'),
    updatedAt: new Date('2021-10-08'),
  },
  {
    _id: '67b300010000000000000036',
    paperId: 'P-1950',
    title: 'Cache Coherence Protocols in Multi-Core Processors',
    author: 'Mark Hill',
    publicationDate: new Date('2021-09-12'),
    price: 2700.0,
    createdAt: new Date('2021-09-12'),
    updatedAt: new Date('2021-09-12'),
  },
  {
    _id: '67b300010000000000000037',
    paperId: 'P-1945',
    title: 'Probabilistic Graphical Models in Clinical Diagnosis',
    author: 'Daphne Koller',
    publicationDate: new Date('2021-08-04'),
    price: 2950.0,
    createdAt: new Date('2021-08-04'),
    updatedAt: new Date('2021-08-04'),
  },
  {
    _id: '67b300010000000000000038',
    paperId: 'P-1940',
    title: 'Practical Byzantine Fault Tolerance for Web3',
    author: 'Miguel Castro',
    publicationDate: new Date('2021-07-22'),
    price: 2500.0,
    createdAt: new Date('2021-07-22'),
    updatedAt: new Date('2021-07-22'),
  },
  {
    _id: '67b300010000000000000039',
    paperId: 'P-1935',
    title: 'Compiler Optimizations for Tensor Processing Units',
    author: 'Chris Lattner',
    publicationDate: new Date('2021-06-15'),
    price: 2800.0,
    createdAt: new Date('2021-06-15'),
    updatedAt: new Date('2021-06-15'),
  },
  {
    _id: '67b300010000000000000040',
    paperId: 'P-1930',
    title: 'Zero-Copy Networking in Linux Kernel',
    author: 'David S. Miller',
    publicationDate: new Date('2021-05-11'),
    price: 1650.0,
    createdAt: new Date('2021-05-11'),
    updatedAt: new Date('2021-05-11'),
  },
  {
    _id: '67b300010000000000000041',
    paperId: 'P-1925',
    title: 'Self-Organizing Sensor Networks in Smart Cities',
    author: 'Deborah Estrin',
    publicationDate: new Date('2021-04-03'),
    price: 1850.0,
    createdAt: new Date('2021-04-03'),
    updatedAt: new Date('2021-04-03'),
  },
  {
    _id: '67b300010000000000000042',
    paperId: 'P-1920',
    title: 'Explainable AI: Model Interpretability Frameworks',
    author: 'Been Kim',
    publicationDate: new Date('2021-03-20'),
    price: 2350.0,
    createdAt: new Date('2021-03-20'),
    updatedAt: new Date('2021-03-20'),
  },
  {
    _id: '67b300010000000000000043',
    paperId: 'P-1915',
    title: 'Spatial Data Indexing with R-Trees at Scale',
    author: 'Antonin Guttman',
    publicationDate: new Date('2021-02-14'),
    price: 1900.0,
    createdAt: new Date('2021-02-14'),
    updatedAt: new Date('2021-02-14'),
  },
  {
    _id: '67b300010000000000000044',
    paperId: 'P-1910',
    title: 'Quantum Error Correction with Surface Codes',
    author: 'John Preskill',
    publicationDate: new Date('2021-01-25'),
    price: 4200.0,
    createdAt: new Date('2021-01-25'),
    updatedAt: new Date('2021-01-25'),
  },
  {
    _id: '67b300010000000000000045',
    paperId: 'P-1905',
    title: 'Continuous Integration Pipelines for Micro-Frontends',
    author: 'Kent Beck',
    publicationDate: new Date('2020-12-08'),
    price: 1200.0,
    createdAt: new Date('2020-12-08'),
    updatedAt: new Date('2020-12-08'),
  },
  {
    _id: '67b300010000000000000046',
    paperId: 'P-1900',
    title: 'Graph Partitioning for Distributed PageRank',
    author: 'Larry Page',
    publicationDate: new Date('2020-11-17'),
    price: 2450.0,
    createdAt: new Date('2020-11-17'),
    updatedAt: new Date('2020-11-17'),
  },
  {
    _id: '67b300010000000000000047',
    paperId: 'P-1895',
    title: 'Real-Time Ray Tracing with Denoising AI',
    author: 'Jensen Huang',
    publicationDate: new Date('2020-10-09'),
    price: 3600.0,
    createdAt: new Date('2020-10-09'),
    updatedAt: new Date('2020-10-09'),
  },
  {
    _id: '67b300010000000000000048',
    paperId: 'P-1890',
    title: 'Database Concurrency with Multi-Version B-Trees',
    author: 'Michael Stonebraker',
    publicationDate: new Date('2020-09-02'),
    price: 2900.0,
    createdAt: new Date('2020-09-02'),
    updatedAt: new Date('2020-09-02'),
  },
  {
    _id: '67b300010000000000000049',
    paperId: 'P-1885',
    title: 'Neural Style Transfer for Computational Photography',
    author: 'Leon Gatys',
    publicationDate: new Date('2020-08-16'),
    price: 1750.0,
    createdAt: new Date('2020-08-16'),
    updatedAt: new Date('2020-08-16'),
  },
  {
    _id: '67b300010000000000000050',
    paperId: 'P-1880',
    title: 'Cryptographic Hash Function Security Foundations',
    author: 'Adi Shamir',
    publicationDate: new Date('2020-07-21'),
    price: 3150.0,
    createdAt: new Date('2020-07-21'),
    updatedAt: new Date('2020-07-21'),
  },
  {
    _id: '67b300010000000000000051',
    paperId: 'P-1875',
    title: 'Software Transactional Memory in Concurrent Systems',
    author: 'Maurice Herlihy',
    publicationDate: new Date('2020-06-11'),
    price: 2650.0,
    createdAt: new Date('2020-06-11'),
    updatedAt: new Date('2020-06-11'),
  },
  {
    _id: '67b300010000000000000052',
    paperId: 'P-1870',
    title: 'Foundations of Asymmetric Cryptosystems',
    author: 'Whitfield Diffie',
    publicationDate: new Date('2020-05-04'),
    price: 3500.0,
    createdAt: new Date('2020-05-04'),
    updatedAt: new Date('2020-05-04'),
  },
];

// In-memory collection clone for offline/development resilience
let inMemoryPapers = JSON.parse(JSON.stringify(INITIAL_PAPERS)).map((p) => ({
  ...p,
  publicationDate: new Date(p.publicationDate),
  createdAt: new Date(p.createdAt),
  updatedAt: new Date(p.updatedAt),
}));

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

/**
 * @desc Get all papers with server-side pagination, search, filter, and sorting
 * @route GET /api/papers
 */
exports.getPapers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const allowedSortFields = {
      paperId: 'paperId',
      title: 'title',
      author: 'author',
      publicationDate: 'publicationDate',
      price: 'price',
      createdAt: 'createdAt',
    };

    const sortBy = allowedSortFields[req.query.sortBy] || 'publicationDate';
    const sortOrder = req.query.order && req.query.order.toLowerCase() === 'asc' ? 1 : -1;

    // IF MONGO IS CONNECTED -> Use real MongoDB collection
    if (isMongoConnected()) {
      const query = {};

      if (req.query.search && req.query.search.trim()) {
        const searchRegex = new RegExp(escapeRegex(req.query.search.trim()), 'i');
        query.$or = [
          { paperId: searchRegex },
          { title: searchRegex },
          { author: searchRegex },
        ];
      }

      if (req.query.author && req.query.author.trim()) {
        query.author = new RegExp(escapeRegex(req.query.author.trim()), 'i');
      }

      if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) {
        query.price = {};
        if (req.query.minPrice !== undefined && req.query.minPrice !== '') {
          const min = parseFloat(req.query.minPrice);
          if (!isNaN(min)) query.price.$gte = min;
        }
        if (req.query.maxPrice !== undefined && req.query.maxPrice !== '') {
          const max = parseFloat(req.query.maxPrice);
          if (!isNaN(max)) query.price.$lte = max;
        }
        if (Object.keys(query.price).length === 0) {
          delete query.price;
        }
      }

      if (req.query.startDate || req.query.endDate) {
        query.publicationDate = {};
        if (req.query.startDate) {
          const start = new Date(req.query.startDate);
          if (!isNaN(start.getTime())) query.publicationDate.$gte = start;
        }
        if (req.query.endDate) {
          const end = new Date(req.query.endDate);
          if (!isNaN(end.getTime())) query.publicationDate.$lte = end;
        }
        if (Object.keys(query.publicationDate).length === 0) {
          delete query.publicationDate;
        }
      }

      const sort = { [sortBy]: sortOrder, _id: 1 };

      const [papers, totalItems] = await Promise.all([
        Paper.find(query).sort(sort).skip(skip).limit(limit).lean(),
        Paper.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalItems / limit) || 1;

      return res.status(200).json({
        success: true,
        count: papers.length,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        data: papers,
      });
    }

    // FALLBACK IN-MEMORY STORE (Runs identically when MONGODB_URI not yet configured)
    let filtered = [...inMemoryPapers];

    if (req.query.search && req.query.search.trim()) {
      const s = req.query.search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.paperId.toLowerCase().includes(s) ||
          p.title.toLowerCase().includes(s) ||
          p.author.toLowerCase().includes(s)
      );
    }

    if (req.query.author && req.query.author.trim()) {
      const a = req.query.author.trim().toLowerCase();
      filtered = filtered.filter((p) => p.author.toLowerCase().includes(a));
    }

    if (req.query.minPrice !== undefined && req.query.minPrice !== '') {
      const min = parseFloat(req.query.minPrice);
      if (!isNaN(min)) filtered = filtered.filter((p) => p.price >= min);
    }

    if (req.query.maxPrice !== undefined && req.query.maxPrice !== '') {
      const max = parseFloat(req.query.maxPrice);
      if (!isNaN(max)) filtered = filtered.filter((p) => p.price <= max);
    }

    if (req.query.startDate) {
      const start = new Date(req.query.startDate);
      if (!isNaN(start.getTime())) filtered = filtered.filter((p) => new Date(p.publicationDate) >= start);
    }

    if (req.query.endDate) {
      const end = new Date(req.query.endDate);
      if (!isNaN(end.getTime())) filtered = filtered.filter((p) => new Date(p.publicationDate) <= end);
    }

    // Sort
    filtered.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'publicationDate' || sortBy === 'createdAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return -1 * sortOrder;
      if (valA > valB) return 1 * sortOrder;
      return a._id.localeCompare(b._id);
    });

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const paginated = filtered.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      count: paginated.length,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      data: paginated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single paper by MongoDB _id
 * @route GET /api/papers/:id
 */
exports.getPaperById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid MongoDB ID format: ${id}`,
        });
      }

      const paper = await Paper.findById(id);
      if (!paper) {
        return res.status(404).json({
          success: false,
          message: `Paper not found with ID: ${id}`,
        });
      }

      return res.status(200).json({ success: true, data: paper });
    }

    // In-memory fallback
    const paper = inMemoryPapers.find((p) => p._id === id || p.paperId === id);
    if (!paper) {
      return res.status(404).json({
        success: false,
        message: `Paper not found with ID: ${id}`,
      });
    }

    res.status(200).json({ success: true, data: paper });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single paper by human-readable paperId (e.g. P-105)
 * @route GET /api/papers/by-paper-id/:paperId
 */
exports.getPaperByPaperId = async (req, res, next) => {
  try {
    const { paperId } = req.params;
    const cleanId = paperId.toUpperCase().trim();

    if (isMongoConnected()) {
      const paper = await Paper.findOne({ paperId: cleanId });
      if (!paper) {
        return res.status(404).json({
          success: false,
          message: `Paper not found with Paper ID: ${paperId}`,
        });
      }
      return res.status(200).json({ success: true, data: paper });
    }

    // In-memory fallback
    const paper = inMemoryPapers.find((p) => p.paperId === cleanId);
    if (!paper) {
      return res.status(404).json({
        success: false,
        message: `Paper not found with Paper ID: ${paperId}`,
      });
    }

    res.status(200).json({ success: true, data: paper });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create a new research paper
 * @route POST /api/papers
 */
exports.createPaper = async (req, res, next) => {
  try {
    let { paperId, title, author, publicationDate, price } = req.body;

    if (!paperId || !title || !author || !publicationDate || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: paperId, title, author, publicationDate, price',
      });
    }

    paperId = paperId.trim().toUpperCase();

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid non-negative number',
      });
    }

    const parsedDate = new Date(publicationDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Publication Date must be a valid date',
      });
    }

    if (isMongoConnected()) {
      const existing = await Paper.findOne({ paperId });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: `A paper with Paper ID "${paperId}" already exists. Please use a unique identifier.`,
        });
      }

      const paper = await Paper.create({
        paperId,
        title: title.trim(),
        author: author.trim(),
        publicationDate: parsedDate,
        price: parsedPrice,
      });

      return res.status(201).json({
        success: true,
        message: 'Research paper created successfully',
        data: paper,
      });
    }

    // In-memory fallback
    const existing = inMemoryPapers.find((p) => p.paperId === paperId);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A paper with Paper ID "${paperId}" already exists. Please use a unique identifier.`,
      });
    }

    const newPaper = {
      _id: new mongoose.Types.ObjectId().toString(),
      paperId,
      title: title.trim(),
      author: author.trim(),
      publicationDate: parsedDate,
      price: parsedPrice,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    inMemoryPapers.unshift(newPaper);

    res.status(201).json({
      success: true,
      message: 'Research paper created successfully',
      data: newPaper,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: `Duplicate key error: Paper ID "${req.body.paperId}" already exists.`,
      });
    }
    next(error);
  }
};

/**
 * @desc Update an existing paper by MongoDB _id
 * @route PUT /api/papers/:id
 */
exports.updatePaper = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, author, publicationDate, price, paperId } = req.body;

    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a valid non-negative number',
        });
      }
    }

    if (publicationDate !== undefined) {
      const parsedDate = new Date(publicationDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Publication Date must be a valid date',
        });
      }
    }

    if (isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid MongoDB ID format: ${id}`,
        });
      }

      const paper = await Paper.findById(id);
      if (!paper) {
        return res.status(404).json({
          success: false,
          message: `Paper not found with ID: ${id}`,
        });
      }

      if (title !== undefined) paper.title = title.trim();
      if (author !== undefined) paper.author = author.trim();
      if (publicationDate !== undefined) paper.publicationDate = new Date(publicationDate);
      if (price !== undefined) paper.price = parseFloat(price);

      const updated = await paper.save();
      return res.status(200).json({
        success: true,
        message: 'Paper updated successfully',
        data: updated,
      });
    }

    // In-memory fallback
    const index = inMemoryPapers.findIndex((p) => p._id === id || p.paperId === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Paper not found with ID: ${id}`,
      });
    }

    const current = inMemoryPapers[index];
    if (title !== undefined) current.title = title.trim();
    if (author !== undefined) current.author = author.trim();
    if (publicationDate !== undefined) current.publicationDate = new Date(publicationDate);
    if (price !== undefined) current.price = parseFloat(price);
    current.updatedAt = new Date();

    res.status(200).json({
      success: true,
      message: 'Paper updated successfully',
      data: current,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete a paper by MongoDB _id
 * @route DELETE /api/papers/:id
 */
exports.deletePaper = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid MongoDB ID format: ${id}`,
        });
      }

      const paper = await Paper.findByIdAndDelete(id);
      if (!paper) {
        return res.status(404).json({
          success: false,
          message: `Paper not found with ID: ${id}`,
        });
      }

      return res.status(200).json({
        success: true,
        message: `Paper "${paper.title}" (${paper.paperId}) deleted successfully`,
        data: { id: paper._id, paperId: paper.paperId },
      });
    }

    // In-memory fallback
    const index = inMemoryPapers.findIndex((p) => p._id === id || p.paperId === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Paper not found with ID: ${id}`,
      });
    }

    const removed = inMemoryPapers.splice(index, 1)[0];
    res.status(200).json({
      success: true,
      message: `Paper "${removed.title}" (${removed.paperId}) deleted successfully`,
      data: { id: removed._id, paperId: removed.paperId },
    });
  } catch (error) {
    next(error);
  }
};
