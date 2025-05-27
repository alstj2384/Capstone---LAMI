package lami.capstoneworkbook.application;

import lami.capstoneworkbook.domain.entity.Problem;
import lami.capstoneworkbook.domain.repository.ProblemRepository;
import lami.capstoneworkbook.global.ResponseCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProblemService {
    private final ProblemRepository problemRepository;

    public Problem get(Long problemId) {
        return problemRepository.findById(problemId).orElseThrow(() -> new IllegalArgumentException(ResponseCode.PROBLEM_NOT_FOUND.getMessage()));
    }

//    JPA에서 Workbook의 속성인 Problems 할당 시 Problem 레코드가 자동 생성됨(cascade 옵션)
//    명시적으로 save를 해주어도 관계없으나, 일단 표시는 하지 않았음.
//    @Transactional
//    public void saveAll(List<Problem> problems){
//        problemRepository.saveAll(problems);
//    }

}
