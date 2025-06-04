package com.lami.user.member.application.service;


import com.lami.user.member.domain.dto.MemberPasswordRequestDto;
import com.lami.user.member.domain.entity.Member;
import com.lami.user.member.domain.repository.MemberRepository;
import com.lami.user.member.global.exception.DuplicateEmailException;
import com.lami.user.member.infrastructure.security.AuthenticationProviderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@Slf4j
@RequiredArgsConstructor
public class ResetServiceImpl implements ResetService {

    private final MemberRepository memberRepository;
    private final RedisService redisService;
    private final AuthenticationProviderService authenticationProviderService;
    private final EmailService emailService;

    @Override
    public MemberPasswordRequestDto requestMemberId(String userId) {
        // 사용자 정보 조회
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        MemberPasswordRequestDto dto = new MemberPasswordRequestDto();
        dto.setUserId(member.getUserId());
        return dto;
    }


    // 임의로 생성된 uuid 문자열을 유저의 이메일로 전송
    @Override
    public void sendResetRandomNumber(String userId) {
        // 사용자 정보 조회
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 랜덤 6자리 숫자 생성
        String resetCode = generateRandomCode(6);

        // 생성한 인증정보를 redis에 설정하여 나중에 검증할 수 있도록 함 (redis에서 유효시간도 함께 설정)
        Duration duration = Duration.ofMinutes(3);
        redisService.setValues(userId, resetCode, duration);
        log.info("전송되는지 확인합니다. {}, {}", userId, resetCode);

        // 이메일 전송
        String emailContent = "laml!! \n 인증번호는 아래와 같습니다. \n" + resetCode;
        emailService.sendEmail(member.getEmail(), "lami 인증번호 입니다.", emailContent);
    }

    @Override
    public void resetPassword(String userId, String newPassword) {

        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 비밀번호 암호화
        String encodedPassword = authenticationProviderService.passwordEncoder()
                .encode(newPassword);

        // 비밀번호 업데이트
        member.setPassword(encodedPassword);
        memberRepository.save(member);
    }

    @Override
    public boolean validateAuthCode(String userId, String inputCode) {
        String storedCode = redisService.getValue(userId);
        return storedCode != null && storedCode.equals(inputCode);
    }

    @Override
    public void sendRegistrationCode(String email) {

        if (memberRepository.existsByEmail(email)) {
            throw new DuplicateEmailException("이미 사용중인 이메일입니다. 다른 이메일을 사용해주세요");
        }

        // 해당 이메일로 랜덤한 번호 보내기
        String resetCode = generateRandomCode(6);

        // 생성한 인증정보를 redis에 설정
        Duration duration = Duration.ofMinutes(3);
        redisService.setValues(email, resetCode, duration);

        // 이메일 전송
        String emailContent = "lami ! 회원가입시 인증번호는 아래와 같습니다. \n" + resetCode;
        emailService.sendEmail(email, "lami 인증번호 입니다.", emailContent);

    }

    @Override
    public void isEqualNumber(String email, String code) {
        String storedCode = redisService.getValue(email);
        log.info("email, code, storedcode {}, {}, {}", email, code, storedCode);

        if(!(storedCode != null && storedCode.equals(code))){
            throw new IllegalArgumentException("인증번호 다름");
        }
    }

    // 랜덤한 번호 6자리를 보냄.
    private String generateRandomCode(int length) {
        SecureRandom random = new SecureRandom();
        return IntStream.range(0, length)
                .map(i -> random.nextInt(10)) // 0-9 범위의 숫자 생성
                .mapToObj(String::valueOf)
                .collect(Collectors.joining());
    }
}
