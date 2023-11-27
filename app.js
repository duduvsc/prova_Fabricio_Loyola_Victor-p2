const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const secretKey = 'suaChaveSecreta'; // Chave secreta para assinar o token (deve ser mantida em segredo)

app.use(express.json());

// Rota de login (apenas um exemplo)
app.post('/login', (req, res) => {
  // Verificação básica das credenciais (apenas para fins de exemplo)
  const { username, password } = req.body;

  // Verificar se as credenciais são válidas (geralmente se conectaria a um banco de dados para fazer isso)
  if (username === 'usuario' && password === 'senha123') {
    // Credenciais válidas, gerar token JWT
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

    res.json({ token }); // Enviar o token de volta para o cliente
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

// Middleware para verificar o token em rotas protegidas
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.user = decoded; // Decodificado e disponível na requisição
    next();
  });
}

// Rota protegida (exemplo)
app.get('/recursoProtegido', verifyToken, (req, res) => {
  res.json({ message: 'Acesso autorizado' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
