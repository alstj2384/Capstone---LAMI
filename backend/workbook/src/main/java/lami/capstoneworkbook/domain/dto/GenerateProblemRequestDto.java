package lami.capstoneworkbook.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Builder
@ToString
public class GenerateProblemRequestDto {
    private String pdf;
    private Integer difficulty;
    @JsonProperty("multiple_choice_amount")
    private Integer multiple_choice_amount;
    @JsonProperty("true_false_amount")
    private Integer true_false_amount;
    @JsonProperty("short_answer_amount")
    private Integer short_answer_amount;

    public static GenerateProblemRequestDto toDto(WorkBookCreateDto dto, String fileName) {
        return GenerateProblemRequestDto.builder()
                .pdf(fileName)
                .difficulty(dto.getDifficulty())
                .multiple_choice_amount(dto.getMultipleChoiceAmount())
                .short_answer_amount(dto.getShortAnswerAmount())
                .true_false_amount(dto.getTrueFalseAmount())
                .build();
    }

}
