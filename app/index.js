const express = require("express");
const path = require("path");
const { connectToDatabase } = require("./configure/config"); // Importa a função de conexão
const DataModel = require("./model/potifolioSchema"); //Importa o modelo Mongoose
const app = express();
const port = 3000;
const cors = require("cors");
const multer = require("multer");

app.use(cors());
app.use(express.json()); // Para receber JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // Para poder lidar com formulários que enviam arquivos
// Configura o Multer para lidar com upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Conecta ao MongoDB
connectToDatabase();


app.get("/", (req, res) => {
  res.send({ ola: "seja bem-vindo" });
});




// Rota GET para buscar dados de um usuário pelo ID
app.get("/receber/:id", async (req, res) => {
  const { id } = req.params; // Obtém o ID dos parâmetros da requisição

  try {
    // Busca o documento pelo ID
    const dado = await DataModel.findById(id);

    if (!dado) {
      // Se não encontrar o documento, retorna 404
      return res.status(404).json({ message: 'Dado não encontrado' });
    }

    // Retorna os dados encontrados
    res.json(dado);
  } catch (err) {
    // Retorna 500 se houver um erro na busca
    res.status(500).json({ message: 'Erro ao buscar os dados', error: err.message });
  }
});



// Rota POST para salvar dados no MongoDB com imagem
app.post("/enviar", upload.single('image'), async (req, res) => {
  const { name, title, description } = req.body;
  const image = req.file.buffer.toString('base64'); // Converte a imagem para Base64

  const novoDado = new DataModel({
    name,
    title,
    description,
    image
  });

  try {
    const dadoSalvo = await novoDado.save();
    res.status(201).send(console.log("Dados enviados com sucesso"));
  } catch (err) {
    res.status(500).json({ message: 'Erro ao salvar os dados', error: err.message });
  }
});



app.listen(port, () => {
  console.log(`API e página rodando na porta ${port}`);
});
