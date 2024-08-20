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
      return res.status(404).json({ message: "Dado não encontrado" });
    }

    // Retorna os dados encontrados
    res.json(dado);
  } catch (err) {
    // Retorna 500 se houver um erro na busca
    res
      .status(500)
      .json({ message: "Erro ao buscar os dados", error: err.message });
  }
});

// Rota POST para enviar dados e salvar no MongoDB
app.post("/enviar", upload.single("image"), async (req, res) => {
  try {
    // Converte o arquivo para Base64
    const imageBase64 = req.file ? req.file.buffer.toString("base64") : "";

    // Cria um novo documento com os dados recebidos
    const novoDado = new DataModel({
      name: req.body.name,
      title: req.body.title,
      description: req.body.description,
      image: imageBase64, // Imagem em Base64
    });

    // Salva o documento no MongoDB
    const salvoDado = await novoDado.save();

    // Retorna o ID do documento criado
    res.json({ id: salvoDado._id });
  } catch (err) {
    console.error("Erro ao salvar os dados:", err);
    res
      .status(500)
      .json({ message: "Erro ao salvar os dados", error: err.message });
  }
});

app.listen(port, () => {
  console.log(`API e página rodando na porta ${port}`);
});
