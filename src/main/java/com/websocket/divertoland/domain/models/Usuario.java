package com.websocket.divertoland.domain.models;

import com.websocket.divertoland.domain.enums.Role;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String email;
    private String senha;
    private Role cargo;
    @ManyToOne
    private Atracao atracao;
    private int posicaoFila;

    public Usuario(){}
    
    public Usuario(String nome, String email, String senha) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }
}
