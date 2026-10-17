# Como editar o Almanaque da Maria

Você só precisa mexer em **um arquivo: `conteudo.js`**.
Os outros arquivos são o "motor" do site e podem ficar quietos.

| Arquivo        | O que é                                | Mexer?       |
|----------------|----------------------------------------|--------------|
| `conteudo.js`  | Todos os textos e listas               | **Sim**      |
| `index.html`   | Estrutura das páginas                  | Não          |
| `estilo.css`   | Cores, fontes, visual                  | Só se quiser |
| `site.js`      | Animações e interações                 | Não          |

## Passo a passo

1. Abra `conteudo.js` no VS Code.
2. Troque o texto **entre as aspas**. Exemplo:
   ```js
   frase1: "Maria linda.",
   ```
3. Salve (Ctrl+S) e aperte F5 no navegador.

## As 3 regras que evitam quebrar o site

- Mantenha as **aspas** em volta dos textos: `"assim"`.
- Mantenha a **vírgula** no fim de cada linha de lista.
- Se precisar usar aspas *dentro* de um texto, use aspas simples: `"ela disse 'oi'"`.

Se o site ficar em branco depois de uma edição, quase sempre é uma vírgula ou aspa faltando na linha que você mexeu.

## Adicionar ou remover itens

Para adicionar um elogio, copie uma linha inteira e cole embaixo:
```js
elogios: [
  "Você é a prova de que perfeição existe.",
  "Meu elogio novo aqui.",          // <- linha nova, com vírgula
],
```
Funciona igual para `admiro`, `vales`, `adjetivos` e os parágrafos da `carta`.
O índice da capa e a numeração dos capítulos se ajustam sozinhos.

## Segredos do site (pra você saber)

- Clicar na lua da capa faz ela passar por todas as fases.
- A lua da capa mostra a **fase real do dia** em que ela abrir o site.
- Digitar o nome dela no teclado (computador) solta uma chuva de luazinhas.
- No medidor, segurar o botão até o fim por alguns segundos **quebra o aparelho**.
- Os vales resgatados ficam salvos no celular dela.
- O botão "Não" da última página foge. No celular, ele foge do dedo.
- Em celulares Android, alguns momentos vibram de leve.

## Publicar / atualizar o site (GitHub Pages)

Depois que o site estiver no ar, para atualizar:

```
git add .
git commit -m "ajustes"
git push
```

Em 1 ou 2 minutos o link já mostra a versão nova (no celular, recarregue a página).
