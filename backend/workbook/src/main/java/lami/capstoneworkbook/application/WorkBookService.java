package lami.capstoneworkbook.application;

import jakarta.persistence.criteria.Predicate;
import lami.capstoneworkbook.domain.dto.*;
import lami.capstoneworkbook.domain.entity.Problem;
import lami.capstoneworkbook.domain.entity.WorkBook;
import lami.capstoneworkbook.domain.repository.WorkBookRepository;
import lami.capstoneworkbook.global.ResponseCode;
import lami.capstoneworkbook.global.exception.UnAuthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkBookService {
    private final WorkBookRepository workBookRepository;
    private final ApiService apiService;

    // 문제집 생성
    @Transactional
    public WorkBook create(WorkBookCreateDto dto, Long userId){
        GenerateProblemResponseDto generateProblemResponseDto = apiService.generateProblems(dto);

        List<Problem> problems = generateProblemResponseDto.getData().stream().map(ProblemDto::toEntity).collect(Collectors.toList());

        WorkBook workBook = WorkBookCreateDto.toEntity(dto, userId);

        WorkBook save = workBookRepository.save(workBook);

        save.updateProblems(problems);

//        Problem 레코드 명시적 생성
//        problemService.saveAll(problems);

        return save;
    }


    @Transactional
    public WorkBook updateWorkbook(WorkBookUpdateDto dto, Long workbookId, Long userId) {
        WorkBook workbook = findByWorkbookId(workbookId);
        checkAuthorization(userId, workbook);

        workbook.updateIsPublic(dto.getIsPublic());
        workbook.updateTitle(dto.getTitle());
        workbook.updateScript(dto.getScript());

        return workbook;
    }


    @Transactional
    public void updateProblems(List<ProblemUpdateDto> dto, Long workbookId, Long userId) {
        WorkBook workBook = findByWorkbookId(workbookId);
        checkAuthorization(userId, workBook);

        List<Problem> list = dto.stream().map(ProblemUpdateDto::toEntity).toList();

        workBook.updateProblems(list);
    }

    @Transactional
    public void delete(Long workbookId, Long userId){
        WorkBook workbook = findByWorkbookId(workbookId);
        checkAuthorization(userId, workbook);

        workbook.delete();
    }

    public WorkBook findByWorkbookId(Long workbookId){
        return workBookRepository.findById(workbookId).orElseThrow(() -> new IllegalArgumentException(ResponseCode.WORKBOOK_NOT_FOUND.getMessage()));
    }

    public Page<WorkBook> getList(WorkBookGetListDto dto, Pageable pageable) {
        Specification<WorkBook> spec = filterBy(dto);
        return workBookRepository.findAll(spec, pageable);
    }

    private void checkAuthorization(Long userId, WorkBook wb) {
        if(!userId.equals(wb.getUserId()))
            throw new UnAuthorizedException(ResponseCode.FORBIDDEN_ACCESS);
    }


    private Specification<WorkBook> filterBy(WorkBookGetListDto dto) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (dto.getTitle() != null) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + dto.getTitle().toLowerCase() + "%"));
            }

            if (dto.getScript() != null) {
                predicates.add(cb.like(cb.lower(root.get("script")), "%" + dto.getScript().toLowerCase() + "%"));
            }

            if (dto.getAuthor() != null) {
                predicates.add(cb.like(cb.lower(root.get("author")), "%" + dto.getAuthor().toLowerCase() + "%"));
            }

            if (dto.getDifficulty() != null) {
                predicates.add(cb.equal(root.get("difficulty"), dto.getDifficulty()));
            }

            if (dto.getCategory() != null) {
                predicates.add(cb.like(root.get("category"), "%" + dto.getCategory() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

}
