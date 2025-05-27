package com.lami.user.member.application.service;

import com.lami.user.member.domain.dto.*;
import com.lami.user.member.domain.enums.MemorizationMethod;
import com.lami.user.member.domain.repository.MemberRepository;
import com.lami.user.member.infrastructure.security.AuthenticationProviderService;
import com.lami.user.member.infrastructure.security.JwtTokenProvider;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import com.lami.user.member.domain.entity.Member;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.Optional;


@Service
@Slf4j
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final AuthenticationProviderService authenticationProviderService;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisService redisService;



    @Autowired
    public MemberServiceImpl(MemberRepository memberRepository, AuthenticationProviderService authenticationProviderService,
                             @Lazy JwtTokenProvider jwtTokenProvider, RedisService redisService ) {
        this.memberRepository = memberRepository;
        this.authenticationProviderService = authenticationProviderService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.redisService = redisService;
    }


    @Override
    @Transactional
    public MemberRegisterResponseDto register(MemberRegisterRequestDto registerRequestDto) {
        Member member = Member.builder()
                .userId(registerRequestDto.getUserId())
                .password(authenticationProviderService.passwordEncoder()
                        .encode(registerRequestDto.getPassword()))
                .name(registerRequestDto.getName())
                .email(registerRequestDto.getEmail())
                .nickname(registerRequestDto.getNickname())
                .memorizationMethod(MemorizationMethod.valueOf(registerRequestDto.getMemorizationMethod()))
                .build();

        Member savedMember = memberRepository.save(member);

        return new MemberRegisterResponseDto(savedMember);
    }

    @Override
    @Transactional
    public boolean quitMember(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("유저를 찾지 못하였습니다."));

        memberRepository.delete(member);
        return true;
    }

    @Override
    public boolean checkMemberIdDuplicate(String memberId) {
        return memberRepository.existsByUserId(memberId);
    }

    @Override
    public MemberInfoListResponseDto sendUserList() {
        // 모든 유저 조회
        List<Member> members = memberRepository.findAll();
        System.out.println(members.size());

        List<MemberInfotoSingleResponseDto> userInfotoSingleList = members.stream()
                .map(member -> new MemberInfotoSingleResponseDto(member.getId(), member.getName()))
                .toList();

        return new MemberInfoListResponseDto(userInfotoSingleList);
    }

    @Override
    public MemberInfoResponseDto getUserInfo(Long memberId) {
        log.info("member id = {}", memberId);
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("유저를 찾지 못하였습니다."));

        return new MemberInfoResponseDto(
                member.getId(),
                member.getName(),
                member.getEmail()
        );
    }

    @Override
    public MemberMemorizationDto getUserMemorizationInfo(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("유저를 찾지 못하였습니다."));

        return new MemberMemorizationDto(
                member.getMemorizationMethod().toString()
        );
    }

    @Override
    public String findUsername(Long memberId) {
        Optional<Member> memberOpt = memberRepository.findById(memberId);

        if(memberOpt.isPresent()){
            Member member = memberOpt.get();
            return member.getUsername();
        } else {
            throw new IllegalArgumentException("해당 memberId를 가진 유저가 존재하지 않습니다. " + memberId);
        }
    }

    @Override
    public String extractRefreshTokenFromCookie(HttpServletRequest request) {
        String refreshToken = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refresh")) {
                    refreshToken = cookie.getValue();
                    log.info("쿠키 " + refreshToken);
                }
            }
        }
        return refreshToken;
    }

    @Override
    public TokenDto refreshToken(String refresh) {
        String memberId = jwtTokenProvider.extractMemberId(refresh);
        log.info("memberId----------- " + memberId);
        String storedRefreshToken =  redisService.getValue(memberId);
        log.info("Stored Refresh Token------------ " + storedRefreshToken);

        // 리프레시 토큰 유효성 검사
        if (storedRefreshToken == null || !storedRefreshToken.equals(refresh)) {
            log.debug("Invalid refresh token: " + storedRefreshToken);
            throw new RuntimeException("Invalid refresh token.");
        }

        // 토큰 유효성 검사
        jwtTokenProvider.validateToken(refresh);

        // 새로운 액세스 토큰 생성
        String newAccessToken = jwtTokenProvider.generateAccessToken(Long.valueOf(memberId));
        String newRefreshToken = jwtTokenProvider.createRefreshToken(Long.valueOf(memberId));

        // Redis에 새로운 리프레시 토큰 저장
        Duration expiration = Duration.ofHours(24);
        redisService.setValues(memberId, newRefreshToken, expiration);

        TokenDto newToken = new TokenDto();
        newToken.setAccessToken(newAccessToken);
        newToken.setRefreshToken(newRefreshToken);
        return newToken;
    }

    @Override
    public String getName(Long id) {
        return memberRepository.findById(id).orElseThrow().getName();
    }

    @Override // 닉네임, 암기법, 프로플 url (추후 수정할 수 있음)
    @Transactional
    public MemberInfoUpdateResponseDto updateUserInfo(Long memberId, MemberInfoUpdateRequestDto updateRequestDto) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("회원 정보를 찾을 수 없습니다."));

        if(updateRequestDto.getNickname() != null)
            member.setNickname(updateRequestDto.getNickname());
        if(updateRequestDto.getMemorizationMethod() != null)
            member.setMemorizationMethod(MemorizationMethod.valueOf(updateRequestDto.getMemorizationMethod()));
        if(updateRequestDto.getProfileImage() != null)
            member.setProfileImageUrl(updateRequestDto.getProfileImage());

        return new MemberInfoUpdateResponseDto(
          String.valueOf(member.getId()),
          member.getNickname(),
          member.getMemorizationMethod() != null ? member.getMemorizationMethod().name() : null,
          member.getProfileImageUrl()
        );
    }


}
