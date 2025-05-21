package com.lami.user.member.infrastructure.security;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.lami.user.member.application.service.MemberDetailService;
import com.lami.user.member.application.service.RedisService;
import com.lami.user.member.domain.dto.LoginDto;
import com.lami.user.member.domain.entity.Member;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.core.AuthenticationException;
import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Slf4j
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final ObjectMapper objectMapper;
    private final RedisService redisService;
    private final MemberDetailService memberDetailService;
    private final JwtCookieUtil jwtCookieUtil;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
                                                HttpServletResponse response) throws AuthenticationException {
        try {
            // 요청 본문에서 JSON 데이터를 읽어와 LoginDto 객체로 변환
            LoginDto loginRequest = objectMapper.readValue(request.getInputStream(),
                    LoginDto.class);

            log.info("loginRequest={}",loginRequest);

            // JSON에서 userId와 password를 추출
            String userId = loginRequest.getUserId();
            String password = loginRequest.getPassword();

            // UsernamePasswordAuthenticationToken 생성
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    userId, password);

            // 인증 시도
            return authenticationManager.authenticate(authenticationToken);
        } catch (IOException e) {
            log.error("Failed to parse login request", e);
            throw new BadCredentialsException("Invalid login request format", e);
        }
    }


    // 로그인 성공시 실행 메서드
    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response, FilterChain chain, Authentication authResult)
        throws IOException, ServletException {
        UserDetails userDetails = (UserDetails) authResult.getPrincipal();

        // 사용자 정보 추가로 가져오는 로직
        Member member = (Member) memberDetailService.loadUserByUsername(userDetails.getUsername());
        long memberId = member.getId();
        log.info("success memberId: {}", memberId);

        // 토큰 생성하고 발급
        String accessToken = jwtTokenProvider.generateAccessToken(memberId);
        String refreshToken = jwtTokenProvider.createRefreshToken(memberId);
        log.info("액세스토큰: {}", accessToken);

        response.setHeader("Authorization", "Bearer " + accessToken);
        response.addCookie(jwtCookieUtil.createCookie("refresh", refreshToken));

        // redis에 refresh token 저장 (24시간 유효 시간 설정)
        Duration expiration = Duration.ofHours(24);
        redisService.setValues(String.valueOf(memberId), refreshToken, expiration);

        // 응답 본문에 memberId와 액세스 토큰 포함
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("memberId", memberId);

        String jsonResponse  = objectMapper.writeValueAsString(responseBody);
        response.getWriter().write(jsonResponse);
    }

    // 로그인 실패 시
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request,
                                              HttpServletResponse response, org.springframework.security.core.AuthenticationException failed)
        throws IOException, ServletException {
        response.setStatus(401);
    }
}
