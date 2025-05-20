package lami.capstoneworkbook.domain.dto;

import lami.capstoneworkbook.domain.entity.Problem;
import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Builder
public class GenerateProblemResponseDto {
    private Integer status;
    private String message;
    private List<ProblemDto> data;


}
