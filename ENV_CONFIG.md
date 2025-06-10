# Configuração de Variáveis de Ambiente

## Para configurar a aplicação DSCar:

1. **Crie um arquivo `.env` na raiz do projeto** com:

```
EXPO_PUBLIC_DATABASE_URL="postgresql://usuario:senha@host.neon.tech/banco?sslmode=require"
```

2. **Substitua pelos seus dados reais do Neon DB**:

   - Acesse https://neon.tech
   - Crie uma conta e um banco
   - Copie a connection string
   - Cole no arquivo .env

3. **Exemplo de URL do Neon**:

```
EXPO_PUBLIC_DATABASE_URL="postgresql://user123:pass456@ep-cold-cloud-123456.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

## ⚠️ IMPORTANTE:

- No Expo/React Native, use sempre `EXPO_PUBLIC_` como prefixo
- Não commite o arquivo .env no git
- Variáveis prefixadas com `EXPO_PUBLIC_` são acessíveis no código React Native

## Credenciais padrão da aplicação:

- **Email**: admin@dscar.com
- **Senha**: admin
