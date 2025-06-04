package lami.capstoneworkbook.domain.dto;

import lami.capstoneworkbook.domain.entity.Problem;
import lami.capstoneworkbook.domain.entity.QuestionType;
import lombok.*;

import java.util.Map;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Builder
public class ProblemDto{
    private Map<String, String> choices;
    private String question;
    private QuestionType type;
    private String answer;
    private Integer sequenceNumber;

    public static Problem toEntity(ProblemDto problemDto) {
        return Problem.builder()
                .choices(mapToString(problemDto.getChoices()))
                .questionType(problemDto.getType())
                .question(problemDto.getQuestion())
                .answer(problemDto.getAnswer())
                .build();
    }

    private static String mapToString(Map<String, String> choices){
        if(choices == null) return null;
        StringBuilder sb = new StringBuilder();

        for(int i = 0; i < 3; i++){
            sb.append(choices.get(Integer.toString(i+1))).append(",");
        }
        sb.append(choices.get(Integer.toString(4)));
        return sb.toString();
    }
}