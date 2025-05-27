package lami.capstoneworkbook.domain.dto;

import lami.capstoneworkbook.domain.entity.Problem;
import lami.capstoneworkbook.domain.entity.QuestionType;
import lombok.*;

@Getter
@NoArgsConstructor
@Setter
@AllArgsConstructor
@Builder
public class ProblemResponseDto {
    private String question;
    private String choices;
    private String answer;
    private QuestionType questionType;
    private Integer sequenceNumber;
    private Long problemId;

    public static ProblemResponseDto toDto(Problem problem) {
        return ProblemResponseDto.builder()
                .question(problem.getQuestion())
                .problemId(problem.getId())
                .sequenceNumber(problem.getSequenceNumber())
                .choices(problem.getChoices())
                .answer(problem.getAnswer())
                .questionType(problem.getQuestionType()).build();
    }
}
