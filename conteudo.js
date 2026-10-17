/* =====================================================================
   CONTEÚDO DO SITE DA MARIA
   ---------------------------------------------------------------------
   É SÓ AQUI QUE VOCÊ PRECISA MEXER.
   Regras simples:
   - Troque só o que está entre aspas "assim".
   - Não apague as vírgulas no final das linhas.
   - Pra adicionar um item numa lista, copie uma linha inteira
     (com a vírgula) e cole embaixo.
   - Salve o arquivo e recarregue o site (F5) pra ver a mudança.
   - Detalhes no arquivo COMO-EDITAR.md
   ===================================================================== */

window.CONTEUDO = {

  nome: "Maria",
  assinatura: "Pedro",            // seu nome, aparece no fim da carta (deixe "" pra não mostrar)


  /* ---------- CAPA ---------- */
  capa: {
    subtitulo: "Um almanaque feito à mão sobre a pessoa mais especial que eu conheço.",
    notaLua: "Você, sempre 100%.",   // aparece depois de "Hoje a lua está X% iluminada."
  },


  /* ---------- Nº 01 · A PIADA INTERNA ---------- */
  piada: {
    frase1: "Maria linda.",
    frase2: "Mas perai, não só linda.",
    // cada adjetivo tem uma "definição de dicionário" (pode deixar nota: "" se não quiser)
    adjetivos: [
      { palavra: "linda",       nota: "o básico. o ponto de partida." },
      { palavra: "maravilhosa", nota: "que causa maravilha só de existir." },
      { palavra: "magnífica",   nota: "grandiosa, mas sem se achar." },
      { palavra: "perfeita",    nota: "sem defeito encontrado até o momento." },
      { palavra: "inefável",    nota: "que não se explica com palavras. e mesmo assim eu tento." },
    ],
    final: "e simplesmente especial.",
  },


  /* ---------- Nº 02 · COISAS QUE EU ADMIRO ---------- */
  admiro: [
    { titulo: "Sua risada",   texto: "Contagiante. Melhora qualquer dia ruim, até os muito ruins." },
    { titulo: "Sua voz",   texto: "Sua voz é incrível e adorável. É muito bom só ficar te ouvindo." },
    { titulo: "Seu coração",  texto: "Ainda é cedo pra afirmar kkk, mas você parece se importar com tudo e todos. Isso é raro." },
    { titulo: "Seu brilho",   texto: "Você ilumina qualquer lugar onde chega. Até o lua fica com ciúme." },
    { titulo: "Seu jeito",    texto: "Engraçada, meio doida, incrível. Ninguém é igual." },
    { titulo: "Você inteira", texto: "Não dá pra escolher uma coisa só. É tudo." },
  ],


  /* ---------- Nº 03 · MÁQUINA DE ELOGIOS ---------- */
  elogios: [
    "Você é a prova de que perfeição existe.",
    "Sua voz é tão doce, tão fofa que dá vontade de ficar ouvindo pra sempre.",
    "A lua tem inveja de você, Maria.",
    "Seu sorriso deveria ser patrimônio da humanidade.",
    "Você é uma filhote de gatinha: todo mundo quer ter uma.",
    "Você é indescritível. Não sei como elogiar mais.",
    "Seu bom gosto é impecável (afinal, você tá lendo esse site).",
    "Você tem o dom de deixar tudo mais divertido.",
    "Se você fosse uma música, ia tocar no repeat pra sempre.",
    "O universo caprichou quando fez você.",
    "Você é a melhor notificação que eu posso receber.",
    "Magnífica é pouco. Mas é um bom começo.",
    "Você faz o mundo ser um lugar melhor só por existir.",
    "Você é simplesmente especial. Ponto final.",
  ],


  /* ---------- Nº 04 · O MEDIDOR ---------- */
  medidor: {
    marcas: ["gosto", "muito", "demais", "absurdamente"],   // escritas no mostrador
    quebrou: "Fora da escala. O aparelho não foi feito pra medir isso.",
  },


  /* ---------- Nº 05 · VALES ----------
     Ela clica em "resgatar" e fica carimbado (fica salvo no navegador dela). */
  vales: [
    "Uma saída com você no lugar mais perfeito. Tudo pago",
    "Uma foto inesperada",
    "Um abraço longo, sem hora pra acabar",
    "Vale-desabafo: eu escuto tudo, sem palpite",
    "Um doce à sua escolha",
    "Vale-razão: você ganha uma discussão, sem argumento",
  ],


  /* ---------- Nº 06 · CONSTELAÇÃO ---------- */
  constelacao: {
    instrucao: "Liga as estrelas na ordem, de 1 até o fim.",
    mensagem: "Constelação Maria. Visível todas as noites, de qualquer lugar onde eu estiver.",
  },


  /* ---------- Nº 07 · A CARTA ---------- */
  carta: {
    abertura: "Maria,",
    paragrafos: [
      "Fiz esse almanaque pra deixar registrado, num cantinho da internet que é só seu, o quanto você é especial.",
      "Você tem esse jeito de deixar tudo mais leve, mais engraçado e mais bonito. Conversar com você é uma das melhores partes do meu dia, e eu adoro demais quem você é: seu jeito, suas ideias, sua risada, tudo.",
      "Então nunca esquece: você não é só linda. Você é tudo aquilo que um dia é bom, que um dia vai ser e o que é aagora.",
    ],
    despedida: "Com todo o meu carinho,",
  },


  /* ---------- PERGUNTA FINAL ---------- */
  final: {
    pergunta: "Você sabe o quanto te amo?",
    sim: "Sim, eu sei",
    nao: ["Não", "Tem certeza?", "Erro 404", "Nem tenta", "Opção inválida", "Aperta o outro"],
    resposta: "Isso. Nunca esquece, tá?",
  },
};
