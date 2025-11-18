# ZipZapZoop 

<img width="2556" height="2241" alt="sharefile" src="https://github.com/user-attachments/assets/895a9fc2-470f-4dbb-abc5-fc24789a52c3" />

## What this project is

ZipZapZoop is a p2p filesharing system that lets a user upload a file to the Java backend, which then offers the file on a random dynamic port (used as an "invite code"). Another user (or the same user from another machine/tab) can provide that invite code to download the file directly from the host using a socket connection.

This repo contains a Java backend (API + file server) and a Next.js frontend (in `web/`) that shows a modern UI for upload / download.

## Project layout

- `src/main/java/p2p` — Java backend
  - `App.java` — main entry point (starts the API server)
  - `controller/FileController.java` — HTTP API: `/upload` (POST) and `/download/{port}` (GET)
  - `service/FileSharer.java` — manages offered files and starts per-file ServerSockets
  - `utils/UploadUtils.java` — generates random dynamic port codes
- `web/` — Next.js frontend
  - `web/src/components` — React components such as `FileUpload.tsx`, `FileDownload.tsx`, `InviteCode.tsx`

## Features

- Drag & drop file upload
- Invite-code based sharing (random dynamic port serves as invite code)
- Direct TCP file transfer from host to client (simple header + file bytes)
- Lightweight backend (no database) — files are stored in the OS temp directory

## Requirements

- Java 11+
- Maven
- Node 18+ and npm (for frontend)

## Quick start (recommended)

1. Build the Java backend

```bash
mvn -f ./pom.xml clean package
```

2. Run the backend

```bash
# Run the built jar (use the jar produced in target/)
java -jar target/*.jar
```

The backend starts an HTTP API (default port 8080 as launched by `App.java`).

3. Run the frontend

```bash
cd web
npm install
npm run dev
```

Open the frontend at http://localhost:3000

## HTTP API (important endpoints)

- POST /upload — upload a file as multipart/form-data. Response: JSON {"port": <portNumber>}
  - The backend saves the uploaded file to a temp directory, asks `FileSharer` to reserve a dynamic port and start a ServerSocket on that port.
- GET /download/{port} — download a file from the given port. The backend opens a socket to `localhost:{port}` to fetch file bytes served by the file server, then streams it back as an HTTP attachment.

Notes:
- Invite code = TCP port (random value in dynamic range 49152–65535).
- The file server currently accepts a single connection for each offered file; after one successful transfer the server socket is closed.

## Demo (manual steps)

1. On the host machine: open the frontend, upload a file using the drag-and-drop component.
2. After upload the UI shows an invite code (port). Copy the code.
3. On the receiver machine (or another browser tab): enter the invite code in the download UI and click Download.
4. The receiver will receive the file as an HTTP attachment.

## Quick curl examples (for testing)

Upload (replace `yourfile.bin`):

```bash
curl -v -F "file=@yourfile.bin" http://localhost:8080/upload
```

Response example: `{"port": 49612}`

Download (replace port with returned port):

```bash
curl -v http://localhost:8080/download/49612 -o received.bin
```

## Limitations & Security

- No authentication or encryption. Not suitable for production.
- Uses raw TCP and system dynamic ports — NAT/Firewall/NAT traversal is not handled.
- File servers are served on ephemeral ports; quality of service and concurrent transfers are minimal.

