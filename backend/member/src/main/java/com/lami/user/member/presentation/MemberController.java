package com.lami.user.member.presentation;

import com.lami.user.member.application.service.MemberService;
import com.lami.user.member.application.service.RedisService;
import com.lami.user.member.application.service.ResetService;
import com.lami.user.member.domain.dto.*;
import com.lami.user.member.infrastructure.security.JwtCookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api")
public class MemberController {

    private final MemberService memberService;
    private final JwtCookieUtil jwtCookieUtil;
    private final RedisService redisService;
    private final ResetService resetService;

    // [PUBLIC] 회원가입
    @PostMapping("/public/members/join")
    public ResponseEntity<ApiResponseDto<?>> register(@RequestBody MemberRegisterRequestDto registerRequestDto) {
        log.info("회원가입 요청: {}", registerRequestDto);
        MemberRegisterResponseDto response = memberService.register(registerRequestDto);
        return ResponseEntity.ok(ApiResponseDto.success("회원가입이 완료되었습니다.", response));
    }

    // [PUBLIC] 아이디 중복 확인
    @GetMapping("/public/members/validate/{memberId}")
    public ResponseEntity<ApiResponseDto<?>> checkMemberId(@PathVariable String memberId) {
        if (memberService.checkMemberIdDuplicate(memberId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponseDto.error(HttpStatus.CONFLICT.value(), "이미 사용중인 아이디입니다."));
        }
        return ResponseEntity.ok(ApiResponseDto.success("사용 가능한 아이디입니다.", null));
    }

    // [PUBLIC] 비밀번호 변경 요청 - 인증번호 전송
    @PostMapping("/public/members/reset-password/request-code")
    public ResponseEntity<ApiResponseDto<?>> sendVerificationCode(@RequestBody MemberPasswordRequestDto dto) {
        try {
            resetService.sendRestRandomNumber(dto.getUserId());
            return ResponseEntity.ok(ApiResponseDto.success("인증번호가 전송되었습니다.", null));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponseDto.error(HttpStatus.NOT_FOUND.value(), "존재하지 않는 사용자입니다."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponseDto.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "서버 오류가 발생했습니다."));
        }
    }

    // [PUBLIC] 비밀번호 변경 - 인증번호 검증
    @PostMapping("/public/members/reset-password/verify-code")
    public ResponseEntity<ApiResponseDto<?>> verifyCode(@RequestBody VerifyCodeRequestDto dto) {
        return resetService.validateAuthCode(dto.getUserId(), dto.getCode())
                ? ResponseEntity.ok(ApiResponseDto.success("인증이 완료되었습니다.", null))
                : ResponseEntity.badRequest().body(ApiResponseDto.error(HttpStatus.BAD_REQUEST.value(), "인증번호가 올바르지 않습니다."));
    }

    // [PUBLIC] 비밀번호 변경
    @PostMapping("/public/members/reset-password")
    public ResponseEntity<ApiResponseDto<?>> changePassword(@RequestBody PasswordResetRequestDto dto) {
        resetService.resetPassword(dto.getUserId(), dto.getNewPassword());
        return ResponseEntity.ok(ApiResponseDto.success("비밀번호가 변경되었습니다.", null));
    }

    // [PUBLIC] 회원가입 시 인증번호 전송
    @PostMapping("/public/members/request-regist-code")
    public ResponseEntity<ApiResponseDto<?>> sendRegistCode(@RequestBody MemberRegistEmailRequestDto dto) {
        try {
            resetService.sendRegistrationCode(dto.getEmail());
            return ResponseEntity.ok(ApiResponseDto.success("인증번호가 이메일로 전송되었습니다.", null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponseDto.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "인증번호 전송 중 오류가 발생했습니다."));
        }
    }

    // [PUBLIC] 회원가입 시 인증번호 검증
    @PostMapping("/public/members/verify-regist-code")
    public ResponseEntity<ApiResponseDto<?>> verifyRegistCode(@RequestBody MemberRegistEmailVerifyDto dto) {
        try {
            resetService.isEqualNumber(dto.getEmail(), dto.getCode());
            return ResponseEntity.ok(ApiResponseDto.success("이메일 인증이 완료되었습니다.", null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponseDto.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "인증번호 확인 중 오류가 발생했습니다."));
        }
    }

    // [PUBLIC] 로그아웃
    @PostMapping("/public/members/logout")
    public ResponseEntity<ApiResponseDto<?>> logout(@RequestBody LogoutDto dto) {
        redisService.deleteValue(String.valueOf(dto.getMemberId()));
        return ResponseEntity.ok(ApiResponseDto.success("로그아웃이 성공적으로 되었습니다.", null));
    }

    // [PUBLIC] 토큰 재발급
    @PostMapping("/public/members/reissue-token")
    public ResponseEntity<ApiResponseDto<?>> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refresh = memberService.extractRefreshTokenFromCookie(request);
        if (refresh == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponseDto.error(HttpStatus.BAD_REQUEST.value(), "Refresh Token이 없습니다."));
        }

        TokenDto newToken = memberService.refreshToken(refresh);
        response.setHeader("Authorization", "Bearer " + newToken.getAccessToken());
        response.addCookie(jwtCookieUtil.createCookie("refresh", newToken.getRefreshToken()));
        return ResponseEntity.ok(ApiResponseDto.success("토큰이 재발급되었습니다.", newToken));
    }

    // 회원 정보 조회
    @GetMapping("/members/{memberId}")
    public ResponseEntity<ApiResponseDto<?>> getMemberInfo(@PathVariable String memberId) {
        return ResponseEntity.ok(ApiResponseDto.success("회원 정보를 조회했습니다.", memberService.getUserInfo(memberId)));
    }

    // 회원 암기법 조회
    @GetMapping("/members/memorization/{memberId}")
    public ResponseEntity<ApiResponseDto<?>> getMemberMemorizatioonInfo(@PathVariable String memberId) {
        return ResponseEntity.ok(ApiResponseDto.success("회원 암기법을 조회했습니다.", memberService.getUserMemorizationInfo(memberId)));
    }

    // 회원 정보 수정
    @PatchMapping("/members/{memberId}")
    public ResponseEntity<ApiResponseDto<?>> updateMemberInfo(
            @PathVariable String memberId,
            @RequestBody MemberInfoUpdateRequestDto dto) {
        MemberInfoUpdateResponseDto updated = memberService.updateUserInfo(memberId, dto);
        return ResponseEntity.ok(ApiResponseDto.success("회원 정보가 수정되었습니다.", updated));
    }

    // 회원 탈퇴
    @DeleteMapping("/members/{memberId}")
    public ResponseEntity<ApiResponseDto<?>> deleteMember(@PathVariable String memberId) {
        if (memberService.quitMember(memberId)) {
            redisService.deleteValue(memberId);
            return ResponseEntity.ok(ApiResponseDto.success("회원 탈퇴가 완료되었습니다.", null));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponseDto.error(HttpStatus.UNAUTHORIZED.value(), "회원 탈퇴 권한이 없습니다."));
    }

    // 전체 회원 리스트 조회 (관리자용)
    @GetMapping("/members")
    public ResponseEntity<ApiResponseDto<?>> getAllMembers() {
        return ResponseEntity.ok(ApiResponseDto.success("전체 회원 목록을 조회했습니다.", memberService.sendUserList()));
    }

    // 유저 이름 조회
    @GetMapping("/members/name/{memberId}")
    public ResponseEntity<ApiResponseDto<?>> getUserName(@PathVariable Long memberId) {
        return ResponseEntity.ok(ApiResponseDto.success("사용자 이름 조회 성공", memberService.findUsername(memberId)));
    }
}
