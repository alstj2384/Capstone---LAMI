package lami.capstoneworkbook.presentation.controller;

import lami.capstoneworkbook.application.WorkBookService;
import lami.capstoneworkbook.domain.dto.WorkBookCreateDto;
import lami.capstoneworkbook.domain.dto.WorkBookGetListDto;
import lami.capstoneworkbook.domain.dto.WorkBookResponseDto;
import lami.capstoneworkbook.domain.dto.WorkBookUpdateDto;
import lami.capstoneworkbook.domain.entity.WorkBook;
import lami.capstoneworkbook.global.ApiResponse;
import lami.capstoneworkbook.global.ResponseCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workbook")
@RequiredArgsConstructor
@Slf4j
public class WorkbookController {
    private final WorkBookService workBookService;

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@ModelAttribute WorkBookCreateDto dto,
                                                      @RequestHeader("X-User-Id") Long userId){
        log.info("문제집 생성, userId = {}", userId);
        workBookService.create(dto, userId);

        return ApiResponse.response(ResponseCode.WORKBOOK_CREATE_SUCCESS);
    }


    // 문제집 단 건 조회
    @GetMapping("/{workbookId}")
    public ResponseEntity<ApiResponse<WorkBookResponseDto>> get(@PathVariable Long workbookId){
        log.info("문제집 조회, workbookId = {}", workbookId);
        WorkBook wb = workBookService.findByWorkbookId(workbookId);

        // 응답 DTO로 변환
        WorkBookResponseDto response = WorkBookResponseDto.toDto(wb);
        return ApiResponse.response(ResponseCode.SUCCESS, response);
    }


    // 문제집 여러 건 조회(제목, 스크립트, 카테고리, 난이도)
    @GetMapping("/list")
    public ResponseEntity<ApiResponse<Page<WorkBookResponseDto>>> getList(@ModelAttribute WorkBookGetListDto dto,
                                                               @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<WorkBook> workbook = workBookService.getList(dto, pageable);

        // 응답 DTO로 변환
        Page<WorkBookResponseDto> response = workbook.map(WorkBookResponseDto::toDto);
        return ApiResponse.response(ResponseCode.SUCCESS, response);
    }

    @PatchMapping("/{workbookId}")
    public ResponseEntity<ApiResponse<WorkBookResponseDto>> update(@RequestBody WorkBookUpdateDto dto,
                                                                   @PathVariable Long workbookId,
                                                                   @RequestHeader("X-User-Id") Long userId){
        log.info("문제집 수정, userId = {}, workbookId = {}, dto = {}", userId, workbookId, dto);
        WorkBook wb = workBookService.updateWorkbook(dto, workbookId, userId);

        // 응답 DTO로 변환
        WorkBookResponseDto response = WorkBookResponseDto.toDto(wb);

        return ApiResponse.response(ResponseCode.WORKBOOK_UPDATE_SUCCESS, response);
    }


    @DeleteMapping("/{workbookId}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long workbookId, @RequestHeader("X-User-Id") Long userId){
        // Delete 정책: 관련 UserId= NULL, isPublic = False
        log.info("문제집 삭제, userId = {}, workbookId = {}", userId, workbookId);
        workBookService.delete(workbookId, userId);

        return ApiResponse.response(ResponseCode.WORKBOOK_DELETE_SUCCESS);
    }




}
