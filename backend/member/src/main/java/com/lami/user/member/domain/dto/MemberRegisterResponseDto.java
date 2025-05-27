package com.lami.user.member.domain.dto;


import com.lami.user.member.domain.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MemberRegisterResponseDto {

    private String userId;
    private String name;

    public MemberRegisterResponseDto(Member member) {
        this.userId = member.getUserId();
        this.name = member.getName();
    }

}
