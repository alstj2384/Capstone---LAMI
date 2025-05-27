package lami.capstoneworkbook.presentation.controller;

import lami.capstoneworkbook.application.ProblemService;
import lami.capstoneworkbook.application.WorkBookService;
import lami.capstoneworkbook.domain.dto.ProblemResponseDto;
import lami.capstoneworkbook.domain.dto.ProblemUpdateDto;
import lami.capstoneworkbook.domain.entity.Problem;
import lami.capstoneworkbook.domain.entity.WorkBook;
import lami.capstoneworkbook.global.ApiResponse;
import lami.capstoneworkbook.global.ResponseCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/problem")
public class ProblemController {
    private final ProblemService problemService;
    private final WorkBookService workBookService;

    @GetMapping("/{problemId}")
    public ResponseEntity<ApiResponse<ProblemResponseDto>> get(@PathVariable Long problemId){
        log.info("문제 조회 요청, problemId = {}", problemId);
        Problem problem = problemService.get(problemId);

        // 응답 DTO로 변환
        ProblemResponseDto dto = ProblemResponseDto.toDto(problem);
        return ApiResponse.response(ResponseCode.SUCCESS, dto);
    }


    @PatchMapping("/{workbookId}")
    public ResponseEntity<?> update(@RequestHeader("X-User-Id") Long userId, @PathVariable Long workbookId,
                                    @RequestBody List<ProblemUpdateDto> dto){
        log.info("문제 수정, userId = {}, workbookId = {}, dto = {}", userId, workbookId, dto);

        workBookService.updateProblems(dto, workbookId, userId);

        return ApiResponse.response(ResponseCode.PROBLEM_UPDATE_SUCCESS);
    }


    // WorkBook id로 문제(다수 건) 조회
    @GetMapping("/list/{workbookId}")
    public ResponseEntity<ApiResponse<List<ProblemResponseDto>>> getList(@PathVariable Long workbookId){
        log.info("문제 여러 건 조회, workbookId = {}", workbookId);
        WorkBook workBook = workBookService.findByWorkbookId(workbookId);
        List<Problem> problems = workBook.getProblems();

        // 응답 DTO로 변환
        List<ProblemResponseDto> responseDto = problems.stream().map(ProblemResponseDto::toDto).toList();
        return ApiResponse.response(ResponseCode.SUCCESS, responseDto);
    }
}
