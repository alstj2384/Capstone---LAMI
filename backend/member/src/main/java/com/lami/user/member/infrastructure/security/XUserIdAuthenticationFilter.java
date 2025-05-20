package com.lami.user.member.infrastructure.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
public class XUserIdAuthenticationFilter extends OncePerRequestFilter {

    private final List<String> protectedUris = List.of(
            "/api/members/*",                  // 회원정보조회, 수정, 탈퇴
            "/api/members/name/*",             // 유저이름조회
            "/api/members/memorization/*",     // 유저암기법조회
            "/api/members/reset-password"      // 비밀번호변경
    );

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return protectedUris.stream().noneMatch(pattern -> pathMatcher.match(pattern, path));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String userId = request.getHeader("X-User-Id");

        if (userId == null || userId.isEmpty()) {
            log.warn("X-User-Id 헤더가 없습니다: {}", request.getRequestURI());
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"message\": \"X-User-Id 헤더가 필요합니다.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
