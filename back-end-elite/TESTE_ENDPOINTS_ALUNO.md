# Teste dos Endpoints /aluno/me

## Pré-requisitos
1. Backend rodando: `npm run dev` (porta 3001)
2. Dois alunos de teste criados com acesso (via admin)
3. Tokens JWT salvos para cada aluno

## Endpoints Implementados

### 1. GET /aluno/me
Retorna perfil do aluno autenticado
```bash
curl -H "Authorization: Bearer <TOKEN_ALUNO_1>" http://localhost:3001/aluno/me
```

### 2. GET /aluno/me/frequencia
Retorna presenças do aluno autenticado
```bash
curl -H "Authorization: Bearer <TOKEN_ALUNO_1>" http://localhost:3001/aluno/me/frequencia
```

### 3. GET /aluno/me/aulas (NOVO)
Retorna próximas aulas das modalidades do aluno
```bash
curl -H "Authorization: Bearer <TOKEN_ALUNO_1>" http://localhost:3001/aluno/me/aulas
```

### 4. GET /aluno/me/financeiro (NOVO)
Retorna registros financeiros do aluno
```bash
curl -H "Authorization: Bearer <TOKEN_ALUNO_1>" http://localhost:3001/aluno/me/financeiro
```

## Teste de Isolamento

### Criar dois alunos com dados diferentes:
1. Admin cria Aluno A com modalidade "Muay Thai"
2. Admin cria Aluno B com modalidade "Jiu-Jitsu"
3. Admin cria aulas para "Muay Thai" (deve aparecer só para A)
4. Admin cria aulas para "Jiu-Jitsu" (deve aparecer só para B)
5. Admin registra presença para Aluno A
6. Admin cria financeiro para Aluno A

### Validar isolamento:
```bash
# Aluno A deve ver:
# - Suas próprias aulas de Muay Thai
# - Sua própria frequência
# - Seu próprio financeiro

# Aluno B deve ver:
# - Suas próprias aulas de Jiu-Jitsu
# - Lista vazia de frequência
# - Lista vazia de financeiro

# Tentar acessar com token trocado (deve falhar):
curl -H "Authorization: Bearer <TOKEN_ALUNO_B>" http://localhost:3001/aluno/me/frequencia
# Deve retornar [] (lista vazia), não os dados do Aluno A
```

## Critérios de Sucesso
- ✅ Cada aluno vê apenas seus próprios dados
- ✅ Dados persistem após reload da página
- ✅ Dados criados pelo admin aparecem para o aluno correto
- ✅ Nenhum dado é compartilhado entre alunos
