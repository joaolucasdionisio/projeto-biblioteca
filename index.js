const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
let logado = false;

const usuario = 'admin';
const senha = 'livraria123';

let livros = [
  { id: 1, pessoaResponsavel: '', titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien' },
  { id: 2, pessoaResponsavel: '', titulo: '1984', autor: 'George Orwell' },
  { id: 3, pessoaResponsavel: '', titulo: 'Dom Casmurro', autor: 'Machado de Assis' },
  { id: 4, pessoaResponsavel: '', titulo: 'O Pequeno Príncipe', autor: 'Antoine de Saint-Exupéry' },
  { id: 5, pessoaResponsavel: '', titulo: 'Crime e Castigo', autor: 'Fiódor Dostoiévski' },
  { id: 6, pessoaResponsavel: '', titulo: 'O Hobbit', autor: 'J.R.R. Tolkien' },
  { id: 7, pessoaResponsavel: '', titulo: 'A Menina que Roubava Livros', autor: 'Markus Zusak' },
  { id: 8, pessoaResponsavel: '', titulo: 'Cem Anos de Solidão', autor: 'Gabriel García Márquez' }
];

app.get('/biblioteca', (req, res) => {
  res.status(200).json(livros);
});

app.get('/biblioteca/id/:id', (req, res) => {
  let livro = null;
  for (let i = 0; i < livros.length; i++) {
    if (livros[i].id === parseInt(req.params.id)) {
      livro = livros[i];
    }
  }
  if (livro === null) {
    return res.status(404).json({ erro: 'Livro não encontrado.' });
  }
  res.status(200).json(livro);
});

app.get('/biblioteca/autor/:autor', (req, res) => {
  let livrosAutor = null;
  for (let i = 0; i < livros.length; i++) {
    if (livros[i].autor === req.params.autor) {
      livrosAutor = livros[i];
    }
  }
  if (livrosAutor === null) {
    return res.status(200).json({ erro: 'Lista vazia.' });
  }
  res.status(200).json(livrosAutor);
});

app.post('/login', (req, res) => {
  const usuarioBody = req.body.usuario;
  const senhaBody = req.body.senha;

  if (usuarioBody === usuario && senhaBody === senha) {
    logado = true;
    res.status(200).json({ mensagem: 'Login realizado com sucesso!' });
  } else {
    res.status(401).json({ erro: 'Usuário ou senha incorretos.' });
  }
});

app.post('/retirada', (req, res) => {
  const id = req.body.id;
  const alunoResponsavel = req.body.pessoaResponsavel;

  if (!logado) {
    return res.status(401).json({ erro: 'Acesso não autorizado.' });
  } else {

    if (!id || !alunoResponsavel) {
    return res.status(400).json({ erro: 'Envie id e aluno.' });
    } 

    if (alunoResponsavel === '') {
    return res.status(400).json({ erro: 'O campo pessoaResponsavel não pode estar vazio.' });
    }

    let idEncontrado = false;
    for (let i = 0; i < livros.length; i++) {
    if (livros[i].id === parseInt(id) && livros[i].pessoaResponsavel === '' && alunoResponsavel !== '') {
      livros[i].pessoaResponsavel = alunoResponsavel;
      idEncontrado = true;
    }
   }

  if (!idEncontrado) {
    return res.status(404).json({ erro: 'Livro não encontrado.' });
  }

  if (idEncontrado) {
    res.status(201).json({ mensagem: 'Retirada realizada com sucesso!' });
  }
}
});

app.post('/devolucao', (req, res) => {
  const id = req.body.id;
  const alunoResponsavel = req.body.pessoaResponsavel;

  if (!logado) {
    return res.status(401).json({ erro: 'Acesso não autorizado.' });
  }

  if (!id || !alunoResponsavel) {
    return res.status(400).json({ erro: 'Envie id e aluno.' });
  }

  if (alunoResponsavel === '') {
    return res.status(400).json({ erro: 'O campo pessoaResponsavel não pode estar vazio.' });
  }

  let idEncontrado = false;
  for (let i = 0; i < livros.length; i++) {
    if (livros[i].id === parseInt(id) && livros[i].pessoaResponsavel === alunoResponsavel) {
      livros[i].pessoaResponsavel = '';
      idEncontrado = true;
    }
  }

  if (!idEncontrado) {
    return res.status(404).json({ erro: 'Livro não encontrado.' });
  }

  res.status(200).json({ mensagem: 'Devolução realizada com sucesso!' });
});

app.listen(3000, () => {
  console.log(`Servidor está rodando na porta http://localhost:3000`);
});