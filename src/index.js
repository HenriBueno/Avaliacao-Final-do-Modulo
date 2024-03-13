import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
const port = 3333;

app.use(cors());
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

app.post("/criarRecados", (req, res) => {
  const mensagem = {
    id: contadorRecado,
    titulo: req.body.titulo,
    descricao: req.body.descricao,
  };

  recados.push(mensagem);
  res.status(201).send("Recado enviado com sucesso!");

  contadorRecado++;
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

/*app.get("/verRecados/:email", (req, res) => {
  res.status(200).json(recados);
});*/

app.get("/verRecados", (req, res) => {

try {
  if(recados.length===0){
    return res.status(400).send({message:'A lista está vazia'})
  }
  const limite = parseInt(req.query.limite)
  const offset = parseInt(req.query.offset)

  const itensPorPaginaPositivo = offset -1;

  const recadosPaginados = recados.slice(
    itensPorPaginaPositivo,
    itensPorPaginaPositivo + limite
  )
    res.status(200).json({
      success: true,
      message: 'Recados retornados com sucesso',
      data: recadosPaginados,
      totalProdutos: recados.length,
      paginaAtual: Math.floor(itensPorPaginaPositivo / limite) + 1,
      totalPaginas: Math.ceil(recados.length / limite),
      quantidadePorPagina: limite,
    })
  }catch(error){
    return res.status(500).send({ message: 'Erro interno'})
  }

})
