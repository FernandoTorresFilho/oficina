const express = require('express');
const connection = require('./database/connection');

const routes = express.Router();

routes.post('/alunos', async (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const matricula = req.body.matricula;

  if (!nome || !email || !matricula) {
    return res.status(400).json({ error: 'Favor informar todos os dados.' });
  }

  const alunoJaCadastrado = await connection('alunos')
    .select('alunos.*')
    .where({ 'alunos.matricula': matricula });

  if (alunoJaCadastrado.length > 0) {
    return res.status(400).json({ error: 'Aluno já cadastrado.' });
  }

  const aluno = {
    nome,
    email,
    matricula,
  };

  const [id] = await connection('alunos').insert(aluno, 'id');

  return res.json({
    id,
    ...aluno,
  });
});

routes.get('/alunos', async (req, res) => {
  const alunosExistem = await connection('alunos').select('alunos.*');

  if (alunosExistem.length === 0) {
    return res.status(400).json({ error: 'Lista vazia' });
  }

  const listaDeAlunos = alunosExistem.map((aluno) => {
    return {
      id: aluno.id,
      nome: aluno.nome,
      email: aluno.email,
      matricula: aluno.matricula,
    };
  });

  return res.json(listaDeAlunos);
});

routes.get('/alunos/:id', async (req, res) => {
  const id = req.params.id;

  const [alunoExiste] = await connection('alunos')
    .select('alunos.*')
    .where({ 'alunos.id': id });

  if (!alunoExiste) {
    return res.status(400).json({ error: 'Aluno não existe' });
  }

  return res.json(alunoExiste);
});

routes.put('/alunos/:id', async (req, res) => {
  const id = req.params.id;
  const nome = req.body.nome;
  const email = req.body.email;
  const matricula = req.body.matricula;

  const [alunoExiste] = await connection('alunos')
    .select('alunos.*')
    .where({ 'alunos.id': id });

  if (!alunoExiste) {
    return res.status(400).json({ error: 'Aluno não existe' });
  }

  if (matricula) {
    const [matriculaExiste] = await connection('alunos')
      .select('alunos.*')
      .where({ 'alunos.matricula': matricula });

    if (matriculaExiste) {
      return res.status(400).json({ error: 'Matricula indisponível' });
    }
  }

  const aluno = {
    nome: nome || alunoExiste.nome,
    email: email || alunoExiste.email,
    matricula: matricula || alunoExiste.matricula,
  };

  await connection('alunos').update(aluno).where({ 'alunos.id': id });

  return res.json({
    id,
    ...aluno,
  });
});

routes.delete('/alunos/:id', async (req, res) => {
  const id = req.params.id;

  const [alunoExiste] = await connection('alunos')
    .select('alunos.*')
    .where({ 'alunos.id': id });

  if (!alunoExiste) {
    return res.status(400).json({ error: 'Aluno não existe' });
  }

  await connection('alunos').del().where({ 'alunos.id': id });

  return res.json({ deleted: id });
});

module.exports = routes;
