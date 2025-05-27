package com.lami.user.member.global.auth;

import com.lami.user.member.global.exception.AuthorizationException;

public class AuthorizationUtil {
    public static void validateUserAccess(Long targetMemberId, Long requestUserId) {
        if (!targetMemberId.equals(requestUserId)) {
            throw new AuthorizationException("접근 권한이 업습니다.");
        }
    }
}
