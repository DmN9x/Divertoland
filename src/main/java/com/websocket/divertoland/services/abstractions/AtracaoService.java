package com.websocket.divertoland.services.abstractions;

import java.util.List;

import com.websocket.divertoland.domain.Atracao;

public interface AtracaoService 
{
    List<Atracao> listAtracoesAsync();
}
