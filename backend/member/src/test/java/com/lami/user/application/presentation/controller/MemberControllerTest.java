package com.lami.user.application.presentation.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lami.user.member.application.service.MemberService;
import com.lami.user.member.domain.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class MemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // LocalDate 객체를 이용한 생성 날짜 설정
    LocalDate createdDate = LocalDate.of(2001, 6 ,26);

    @Autowired
    private MemberService memberService;

    @Autowired
    private MemberRepository memberRepository;


    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }


    // 로그아웃 테스트
//    @Test
//    @DisplayName("로그아웃이 정상적으로 되어야 합니다. 제발")
//    void testLogout() throws Exception {
//        mockMvc.perform(post("/user/logout")
//                .header("memberId", "Bearer " + accessToken))
//                .andExpect(status().isOk())
//                .andExpect(content().string("로그아웃이 성공적으로 되었습니다."))
//                .andDo(print());
//
//    }
//



}
