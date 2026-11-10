# Orbit — simulador independente de demonstração

Aplicação web original para experimentar um minijogo de curva crescente em **modo de demonstração**. O projeto não é afiliado à Orabet nem conectado a qualquer plataforma de apostas. Não aceita dinheiro, não processa apostas e não prevê resultados. Os créditos são fictícios e permanecem apenas no navegador.

## Análise de referência e escopo

A URL informada foi usada somente como referência para a categoria geral de experiência de jogo interativo. O conteúdo e os fluxos internos de uma plataforma autenticada não foram tratados como requisitos confirmados nem copiados. O escopo implementado é uma alternativa independente: uma única página de jogo demonstrativo, com saldo local, controles de rodada, gráfico próprio, histórico da sessão e explicações visíveis. Não há scraping, conexão com a plataforma de referência, API de terceiros, autenticação ou backend.

### Mapa funcional e fluxo

```text
Página Orbit / Ascensão
  → definir créditos demo (ou escolher um valor rápido)
  → iniciar rodada (validação e estado de preparação)
  → acompanhar curva e multiplicador simulados
  → sair durante a rodada OU aguardar o fim aleatório local
  → atualizar carteira demo e adicionar resultado ao histórico
  → iniciar outra rodada ou repor créditos
```

| Página/rota | Finalidade | Componentes e interações | Dados |
| --- | --- | --- | --- |
| `/` | Simulador demonstrativo | Navegação âncora, gráfico, entrada e atalhos de créditos, iniciar/sair, carteira, histórico, reposição, FAQ e copiar código demo | Créditos fictícios no `localStorage`; rodadas no estado da sessão |

### Arquitetura

- **Frontend:** React 18, TypeScript, Vite e Tailwind CSS.
- **Componentes:** `GameChart` (curva SVG e estados visuais); interface do simulador em `App`; estado persistido de créditos em `useDemoCredits`.
- **Domínio:** tipos em `src/types`, constantes de jogo em `src/constants`, formatação e leitura tolerante de storage em `src/utils`.
- **Persistência:** apenas saldo demonstrativo local. O histórico é mantido em memória e desaparece ao recarregar.
- **Backend:** não necessário para esta demonstração. As variáveis de integração opcional estão listadas em `.env.example`; nenhuma chave é necessária para rodar o app.

## Tecnologias

- React + TypeScript
- Vite
- Tailwind CSS
- Lucide React (ícones)
- CSS responsivo e SVG para visualização do gráfico

## Requisitos

- Node.js 20.19+ ou 22.12+ recomendado
- npm

## Instalação

```bash
git clone https://github.com/alvaroponciano01/demo-casino-sim.git
cd demo-casino-sim
npm install
```

## Configuração

Copie `.env.example` para `.env` se for desenvolver uma integração própria no futuro. No estado atual nenhuma variável é obrigatória. Nunca coloque chaves privadas no frontend. Se integrar Supabase no futuro, use apenas credenciais públicas adequadas ao cliente e configure políticas RLS; segredos devem permanecer no servidor.

## Desenvolvimento

```bash
npm run dev
```

Abra o endereço local indicado pelo Vite. O simulador funciona sem conta e sem serviço externo.

## Build e pré-visualização

```bash
npm run build
npm run preview
```

## Deploy

Em Vercel, Netlify ou serviço compatível, use o comando `npm run build` e diretório de saída `dist`. Não são necessárias variáveis de ambiente para a versão atual.

## Comportamento e limitações

- O saldo inicial de demonstração é 1.000 créditos e pode ser reposto.
- Cada rodada usa um ponto final aleatório gerado localmente; o resultado não representa um jogo real e não deve ser usado para previsão ou decisão financeira.
- Valor de rodada permitido: 1 a 500 créditos demo, limitado também pelo saldo.
- Gráfico e histórico são demonstrativos; o histórico não é persistido.
- O botão de copiar utiliza a Clipboard API do navegador; se indisponível, a interface apresenta o código de demonstração como alternativa.

## Licença e independência

Código e identidade visual deste projeto são independentes. Marcas, imagens, textos e serviços de terceiros não são incorporados.
