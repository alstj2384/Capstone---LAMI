package com.lami.user.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lami.user.member.domain.dto.MemberRegisterRequestDto;
import com.lami.user.member.domain.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import com.lami.user.member.domain.enums.MemorizationMethod;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
public class MemberRegistrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MemberRepository memberRepository;

    @BeforeEach
    void setUp() {
        // 테스트 전 모든 데이터 삭제하여 초기화
        memberRepository.deleteAll();
    }

    @Test
    @DisplayName("유저가 정상적으로 회원가입 되어야 합니다.")
    void testRegisterUser() throws Exception {

        MemberRegisterRequestDto memberRegisterRequestDto = new MemberRegisterRequestDto(
                "test1",
                "password1",
                "테스트입니다.",
                "test1@naver.com",
                "김테스트",
                MemorizationMethod.AssociationMethod.toString()
        );

        ResultActions resultActions = mockMvc.perform(post("/api/public/members/join")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(memberRegisterRequestDto)));

        resultActions.andExpect(status().isOk())
                .andDo(print());
    }
}
