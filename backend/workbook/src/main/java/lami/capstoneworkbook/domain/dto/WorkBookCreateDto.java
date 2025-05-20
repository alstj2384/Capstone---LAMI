package lami.capstoneworkbook.domain.dto;

import lami.capstoneworkbook.domain.entity.WorkBook;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorkBookCreateDto {
    private MultipartFile pdf;
    private String title;
    private Boolean isPublic;
    private Integer difficulty;
    private Integer multipleChoiceAmount;
    private Integer trueFalseAmount;
    private Integer shortAnswerAmount;
    private String script;
    private String category;


    public static WorkBook toEntity(WorkBookCreateDto dto, Long userId){
        return WorkBook.builder()
                .difficulty(dto.getDifficulty())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .isPublic(dto.getIsPublic())
                .script(dto.getScript())
                .category(dto.getCategory())
                .problems(new ArrayList<>())
                .title(dto.getTitle())
                .uuid(UUID.randomUUID().toString())
                .userId(userId).build();
    }
}
