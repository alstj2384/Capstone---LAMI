package lami.capstoneworkbook.global.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import static java.util.UUID.randomUUID;

@Component
@Slf4j
public class FileUtils {
    @Value("${file.path}")
    private String path;

    public boolean isPdf(MultipartFile file) throws IOException {
        byte[] header = new byte[4];
        file.getInputStream().read(header);
        return "%PDF".equals(new String(header));
    }

    public String save(MultipartFile file) throws IOException{
        log.info("파일 저장");
        File dir = new File(path);
        log.info("파일 저장 경로: {}", dir.getAbsolutePath());
        if(!dir.exists()) dir.mkdirs();

        String fileName =  UUID.randomUUID()+".pdf";

        File saveFile = new File(dir, fileName);

        file.transferTo(saveFile);

        return fileName;
    }
}
