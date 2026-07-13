# Contrato da API — Bibloteca de DS

**Trio:** Ryan, João Lucas Fernandes, João Lucas Dionísio
**Tema:** Biblioteca da Escola

| Método | Endpoint      | Entrada                              | Resposta                            | Status    |
|--------|---------------|--------------------------------------|-------------------------------------|-----------|
| GET    | `/`           | —                                    | página HTML (frontend)              | 200       |
| GET    | `/biblioteca`| `autor`, `id livro` (query URL, opcional)         | lista dos livros da biblioteca em JSON        | 200       |
| POST   | `/login`      | `usuario`, `senha` (body JSON)       | mensagem de sucesso / erro          | 200 / 401 |
| POST   | `/retirada`   | `id`, `aluno` (body JSON) | confirmação + livro selecionado   | 201 / 400 / 404 |

## Decisões de projeto (justificar no contrato!)

- **`autor` vai na query URL** porque é um filtro público de busca — pode aparecer na barra do navegador (o "envelope").
- **`usuario` e `senha` vão no body JSON** porque são dados privados (a "carta").
- **`/retirada` responde 400** quando falta campo ou o livro já foi reservado, **404** quando o id do livro não existe, **201** quando a retirada é criada com sucesso.
- Dados guardados em um **vetor na memória** — reiniciou o servidor, estoque volta ao inicial.

## Casos de teste no Postman

| # | Requisição | Esperado |
|---|-----------|----------|
| 1 | `GET /biblioteca` | 200 — lista completa (8 livros) |
| 2 | `GET /biblioteca?autor=Monteiro Lobato` | 200 — só 1 livro |
| 3 | `GET /biblioteca?id=9` | 200 — lista vazia `[]` |
| 4 | `POST /login` com `admin` / `biblioteca123` | 200 — sucesso |
| 5 | `POST /login` com senha errada | 401 — erro |
| 6 | `POST /retirada` `{id: 3, aluno: "NomeDoUsuário"}` | 201 — Livro é retirado e validação confirmada |
| 7 | `POST /retirada` sem o campo `aluno` | 400 — erro de validação |
| 8 | `POST /retirada` `{id: 99, ...}` | 404 — livro não existe |
| 9 | `POST /retirada` `logado = false` | 401 — Acesso não autorizado |
| 10 | `POST /devolucao` `logado = false` | 401 — Acesso não autorizado |
| 11 | `POST /devolucao` sem o campo `aluno` | 400 — erro de validação |
| 12 | `POST /devolucao` `{id: 99, ...}` | 404 — livro não existe |