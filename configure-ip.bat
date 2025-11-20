@echo off
echo === Configurador IPv6 para YouTube Downloader ===
echo.

if "%1"=="ipv6" goto :enable_ipv6
if "%1"=="ipv4" goto :enable_ipv4
if "%1"=="test" goto :test_connectivity
if "%1"=="status" goto :show_status
goto :help

:enable_ipv6
echo Configurando para IPv6...

cd interface
powershell -Command "(Get-Content .env) -replace 'VITE_USE_IPV6=false', 'VITE_USE_IPV6=true' | Set-Content .env"
echo ✓ Configuração IPv6 ativada no .env

cd ..

echo Parando containers existentes...
docker-compose down >nul 2>&1
docker-compose -f Docker-compose-ipv6.yaml down >nul 2>&1
docker-compose -f Docker-compose-ipv6-hybrid.yaml down >nul 2>&1

echo Iniciando containers com IPv6 Híbrido (otimizado)...
docker-compose -f Docker-compose-ipv6-hybrid.yaml up --build -d

echo.
echo === IPv6 HÍBRIDO ATIVADO ===
echo Configuração: IPv6 interno + IPv4 para YouTube (otimizado)
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8000
echo Containers IPv6: 2001:db8:1::10 (backend) e 2001:db8:1::20 (frontend)
goto :end

:enable_ipv4
echo Configurando para IPv4...

cd interface
powershell -Command "(Get-Content .env) -replace 'VITE_USE_IPV6=true', 'VITE_USE_IPV6=false' | Set-Content .env"
echo ✓ Configuração IPv4 ativada no .env

cd ..

echo Parando containers existentes...
docker-compose down >nul 2>&1
docker-compose -f Docker-compose-ipv6.yaml down >nul 2>&1
docker-compose -f Docker-compose-ipv6-hybrid.yaml down >nul 2>&1

echo Iniciando containers com IPv4...
docker-compose up --build -d

echo.
echo === IPv4 ATIVADO ===
echo Backend IPv4: http://localhost:8000
echo Frontend: http://localhost:5173
echo WebSocket IPv4: ws://localhost:8000/ws
goto :end

:test_connectivity
echo Testando conectividade...
echo.

echo Testando Backend IPv4:
curl -s "http://localhost:8000/health" >nul 2>&1 && echo ✓ IPv4 OK || echo ✗ IPv4 FALHOU

echo Testando Backend IPv6:
curl -s -6 "http://[2001:db8:1::10]:8000/health" >nul 2>&1 && echo ✓ IPv6 OK || echo ✗ IPv6 FALHOU

echo.
echo Verificando containers:
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
goto :end

:show_status
echo === STATUS ATUAL DO SISTEMA ===
echo.

echo Containers ativos:
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>nul || echo Nenhum container ativo

echo.
echo Configuração .env atual:
cd interface
type .env | findstr VITE_USE_IPV6 2>nul || echo VITE_USE_IPV6 não configurado
cd ..

echo.
echo Redes Docker IPv6:
docker network ls | findstr ger_redes 2>nul || echo Nenhuma rede ativa

echo.
echo Endereços IPv6 (se ativo):
docker network inspect ger_redes_yt_dowloader_app_network 2>nul | findstr IPv6Address || echo IPv6 não ativo

echo.
echo Acesso:
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8000/health
goto :end

:help
echo Uso: %0 {ipv6^|ipv4^|test^|status}
echo.
echo Comandos:
echo   ipv6    - Configurar e iniciar com IPv6 Híbrido (recomendado)
echo   ipv4    - Configurar e iniciar com IPv4 (padrão)
echo   test    - Testar conectividade de ambos
echo   status  - Mostrar status atual do sistema
echo.
echo Exemplos:
echo   %0 ipv6      # Ativa IPv6 híbrido (rápido)
echo   %0 ipv4      # Volta para IPv4 padrão
echo   %0 test      # Testa conectividade
echo   %0 status    # Ver status atual

:end