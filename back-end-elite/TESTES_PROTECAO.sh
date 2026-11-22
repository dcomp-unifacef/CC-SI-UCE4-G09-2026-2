#!/bin/bash
set -e
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

API=http://localhost:8888

echo "== Gerando tokens =="
TOKEN_ADMIN=$(curl -s -X POST $API/auth/login -H "Content-Type: application/json" \
  -d '{"email":"admin@efc.local","senha":"senha-admin-123"}' | node -p 'JSON.parse(require("fs").readFileSync(0,"utf8")).token')
TOKEN_ALUNO=$(curl -s -X POST $API/auth/login -H "Content-Type: application/json" \
  -d '{"email":"aluno@efc.local","senha":"senha-aluno-123"}' | node -p 'JSON.parse(require("fs").readFileSync(0,"utf8")).token')

echo "Admin: ${TOKEN_ADMIN:0:20}..."
echo "Aluno: ${TOKEN_ALUNO:0:20}..."
echo

test_rota() {
  local metodo=$1
  local rota=$2
  local sem=$(curl -s -o /dev/null -w '%{http_code}' -X "$metodo" "$API$rota")
  local alu=$(curl -s -o /dev/null -w '%{http_code}' -X "$metodo" -H "Authorization: Bearer $TOKEN_ALUNO" "$API$rota")
  local adm=$(curl -s -o /dev/null -w '%{http_code}' -X "$metodo" -H "Authorization: Bearer $TOKEN_ADMIN" "$API$rota")
  printf "%-7s %-35s sem=%s alu=%s adm=%s" "$metodo" "$rota" "$sem" "$alu" "$adm"
  
  # Validação
  if [ "$sem" != "401" ]; then echo " ❌ (esperado 401 sem token)"; return 1; fi
  if [ "$alu" != "403" ]; then echo " ❌ (esperado 403 para aluno)"; return 1; fi
  if [ "$adm" != "200" ] && [ "$adm" != "204" ]; then echo " ❌ (esperado 200/204 para admin)"; return 1; fi
  echo " ✓"
}

echo "== Rotas públicas (devem responder 200 sem token) =="
curl -s -o /dev/null -w "GET /           : %{http_code}\n" $API/
curl -s -o /dev/null -w "POST /auth/login: %{http_code} (credencial errada esperado)\n" -X POST $API/auth/login \
  -H "Content-Type: application/json" -d '{"email":"x@x.com","senha":"x"}'
echo

echo "== Cadastros básicos =="
test_rota GET /alunos
test_rota GET /professor
test_rota GET /turmas
test_rota GET /modalidades
echo

echo "== Aulas e frequência =="
test_rota GET /aulas
test_rota GET /presencas
test_rota GET /evolucoes
test_rota GET /campeonatos
test_rota GET /horarios
echo

echo "== Financeiro e notificações =="
test_rota GET /financeiro
test_rota GET /notificacoes
echo

echo "== Aulas particulares =="
test_rota GET /aulas-particulares
echo

echo "== Pessoa (auxiliar) =="
test_rota GET /pessoa
echo

echo "✅ Todos os testes passaram!"
