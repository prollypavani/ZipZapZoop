package p2p.service;
import java.io.*;
import java.net.*;
import java.util.HashMap;


import p2p.utils.UploadUtils;


public class FileSharer {

    private HashMap<Integer, File> availableFiles;

    public FileSharer(){
        availableFiles = new HashMap<>();
    }

    public int offerFile(String filePath){
        int port;
        while (true) { 
            port = UploadUtils.generateCode();
            if(availableFiles.containsKey(port)){
                availableFiles.put(port, filePath);
                return port;
            }
        }
    }

    public void startFileServer(int port){
        String filePath = availableFiles.get(port);
        if(filePath == null){
            System.out.println("No file found for the given port: " + port);
            return;
        }

        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("Serving file "+ new File(filePath).getName() + "on port " + port); 
            Socket clientSocket = serverSocket.accept();
            System.out.println("Client connection: " + clientSocket.getInetAddress());
            new Thread(new FileSenderHandler(clientSocket, filePath)).start();
        } catch (Exception ex) {
            System.err.println("Error starting file server on port: " + port);
        }
    }

    private static class FileSenderHandler implements Runnable{
        
        private final Socket clientSocket;
        private final String filepath;

        public FileSenderHandler(Socket clienSocket, String filepath){
            this.clientSocket = clienSocket;
            this.filepath = filepath;
        }
        
        @Override
        public void run(){
            try (FileInputStream fis = new FileInputStream(filepath)){
                OutputStream oos = clientSocket.getOutputStream();

                String fileName = new File(filePath).getName();
                String header = "Filename: "+ fileName + "\n";
                oos.write(header.getBytes());

                byte[] buffer = new byte[4096];
                int byteRead;
                while((byteRead = fis.read(buffer)) != -1){
                    oos.write(buffer, 0 , byteRead);
                }
                System.out.println("File " + fileName + " sent to " + clientSocket.getInetAddress());
            } catch (Exception ex) {
                System.err.println("Error sending file to the client" + ex.getMessage());
            }finally {
                try {
                    clientSocket.close();
                } catch (Exception ex) {
                    System.err.println("Error closing client socket: " + ex.getMessage());
                }
            }
        }
    }

}