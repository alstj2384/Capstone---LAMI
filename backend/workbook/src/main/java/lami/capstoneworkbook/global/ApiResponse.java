package lami.capstoneworkbook.global;

import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Data
public class ApiResponse<T> {
    private Integer status;
    private String message;
    private T data;

    public ApiResponse(ResponseCode code, T data) {
        this.status = code.getStatus().value();
        this.message = code.getMessage();
        this.data = data;
    }

    public ApiResponse(ResponseCode code) {
        this.status = code.getStatus().value();
        this.message = code.getMessage();
        this.data = null;
    }
    public ApiResponse(HttpStatus status, String message, T data) {
        this.status = status.value();
        this.message = message;
        this.data = data;
    }

    public ApiResponse(HttpStatus status, String message) {
        this.status = status.value();
        this.message = message;
        this.data = null;
    }

    public static <T> ResponseEntity<ApiResponse<T>> response(ResponseCode responseCode, T data){
        return ResponseEntity.status(responseCode.getStatus())
                .body(new ApiResponse<>(responseCode, data));
    }

    public static <T> ResponseEntity<ApiResponse<T>> response(ResponseCode responseCode){
        return ResponseEntity.status(responseCode.getStatus())
                .body(new ApiResponse<>(responseCode));
    }

    public static <T> ResponseEntity<ApiResponse<T>> response(HttpStatus status, String message, T data){
        return ResponseEntity.status(status)
                .body(new ApiResponse<>(status, message, data));
    }


    public static <T> ResponseEntity<ApiResponse<T>> response(HttpStatus status, String message){
        return ResponseEntity.status(status)
                .body(new ApiResponse<>(status, message));
    }

}
