# 🚌 Available Bus Route Finder System

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)  
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)  
[![Neo4j](https://img.shields.io/badge/Graph-DB%3A%20Neo4j-blue.svg)](https://neo4j.com/)  
[![MySQL](https://img.shields.io/badge/Relational-DB%3A%20MySQL-lightgrey.svg)](https://www.mysql.com/)  
[![Release](https://img.shields.io/github/v/release/tharinduthisun96/busRoute)](https://github.com/tharinduthisun96/busRoute/releases)

A centralized **Bus Route Finder System for Sri Lanka**, enabling users to search available routes between cities using real-time data. Combines both **public** and **private** transport with advanced route optimization using **Neo4j** and relational data management with **MySQL**.

---

## 🚀 Features

- 🔍 Search bus routes between major Sri Lankan locations
- 🔄 Integrated public & private transport support
- ⚡ Real-time availability support (planned)
- 🧠 Neo4j graph database for route optimization
- 🗃️ MySQL for schedules & metadata
- 🐳 Docker-compatible
- ⚙️ CI/CD support (CircleCI & GitHub Actions)

---

## 📦 Tech Stack

- **Backend**: Node.js, Express.js
- **FrontEnd**: Bubble.io
- **Databases**: MySQL, Neo4j
- **Dev Tools**: Nodemon, Docker
- **CI/CD**: CircleCI, GitHub Actions

---

## 📁 Project Structure

📦 busRoute/

├── 📁 .circleci/              # CircleCI config

├── 📁 .github/workflows/      # GitHub Actions CI/CD

├── 📁 database/               # SQL scripts & initial data

├── 📁 src/                    # Main API code (server.js, routes, controllers)

├── 📄 .env                    # Environment config

├── 📄 Dockerfile              # Docker image definition

├── 📄 package.json            # Node dependencies

├── 📄 package-lock.json       # Dependency lock file

├── 📄 README.md               # This file

├── 📄 requirements.txt        # (Optional) Python tools

└── 📄 .gitignore              # Git ignored files


---

## 🧪 Latest Release

> **v1.1.1** – *Updated the new API Endpoint*  
> 🔗 [View on GitHub](https://github.com/tharinduthisun96/busRoute/releases/tag/1.1.1)

---

## ⚙️ Installation

### 🔧 Requirements

- Node.js v18+
- MySQL (XAMPP or cloud)
- Neo4j (Desktop or Aura)
- Docker (optional)

### 🔨 Steps

```bash
# Clone the repository
git clone https://github.com/tharinduthisun96/busRoute.git
cd busRoute

# Install Node dependencies
npm install mysql2
npm install neo4j-driver
npm install dotenv

# Install nodemon globally for development
npm install -g nodemon


