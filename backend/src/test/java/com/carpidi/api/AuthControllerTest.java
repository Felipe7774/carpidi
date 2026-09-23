package com.carpidi.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import com.carpidi.application.AuthService;
import com.carpidi.application.JwtService;
import com.carpidi.infrastructure.UserRepository;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {
  @Autowired MockMvc mvc;
  @MockitoBean AuthService authService;
  @MockitoBean JwtService jwtService;
  @MockitoBean UserRepository userRepository;

  @Test
  void registersValidClient() throws Exception {
    when(authService.register(any())).thenReturn(new AuthController.UserResponse("user-1","Diana","diana@example.com",Set.of("CLIENT")));
    mvc.perform(post("/auth/register").contentType(MediaType.APPLICATION_JSON)
        .content("{\"name\":\"Diana\",\"email\":\"diana@example.com\",\"password\":\"CarpidiSecure2026!\"}"))
        .andExpect(status().isCreated()).andExpect(header().string("Location","/api/v1/users/user-1"))
        .andExpect(jsonPath("$.roles[0]").value("CLIENT"));
  }

  @Test
  void rejectsInvalidRegistration() throws Exception {
    mvc.perform(post("/auth/register").contentType(MediaType.APPLICATION_JSON)
        .content("{\"name\":\"\",\"email\":\"bad\",\"password\":\"short\"}"))
        .andExpect(status().isBadRequest());
  }
}
