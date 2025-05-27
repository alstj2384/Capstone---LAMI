package com.lami.user.member.application.service;

import com.lami.user.member.domain.dto.MemberPasswordRequestDto;

public interface ResetService {

    // 사용자 정보 조회
    MemberPasswordRequestDto requestMemberId(String userId);

    // 비밀번호 재설정 번호 전송
    void sendResetRandomNumber(String userId);

    // 비밀번호 재설정
    void resetPassword(String userId, String newPassword);

    // 인증번호 일치 여부 확인
    boolean validateAuthCode(String userId, String inputCode);

    // 회원가입시 이메일 인증 번호 전송
    void sendRegistrationCode(String email);

    // 회원가입시 인증번호 일치 여부 확인
    void isEqualNumber(String email, String code);
}
