package lami.capstoneworkbook.domain.dto;

import lami.capstoneworkbook.domain.entity.WorkBook;
import lombok.*;

@Getter
@NoArgsConstructor
@Setter
@AllArgsConstructor
@Builder
public class WorkBookResponseDto {
    private String title;
    private Boolean isPublic;
    private Integer difficulty;
    private Integer questionAmount;
    private String script;
    private Long workbookId;
    private Long userId;
    private String category;

    public static WorkBookResponseDto toDto(WorkBook workBook){
        return WorkBookResponseDto.builder()
                .difficulty(workBook.getDifficulty())
                .isPublic(workBook.getIsPublic())
                .script(workBook.getScript())
                .title(workBook.getTitle())
                .workbookId(workBook.getId())
                .category(workBook.getCategory())
                .userId(workBook.getUserId())
                .build();
    }
}
