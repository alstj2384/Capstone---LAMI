package com.lami.user.member.application.service;

import com.lami.user.member.domain.dto.*;
import jakarta.servlet.http.HttpServletRequest;

public interface MemberService {

    public MemberRegisterResponseDto register(MemberRegisterRequestDto registerRequestDto);


    public String getName(Long id);

    public boolean quitMember(Long memberId);


    // 중복 아이디 조회
    public boolean checkMemberIdDuplicate(String userId);

    public String extractRefreshTokenFromCookie(HttpServletRequest request);

    public TokenDto refreshToken(String refreshToken);

    // 유저 전체 리스트 조회
    public MemberInfoListResponseDto sendUserList();


    // 유저 정보 조회
    public MemberInfoResponseDto getUserInfo(Long memberId);


    // 유저 암기법 조회
    MemberMemorizationDto getUserMemorizationInfo(Long memberId);

    // 유저 이름 조회
    public String findUsername(Long memberId);


    // 유저 정보 수정 (비밀번호 외 다른 수정 정보)
    public MemberInfoUpdateResponseDto updateUserInfo(Long memberId, MemberInfoUpdateRequestDto updateRequestDto);




}
