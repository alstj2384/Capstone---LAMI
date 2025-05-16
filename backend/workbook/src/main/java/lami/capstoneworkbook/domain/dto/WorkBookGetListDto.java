package lami.capstoneworkbook.domain.dto;

import lombok.*;


@Getter
@NoArgsConstructor
@Setter
@AllArgsConstructor
public class WorkBookGetListDto {
    private String title;
    private String script;
    private String author;
    private Integer difficulty;
    private String category;
}
