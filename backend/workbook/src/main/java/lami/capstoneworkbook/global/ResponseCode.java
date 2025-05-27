package lami.capstoneworkbook.global;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ResponseCode {
    // === 공통 성공 ===
    SUCCESS(HttpStatus.OK, "요청에 성공했습니다"),

    // === 문제집 관련 ===
    WORKBOOK_CREATE_SUCCESS(HttpStatus.CREATED, "문제집 생성을 성공했습니다"),
    WORKBOOK_NOT_FOUND(HttpStatus.NOT_FOUND, "문제집을 찾을 수 없습니다"),
    WORKBOOK_UPDATE_SUCCESS(HttpStatus.OK, "문제집 수정에 성공했습니다"),
    WORKBOOK_DELETE_SUCCESS(HttpStatus.OK, "문제집 삭제에 성공했습니다"),

    // === 문제 관련 ===
    PROBLEM_CREATE_SUCCESS(HttpStatus.CREATED, "문제 생성을 성공했습니다"),
    PROBLEM_NOT_FOUND(HttpStatus.NOT_FOUND, "문제를 찾을 수 없습니다"),
    PROBLEM_UPDATE_SUCCESS(HttpStatus.OK, "문제 수정에 성공했습니다"),
    PROBLEM_DELETE_SUCCESS(HttpStatus.OK, "문제 삭제에 성공했습니다"),

    // === 권한/인증 관련 ===
    FORBIDDEN_ACCESS(HttpStatus.FORBIDDEN, "요청한 리소스에 대한 권한이 없습니다"),

    // === AI 서버 관련 ===
    AI_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "AI 서버에 오류가 발생하여 응답에 실패했습니다"),

    // === 서버/기타 ===
    FILE_TYPE_NOT_MATCH(HttpStatus.BAD_REQUEST, "파일 타입이 PDF가 아닙니다"),
    FILE_PROCESS_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "파일 처리중 문제가 발생했습니다");


    ResponseCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    private final HttpStatus status;
    private final String message;
}
