package p2p.service;
import java.util.HashMap;


public class FileSharer {

    private HashMap<Integer, File> availableFiles;

    public FileSharer(){
        availableFiles = new HashMap<>();
    }
}