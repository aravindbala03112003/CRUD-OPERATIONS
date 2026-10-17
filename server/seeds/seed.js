require('dotenv').config();
const mongoose = require('mongoose');
const Paper = require('../models/Paper');
const connectDB = require('../config/db');

const papersData = [
  {
    paperId: 'P-105',
    title: 'Food Recommendation System',
    author: 'Aravind',
    publicationDate: new Date('2025-08-22'),
    price: 20000.0,
  },
  {
    paperId: 'P-3050',
    title: 'Retrieval-Augmented Generation Systems',
    author: 'Leslie Lamport',
    publicationDate: new Date('2025-05-12'),
    price: 1999.0,
  },
  {
    paperId: 'P-3040',
    title: 'CAP Revisited: Stronger Practical Tradeoffs',
    author: 'Eric Brewer',
    publicationDate: new Date('2024-06-18'),
    price: 1699.0,
  },
  {
    paperId: 'P-3025',
    title: 'AI Safety: Formal Methods and Practice',
    author: 'Stuart Russell',
    publicationDate: new Date('2024-05-05'),
    price: 1790.0,
  },
  {
    paperId: 'P-3047',
    title: 'Accelerating AI with Heterogeneous Hardware',
    author: 'Mark Dean',
    publicationDate: new Date('2024-04-02'),
    price: 1790.0,
  },
  {
    paperId: 'P-3014',
    title: 'Deep Learning for Speech Recognition',
    author: 'Andrew Ng',
    publicationDate: new Date('2024-03-18'),
    price: 1699.0,
  },
  {
    paperId: 'P-3005',
    title: 'Algorithms in Auto-Grad Optimization',
    author: 'Yann LeCun',
    publicationDate: new Date('2024-02-10'),
    price: 1500.0,
  },
  {
    paperId: 'P-2098',
    title: 'Attention Mechanisms in Transformer Networks',
    author: 'Ashish Vaswani',
    publicationDate: new Date('2024-01-15'),
    price: 2450.0,
  },
  {
    paperId: 'P-2090',
    title: 'Distributed Consensus via Raft Protocol',
    author: 'Diego Ongaro',
    publicationDate: new Date('2023-12-05'),
    price: 1850.0,
  },
  {
    paperId: 'P-2085',
    title: 'Quantum Key Distribution for Modern Cryptography',
    author: 'Artur Ekert',
    publicationDate: new Date('2023-11-20'),
    price: 3200.0,
  },
  {
    paperId: 'P-2077',
    title: 'Zero-Knowledge Proofs in Decentralized Ledgers',
    author: 'Shafi Goldwasser',
    publicationDate: new Date('2023-10-14'),
    price: 2100.0,
  },
  {
    paperId: 'P-2070',
    title: 'Scalable Graph Neural Networks for Drug Discovery',
    author: 'Jure Leskovec',
    publicationDate: new Date('2023-09-28'),
    price: 2890.0,
  },
  {
    paperId: 'P-2065',
    title: 'Fault-Tolerant Distributed Storage at Planetary Scale',
    author: 'Jeff Dean',
    publicationDate: new Date('2023-08-19'),
    price: 1950.0,
  },
  {
    paperId: 'P-2060',
    title: 'Reinforcement Learning with Verifiable Constraints',
    author: 'Richard Sutton',
    publicationDate: new Date('2023-07-11'),
    price: 2300.0,
  },
  {
    paperId: 'P-2055',
    title: 'End-to-End Autonomous Vehicle Perception',
    author: 'Sebastian Thrun',
    publicationDate: new Date('2023-06-30'),
    price: 3500.0,
  },
  {
    paperId: 'P-2050',
    title: 'Edge Computing Architectures for Real-Time IoT',
    author: 'Mahadev Satyanarayanan',
    publicationDate: new Date('2023-05-18'),
    price: 1450.0,
  },
  {
    paperId: 'P-2045',
    title: 'Differential Privacy in Large Language Models',
    author: 'Cynthia Dwork',
    publicationDate: new Date('2023-04-22'),
    price: 2750.0,
  },
  {
    paperId: 'P-2040',
    title: 'Neuromorphic Computing with Spiking Neurons',
    author: 'Carver Mead',
    publicationDate: new Date('2023-03-15'),
    price: 3100.0,
  },
  {
    paperId: 'P-2035',
    title: 'High-Performance Asynchronous I/O Systems',
    author: 'Jens Axboe',
    publicationDate: new Date('2023-02-28'),
    price: 1600.0,
  },
  {
    paperId: 'P-2030',
    title: 'Self-Supervised Visual Representation Learning',
    author: 'Kaiming He',
    publicationDate: new Date('2023-01-19'),
    price: 2200.0,
  },
  {
    paperId: 'P-2025',
    title: 'Energy-Efficient Datacenter Microarchitectures',
    author: 'David Patterson',
    publicationDate: new Date('2022-12-10'),
    price: 2600.0,
  },
  {
    paperId: 'P-2020',
    title: 'Dynamic Web Compilation with WebAssembly',
    author: 'Brendan Eich',
    publicationDate: new Date('2022-11-05'),
    price: 1350.0,
  },
  {
    paperId: 'P-2015',
    title: 'Multi-Agent Reinforcement Learning for Game Theory',
    author: 'Demis Hassabis',
    publicationDate: new Date('2022-10-12'),
    price: 2900.0,
  },
  {
    paperId: 'P-2010',
    title: 'Hardware-Assisted Memory Safety in Modern Kernels',
    author: 'Linus Torvalds',
    publicationDate: new Date('2022-09-08'),
    price: 2150.0,
  },
  {
    paperId: 'P-2005',
    title: 'Fast Matrix Multiplication in Deep Learning Kernels',
    author: 'Virginia Vassilevska Williams',
    publicationDate: new Date('2022-08-25'),
    price: 3400.0,
  },
  {
    paperId: 'P-2001',
    title: 'Automated Theorem Proving via Neural Search',
    author: 'Terence Tao',
    publicationDate: new Date('2022-07-14'),
    price: 3800.0,
  },
  {
    paperId: 'P-1995',
    title: 'Resilient Microservice Mesh Communication',
    author: 'Martin Fowler',
    publicationDate: new Date('2022-06-03'),
    price: 1750.0,
  },
  {
    paperId: 'P-1990',
    title: 'Time-Series Anomaly Detection with State Space Models',
    author: 'Rob Hyndman',
    publicationDate: new Date('2022-05-21'),
    price: 1980.0,
  },
  {
    paperId: 'P-1985',
    title: 'Distributed Tracing for Serverless Architectures',
    author: 'Ben Sigelman',
    publicationDate: new Date('2022-04-16'),
    price: 1420.0,
  },
  {
    paperId: 'P-1980',
    title: 'Optimizing Garbage Collection in Managed Runtimes',
    author: 'Barbara Liskov',
    publicationDate: new Date('2022-03-09'),
    price: 2250.0,
  },
  {
    paperId: 'P-1975',
    title: 'Generative Adversarial Models for Medical Imaging',
    author: 'Ian Goodfellow',
    publicationDate: new Date('2022-02-18'),
    price: 3100.0,
  },
  {
    paperId: 'P-1970',
    title: 'Low-Latency Streaming Dataflow Processing',
    author: 'Tyler Akidau',
    publicationDate: new Date('2022-01-27'),
    price: 1890.0,
  },
  {
    paperId: 'P-1965',
    title: 'Federated Learning across Mobile Endpoints',
    author: 'H. Brendan McMahan',
    publicationDate: new Date('2021-12-14'),
    price: 2400.0,
  },
  {
    paperId: 'P-1960',
    title: 'Semantic Parsing for Natural Language Interfaces',
    author: 'Christopher Manning',
    publicationDate: new Date('2021-11-19'),
    price: 2100.0,
  },
  {
    paperId: 'P-1955',
    title: 'Formal Verification of Cryptographic Protocols',
    author: 'Ron Rivest',
    publicationDate: new Date('2021-10-08'),
    price: 3300.0,
  },
  {
    paperId: 'P-1950',
    title: 'Cache Coherence Protocols in Multi-Core Processors',
    author: 'Mark Hill',
    publicationDate: new Date('2021-09-12'),
    price: 2700.0,
  },
  {
    paperId: 'P-1945',
    title: 'Probabilistic Graphical Models in Clinical Diagnosis',
    author: 'Daphne Koller',
    publicationDate: new Date('2021-08-04'),
    price: 2950.0,
  },
  {
    paperId: 'P-1940',
    title: 'Practical Byzantine Fault Tolerance for Web3',
    author: 'Miguel Castro',
    publicationDate: new Date('2021-07-22'),
    price: 2500.0,
  },
  {
    paperId: 'P-1935',
    title: 'Compiler Optimizations for Tensor Processing Units',
    author: 'Chris Lattner',
    publicationDate: new Date('2021-06-15'),
    price: 2800.0,
  },
  {
    paperId: 'P-1930',
    title: 'Zero-Copy Networking in Linux Kernel',
    author: 'David S. Miller',
    publicationDate: new Date('2021-05-11'),
    price: 1650.0,
  },
  {
    paperId: 'P-1925',
    title: 'Self-Organizing Sensor Networks in Smart Cities',
    author: 'Deborah Estrin',
    publicationDate: new Date('2021-04-03'),
    price: 1850.0,
  },
  {
    paperId: 'P-1920',
    title: 'Explainable AI: Model Interpretability Frameworks',
    author: 'Been Kim',
    publicationDate: new Date('2021-03-20'),
    price: 2350.0,
  },
  {
    paperId: 'P-1915',
    title: 'Spatial Data Indexing with R-Trees at Scale',
    author: 'Antonin Guttman',
    publicationDate: new Date('2021-02-14'),
    price: 1900.0,
  },
  {
    paperId: 'P-1910',
    title: 'Quantum Error Correction with Surface Codes',
    author: 'John Preskill',
    publicationDate: new Date('2021-01-25'),
    price: 4200.0,
  },
  {
    paperId: 'P-1905',
    title: 'Continuous Integration Pipelines for Micro-Frontends',
    author: 'Kent Beck',
    publicationDate: new Date('2020-12-08'),
    price: 1200.0,
  },
  {
    paperId: 'P-1900',
    title: 'Graph Partitioning for Distributed PageRank',
    author: 'Larry Page',
    publicationDate: new Date('2020-11-17'),
    price: 2450.0,
  },
  {
    paperId: 'P-1895',
    title: 'Real-Time Ray Tracing with Denoising AI',
    author: 'Jensen Huang',
    publicationDate: new Date('2020-10-09'),
    price: 3600.0,
  },
  {
    paperId: 'P-1890',
    title: 'Database Concurrency with Multi-Version B-Trees',
    author: 'Michael Stonebraker',
    publicationDate: new Date('2020-09-02'),
    price: 2900.0,
  },
  {
    paperId: 'P-1885',
    title: 'Neural Style Transfer for Computational Photography',
    author: 'Leon Gatys',
    publicationDate: new Date('2020-08-16'),
    price: 1750.0,
  },
  {
    paperId: 'P-1880',
    title: 'Cryptographic Hash Function Security Foundations',
    author: 'Adi Shamir',
    publicationDate: new Date('2020-07-21'),
    price: 3150.0,
  },
  {
    paperId: 'P-1875',
    title: 'Software Transactional Memory in Concurrent Systems',
    author: 'Maurice Herlihy',
    publicationDate: new Date('2020-06-11'),
    price: 2650.0,
  },
  {
    paperId: 'P-1870',
    title: 'Foundations of Asymmetric Cryptosystems',
    author: 'Whitfield Diffie',
    publicationDate: new Date('2020-05-04'),
    price: 3500.0,
  },
];

async function seedDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required to run seed script');
    }

    console.log('Connecting to MongoDB...');
    await connectDB();

    console.log('Clearing existing research papers...');
    await Paper.deleteMany({});

    console.log(`Inserting ${papersData.length} curated research papers...`);
    const inserted = await Paper.insertMany(papersData);

    console.log(`Successfully seeded ${inserted.length} research papers!`);
    console.log('Top 5 papers in database:');
    inserted.slice(0, 5).forEach((p) => {
      console.log(`- [${p.paperId}] "${p.title}" by ${p.author} (₹${p.price.toFixed(2)})`);
    });

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seed script error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
