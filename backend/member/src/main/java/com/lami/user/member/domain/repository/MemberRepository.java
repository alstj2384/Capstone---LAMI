package com.lami.user.member.domain.repository;

import com.lami.user.member.domain.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findById(Long memberId);

    Optional<Member> findByUserId(String userId);

    boolean existsByUserId(String userId); // 사용자 ID 존재 여부 확인 메서드

    boolean existsByEmail(String email); // 사용자 email 존재 여부 확인 메서드
}
