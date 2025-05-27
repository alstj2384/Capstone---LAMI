package lami.capstoneworkbook.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Getter
public class WorkBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String title;
    private String fileName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Integer difficulty;
    private Boolean isPublic;

    private String uuid;
    private String script;

    private String category;

    @OneToMany(mappedBy = "workBook", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sequenceNumber")
    private List<Problem> problems = new ArrayList<>();

    public void updateTitle(String title){
        this.title = title == null ? this.title : title;
    }

    public void updateIsPublic(Boolean isPublic){
        this.isPublic = isPublic == null ? this.isPublic : isPublic;
    }


    public void updateScript(String script){
        this.script = script == null ? this.script : script;
    }

    public void updateProblems(List<Problem> newProblems){
        this.problems.clear();
        this.problems.addAll(newProblems);

        int seq = 1;
        for(Problem p : this.problems){
            p.setSequenceNumber(seq++);
            p.setWorkBook(this);
        }
    }

    public void delete(){
        this.userId = null;
        this.isPublic = false;
    }
}
