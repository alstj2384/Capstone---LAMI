package lami.capstoneworkbook.domain.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    private WorkBook workBook;

    private String choices;

    private String question;

    @Enumerated(EnumType.STRING)
    private QuestionType questionType;

    private String answer;
    private Integer sequenceNumber;

    public void setWorkBook(WorkBook workBook){
        this.workBook = workBook;
    }
    public void setSequenceNumber(Integer num){
        this.sequenceNumber = num;
    }

}
