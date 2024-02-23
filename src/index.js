import express from "express";
import bcrypt from "bcrypt";
app.use(cors());

const app = express();
const port = 3333;

app.use(express.json());

app.listen(port, () => console.log(`Server iniciado: ${port}`));

const alunos = [];
let contador = 1;

app.post("/criar", async (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;
  const senhaCriptografada = await bcrypt.hash(senha, 10);

  const estudante = {
    id: contador,
    nome: req.body.nome,
    email: req.body.email,
    senha: senhaCriptografada,
  };

  const verificaConta = alunos.find((estudante) => estudante.email === email);

  if (verificaConta) {
    res.status(404).send("Usuário existente!");
  } else {
    res.status(201).send("Usuário criado com sucesso!");
    alunos.push(estudante);
    contador++;
  }
});

//login
app.post("/login", async (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;

  const aluno = alunos.find((estudante) => estudante.email === email);
  const senhaCriptografada = await bcrypt.hash(senha, 10);

  if (aluno) {
    bcrypt.compare(senha, senhaCriptografada, (error, result) => {
      if (result) {
        res
          .status(200)
          .json({ sucess: true, message: "Login realizado com sucesso" });
      } else {
        res
          .status(400)
          .json({ sucess: false, message: "Email ou senha inválido!" });
      }
    });
  } else {
    res.status(404).send("Email ou senha inválido!");
  }
});

app.get("/usuarios", (req, res) => {
  res.status(200).json(alunos);
});

let recados = [];
let contadorRecado = 1;

app.post("/criarRecados/:email", (req, res) => {
  const mensagem = {
    id: contadorRecado,
    titulo: req.body.titulo,
    descricao: req.body.descricao,
  };

  recados.push(mensagem);
  res.status(201).send("Recado enviado com sucesso!");

  contadorRecado++;
});

app.get("/verRecados/:email", (req, res) => {
  res.status(200).json(recados);
});

app.put("/atualizarRecados/:email/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const recadosFiltrado = recados.filter((recado) => recado.id === id);

  if (recadosFiltrado.length === 0) {
    res.status(404).send("Recado não existe!");
    return;
  }

  recadosFiltrado.forEach((recado) => {
    recado.titulo = req.body.titulo;
    recado.descricao = req.body.descricao;
  });

  res.status(200).send("Recado atualizado com sucesso!");
});

app.delete("/deletarRecados/:email/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const recadosFiltrado = recados.filter((recado) => recado.id === id);

  if (recadosFiltrado.length === 0) {
    res.status(404).send("recado nao existe!");
    return;
  }

  recados = recados.filter((recado) => recado.id !== id);

  res.status(200).send("Recado deletado com sucesso!");
});
