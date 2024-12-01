const ready = fn => document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);

ready(async () => {
    "use strict";

    let atracoes = null;

    await fetch(`${Constants.API_BASE_URL}/atracao/list`)
        .then(result => result.json())
        .then(bodyResult => atracoes = bodyResult);

    const listaAtracoes = new CircularDoublyLinkedList(atracoes);
    const ELEMENTOS_CARDS = document.getElementsByClassName("atracao-card");
    const CAROUSEL = new CardCarousel(document.getElementsByClassName("atracoes-card-carousel")[0], listaAtracoes, ELEMENTOS_CARDS);
    
    const LOADER = document.getElementsByClassName("loader-atracoes-card-carousel")[0];
    const MAIN_BODY = document.getElementsByClassName("main-body")[0];

    const SIDEBAR_ATRACAO_TITLE = document.getElementById("sidebar-atracao-title");
    const SIDEBAR_ATRACAO_IMG = document.getElementById("sidebar-atracao-img");
    const SIDEBAR_ATRACAO_DESCRICAO = document.getElementById("sidebar-atracao-descricao");
    const SIDEBAR_ATRACAO_CAPACIDADE = document.getElementById("sidebar-atracao-capacidade");
    const SIDEBAR_ATRACAO_DURACAO = document.getElementById("sidebar-atracao-duracao");

    setConteudoCardSelecionado()

    let transicaoCardAcontecendo = false;
    let movimentosRestantes = 0;
    let moverCardsParaDireita = true;

    CAROUSEL.irParaCardInicial();

    do{

        let cardAtual = CAROUSEL.cards.currentNode.value;

        // Configuração inicial
        cardAtual.elemento.getElementsByClassName("atracao-card-footer")[0].innerHTML = cardAtual.conteudo.nome;
        cardAtual.elemento.style.backgroundImage = `url("data:image/jpeg;base64,${cardAtual.conteudo.imagemBase64}")`;
    
        cardAtual.elemento.addEventListener("click", e => {
    
            // Extremidades possuem cards invisíveis, e o meio é para visualizar a atração
            // Se tiver no meio de uma animação cancela
            if(CAROUSEL.isCardInicial(cardAtual) || CAROUSEL.isCardCentral(cardAtual) || CAROUSEL.isCardFinal(cardAtual) || transicaoCardAcontecendo) 
                return;

            let diferencaPosicao = CAROUSEL.indexDivisorio - cardAtual.index;
            moverCardsParaDireita = diferencaPosicao > 0;
            movimentosRestantes = Math.abs(diferencaPosicao);
            transicaoCardAcontecendo = true;
            moverParaProximoCard();
        });

        cardAtual.elemento.addEventListener("transitionend", e => {
            if(e.target.classList.contains("started-transition")){

                e.target.classList.remove("started-transition");

                if(document.getElementsByClassName("started-transition").length == 0){

                    let cardSelecionadoAtual = CAROUSEL.cards.currentNode.value;
    
                    CAROUSEL.irParaCardInicial();
    
                    do{
                        let card = CAROUSEL.cards.currentNode.value;
                        card.elemento.classList.add("no-transition");
                        card.elemento.getElementsByClassName("atracao-card-footer")[0].innerHTML = card.conteudo.nome;
                        card.elemento.style.backgroundImage = `url("data:image/jpeg;base64,${card.conteudo.imagemBase64}")`;
                        card.elemento.style.setProperty("--layer", card.index <= CAROUSEL.indexDivisorio ? card.index : CAROUSEL.quantidadeTotalCards - card.index - 1);
                        card.elemento.style.transform = `
                            translateZ(calc(var(--layer) * 1em))
                        `;
                        card.elemento.offsetHeight; // Dá um reflush no CSS
                        card.elemento.classList.remove("no-transition");
                        card.elemento.offsetHeight; // Dá um reflush no CSS
                        CAROUSEL.cards.next();
                    }
                    while(CAROUSEL.cards.currentNode.value != CAROUSEL.cardInicial);
    
                    while(CAROUSEL.cards.currentNode.value != cardSelecionadoAtual){ CAROUSEL.cards.next(); }

                    if(movimentosRestantes > 0)
                        moverParaProximoCard();
                    else
                        transicaoCardAcontecendo = false;
                }
            }
        });

        for(let i = CAROUSEL.quantidadeTotalCards - 1; i < cardAtual.index; i--){CAROUSEL.cards.prev();}
    
        CAROUSEL.cards.next();
    }
    while(CAROUSEL.cards.currentNode.value != CAROUSEL.cardInicial);

    CAROUSEL.irParaCardSelecionado();

    LOADER.style.display = "none";

    MAIN_BODY.style.justifyContent = "space-between";
    MAIN_BODY.style.alignItems = "normal";

    CAROUSEL.elemento.style.display = "flex";

    function moverParaProximoCard(){

        movimentosRestantes--;

        CAROUSEL.irParaCardInicial();
        
        do{
            let cardComparado = CAROUSEL.cards.currentNode.value;
            let cardComparadoComputedStyle = window.getComputedStyle(cardComparado.elemento);
            let camadaCard = parseInt(cardComparadoComputedStyle.getPropertyValue('--layer'));
            let novaCamada = camadaCard;
            
            if(CAROUSEL.isCardCentral(cardComparado))
                novaCamada--;
            else if(CAROUSEL.isCardNaEsquerda(cardComparado)){
                if(moverCardsParaDireita)
                    novaCamada++;
                else
                novaCamada = cardComparado.index - 1 < 0 ? 0 : novaCamada - 1;
        }
        else{
            if(moverCardsParaDireita)
                novaCamada = cardComparado.index + 1 >= CAROUSEL.quantidadeTotalCards ? 0 : novaCamada - 1;
            else
                novaCamada++;
        }

        if(novaCamada != camadaCard)
            cardComparado.elemento.classList.add("started-transition"); 

        cardComparado.elemento.style.setProperty("--layer", novaCamada);
            cardComparado.elemento.style.transform = `
                translateZ(calc(var(--layer) * 1em))
                translateX(calc(var(--largura-card) * ${moverCardsParaDireita ? 1 : -1}))
            `;

            CAROUSEL.cards.next();
        }
        while(CAROUSEL.cards.currentNode.value != CAROUSEL.cardInicial);

        while(CAROUSEL.cards.currentNode.value.index != CAROUSEL.indexDivisorio + (moverCardsParaDireita ? -1 : 1))
            CAROUSEL.cards.next();

        CAROUSEL.selecionarCard(CAROUSEL.cards.currentNode.value)
        setConteudoCardSelecionado()
    }

    function setConteudoCardSelecionado(){
        SIDEBAR_ATRACAO_TITLE.innerHTML = CAROUSEL.cardSelecionado.conteudo.nome;
        SIDEBAR_ATRACAO_IMG.setAttribute("src", `data:image/jpeg;base64,${CAROUSEL.cardSelecionado.conteudo.imagemBase64}`);
        SIDEBAR_ATRACAO_DESCRICAO.innerHTML = CAROUSEL.cardSelecionado.conteudo.descricao;
        SIDEBAR_ATRACAO_CAPACIDADE.innerHTML = `${CAROUSEL.cardSelecionado.conteudo.capacidade} pessoa(s) por vez`;

        let stringDuracao = "";
        let tempoDuracaoEmMin = CAROUSEL.cardSelecionado.conteudo.duracao;
        if(tempoDuracaoEmMin > 60){
            stringDuracao += Math.floor(tempoDuracaoEmMin / 60) + " horas";
            let minutos = tempoDuracaoEmMin % 60;
            if(minutos > 0)
                stringDuracao += " e " + minutos + " minutos";
        }
        else{
            if(tempoDuracaoEmMin > 0)
                stringDuracao += tempoDuracaoEmMin + " minutos";
            else
                stringDuracao += "menos de 1 minuto";
        }
        SIDEBAR_ATRACAO_DURACAO.innerHTML = stringDuracao;
    }
});