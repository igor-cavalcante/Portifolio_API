// config.js
const mongoose = require('mongoose');

const mongodbUri = 'mongodb+srv://userteste:3nAb7mB0P0FUXyJn@projetox.ds36m.mongodb.net/?retryWrites=true&w=majority&appName=Projetox';  // Substitua com o URI do seu MongoDB

const connectToDatabase = async () => {
    try {
        await mongoose.connect(mongodbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conectado ao MongoDB com sucesso');
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
        process.exit(1);  // Encerra o processo se a conexão falhar
    }
};

module.exports = { connectToDatabase };
