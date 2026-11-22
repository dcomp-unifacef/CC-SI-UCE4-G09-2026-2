#!/bin/bash
# Script de testes para os endpoints /aluno/me

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuração
API_BASE="http://localhost:3001"

echo -e "${YELLOW}=== Testes dos Endpoints /aluno/me ===${NC}\n"

# Verificar se tem token
if [ -z "$TOKEN_ALUNO" ]; then
  echo -e "${RED}❌ Variável TOKEN_ALUNO não definida${NC}"
  echo "Execute primeiro:"
  echo "  export TOKEN_ALUNO='seu_token_jwt_aqui'"
  exit 1
fi

echo -e "${GREEN}✓ Token encontrado${NC}\n"

# Teste 1: Obter Perfil
echo -e "${YELLOW}1. GET /aluno/me (Perfil)${NC}"
curl -s -H "Authorization: Bearer $TOKEN_ALUNO" \
  "$API_BASE/aluno/me" | jq '.' || echo -e "${RED}Erro${NC}"
echo ""

# Teste 2: Obter Frequência
echo -e "${YELLOW}2. GET /aluno/me/frequencia${NC}"
curl -s -H "Authorization: Bearer $TOKEN_ALUNO" \
  "$API_BASE/aluno/me/frequencia" | jq '.' || echo -e "${RED}Erro${NC}"
echo ""

# Teste 3: Obter Aulas (NOVO)
echo -e "${YELLOW}3. GET /aluno/me/aulas (NOVO)${NC}"
curl -s -H "Authorization: Bearer $TOKEN_ALUNO" \
  "$API_BASE/aluno/me/aulas" | jq '.' || echo -e "${RED}Erro${NC}"
echo ""

# Teste 4: Obter Financeiro (NOVO)
echo -e "${YELLOW}4. GET /aluno/me/financeiro (NOVO)${NC}"
curl -s -H "Authorization: Bearer $TOKEN_ALUNO" \
  "$API_BASE/aluno/me/financeiro" | jq '.' || echo -e "${RED}Erro${NC}"
echo ""

echo -e "${GREEN}✅ Testes concluídos${NC}"
echo ""
echo -e "${YELLOW}Para testar isolamento, execute com dois tokens diferentes:${NC}"
echo "  export TOKEN_ALUNO='token_aluno_1'"
echo "  ./TESTES_CURL_INICIO.sh > aluno1.json"
echo ""
echo "  export TOKEN_ALUNO='token_aluno_2'"
echo "  ./TESTES_CURL_INICIO.sh > aluno2.json"
echo ""
echo "  # Comparar resultados (devem ser diferentes)"
echo "  diff aluno1.json aluno2.json"
