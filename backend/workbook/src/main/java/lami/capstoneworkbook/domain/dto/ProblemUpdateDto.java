package lami.capstoneworkbook.domain.dto;

import lami.capstoneworkbook.domain.entity.Problem;
import lami.capstoneworkbook.domain.entity.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@NoArgsConstructor
@Setter
@AllArgsConstructor
public class ProblemUpdateDto {
    private String question;
    private String choices;
    private String answer;
    private QuestionType questionType;

    public static Problem toEntity(ProblemUpdateDto dto){
        return Problem.builder()
                .answer(dto.getAnswer())
                .question(dto.getQuestion())
                .questionType(dto.getQuestionType())
                .choices(dto.getChoices())
                .build();
    }

}
