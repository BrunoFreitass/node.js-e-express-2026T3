package br.com.aula.tarefas;

import java.time.Instant;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class RequestInterceptor implements HandlerInterceptor {
    private static final String TOKEN = "123456";
    private static final String ERRO_TOKEN = "{\"erro\":\"Token inválido. Acesso negado.\"}";

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler) throws Exception {
        System.out.printf("[%s] %s %s%n",
                Instant.now(), request.getMethod(), request.getRequestURI());

        boolean escrita = !request.getMethod().equals("GET");
        if (request.getRequestURI().startsWith("/tarefas") && escrita
                && !TOKEN.equals(request.getHeader("x-token"))) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(ERRO_TOKEN);
            return false;
        }
        return true;
    }
}
