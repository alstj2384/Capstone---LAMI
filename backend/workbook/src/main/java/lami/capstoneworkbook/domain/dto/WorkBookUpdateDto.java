package lami.capstoneworkbook.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorkBookUpdateDto {
    private Boolean isPublic;
    private String script;
    private String title;
    private String category;
}
