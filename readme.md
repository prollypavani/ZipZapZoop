<div align="center">

  <h1>ZipZapZoop</h1>
  <p><strong>A Minimalist P2P File Sharing System</strong></p>
  <img src="https://github.com/user-attachments/assets/895a9fc2-470f-4dbb-abc5-fc24789a52c3" alt="ZipZapZoop Banner" width="600" />

  <p>
    <img src="https://img.shields.io/badge/Java-11%2B-ED8B00?style=flat-square&logo=openjdk&logoColor=white" alt="Java" />
    <img src="https://img.shields.io/badge/Framework-Maven-C71A36?style=flat-square&logo=apachemaven&logoColor=white" alt="Maven" />
    <img src="https://img.shields.io/badge/Frontend-Next.js-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/Status-Prototype-blue?style=flat-square" alt="Status" />
  </p>
</div>

## Overview

ZipZapZoop is a P2P file sharing system that enables secure, direct file transfers between users. Upload a file to the Java backend, receive a unique invite code, and share files directly with anyone using a socket connection. Perfect for quick, temporary file sharing without relying on cloud storage.

### Key Features

- **Direct P2P Transfer** — Files transfer directly from host to recipient via TCP
- **Invite Code System** — Share files using simple, randomly-generated codes
- **Drag & Drop Interface** — Modern, intuitive Next.js frontend
- **Lightweight Architecture** — No database required, uses OS temp directory
- **Ephemeral Storage** — Files exist only for the duration of the transfer

---

## Architecture

### Backend (Java)
- `src/main/java/p2p/App.java` — Application entry point and API server initialization
- `src/main/java/p2p/controller/FileController.java` — REST endpoints for upload and download
- `src/main/java/p2p/service/FileSharer.java` — File server management and ServerSocket orchestration
- `src/main/java/p2p/utils/UploadUtils.java` — Dynamic port generation utilities

### Frontend (Next.js)
- `web/src/components/FileUpload.tsx` — Drag-and-drop upload interface
- `web/src/components/FileDownload.tsx` — Download interface with invite code input
- `web/src/components/InviteCode.tsx` — Invite code display and sharing

---

## Getting Started

### Prerequisites

- **Java:** Version 11 or higher
- **Maven:** For building the backend
- **Node.js:** Version 18 or higher
- **npm:** For frontend dependencies

### Installation & Setup

#### 1. Build the Backend

```bash
mvn -f ./pom.xml clean package
```

#### 2. Start the Backend Server

```bash
java -jar target/*.jar
```

The API server will start on port 8080 by default.

#### 3. Launch the Frontend

```bash
cd web
npm install
npm run dev
```

Access the application at `http://localhost:3000`

---

## API Reference

### Upload File

**Endpoint:** `POST /upload`

**Content-Type:** `multipart/form-data`

**Response:**
```json
{
  "port": 49612
}
```

Uploads a file and returns a unique port number (invite code) for sharing.

### Download File

**Endpoint:** `GET /download/{port}`

**Parameters:**
- `port` — The invite code received from the upload response

**Response:** Binary file stream with appropriate content headers

---

## Usage Example

### Web Interface

1. **Host:** Navigate to `http://localhost:3000` and drag-and-drop your file
2. **Share:** Copy the generated invite code displayed in the UI
3. **Recipient:** Enter the invite code in the download section and click Download

### Command Line (cURL)

**Upload a file:**
```bash
curl -F "file=@document.pdf" http://localhost:8080/upload
```

**Download using invite code:**
```bash
curl http://localhost:8080/download/49612 -o downloaded-file.pdf
```

---

## How It Works

1. **File Upload:** User uploads a file via HTTP POST to `/upload`
2. **Port Allocation:** Backend generates a random dynamic port (49152–65535) and starts a ServerSocket
3. **Invite Code:** The port number serves as the invite code
4. **File Transfer:** Recipient uses the invite code to download via `/download/{port}`
5. **Direct Connection:** Backend proxies the TCP connection, streaming file bytes directly
6. **Cleanup:** ServerSocket closes after successful transfer

---

## Security Considerations

> **⚠️ WARNING:** This is a demonstration project and should not be used in production environments.

- **No Authentication** — Anyone with an invite code can download files
- **No Encryption** — Data is transmitted in plaintext over TCP
- **No NAT Traversal** — Limited to local networks or requires port forwarding
- **Single Transfer** — Each file server accepts only one connection
- **Temporary Storage** — Files stored in OS temp directory without cleanup guarantees

### Recommended Use Cases

- Development and testing environments
- Local network file transfers
- Educational demonstrations of P2P concepts
- Prototype and proof-of-concept projects

---

## Technical Limitations

- Dynamic port allocation may conflict with firewall rules
- No concurrent download support for the same file
- File size limited by available memory and disk space
- No resume capability for interrupted transfers
- Invite codes (ports) may be reused after server restart

