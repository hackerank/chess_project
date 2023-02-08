package com.web_chess.chess_project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;

import com.web_chess.chess_project.filters.AuthFilter;



@SpringBootApplication
public class ChessProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChessProjectApplication.class, args);
	}

	@Bean
	public FilterRegistrationBean<AuthFilter> filterRegistrationBean()
	{
		FilterRegistrationBean<AuthFilter> filterRegistrationBean = new FilterRegistrationBean<>();
		AuthFilter authFilter = new AuthFilter();
		filterRegistrationBean.setFilter(authFilter);
		filterRegistrationBean.addUrlPatterns("/api/game_window/*");
		return filterRegistrationBean;
	}
}
