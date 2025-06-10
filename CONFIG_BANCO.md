# 🚀 CONFIGURAÇÃO DO BANCO DE DADOS

## ✅ Para a aplicação funcionar AGORA (modo demonstração):

A aplicação já está funcionando em **modo demonstração** com dados fictícios. Você pode usá-la imediatamente sem configurar nada!

### Credenciais de Login:

- **Email:** admin@dscar.com
- **Senha:** admin

---

## 🗄️ Para usar com banco de dados real (Neon DB):

### 1. Crie um arquivo `.env` na raiz do projeto:

```bash
# No terminal, na pasta do projeto:
touch .env
```

### 2. Adicione as variáveis de ambiente no arquivo `.env`:

```env
# Configuração do Banco de Dados Neon
EXPO_PUBLIC_DATABASE_URL="postgresql://usuario:senha@ep-example-123456.us-east-1.aws.neon.tech/dscar?sslmode=require"
DATABASE_URL="postgresql://usuario:senha@ep-example-123456.us-east-1.aws.neon.tech/dscar?sslmode=require"
```

### 3. Substitua pelos seus dados reais:

- **usuario**: Seu usuário do Neon DB
- **senha**: Sua senha do Neon DB
- **ep-example-123456**: Seu endpoint do Neon DB
- **dscar**: Nome do seu banco de dados

### 4. Configure o schema do banco:

```bash
# Gerar migrações
npm run db:generate

# Aplicar no banco
npm run db:push

# Testar conexão
npm run test-db
```

---

## 🎯 Status Atual:

✅ **Aplicação funcionando** - Modo demonstração ativo  
✅ **Login funcional** - admin@dscar.com / admin  
✅ **4 telas principais** - Todas com dados de exemplo  
✅ **Navegação** - Sistema de tabs funcionando  
✅ **Interface moderna** - Design completo

🔧 **Banco opcional** - Configure apenas se quiser dados reais

---

## 🚨 Se ainda houver erros:

1. **Pare o servidor:** Ctrl+C
2. **Limpe o cache:** `npx expo start --clear`
3. **Inicie novamente:** `npm start`

A aplicação deve funcionar perfeitamente em modo demonstração!
