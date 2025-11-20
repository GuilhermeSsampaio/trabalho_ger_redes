#!/bin/bash

echo "=== Configurador IPv6 para YouTube Downloader ==="
echo ""

# Função para ativar IPv6
enable_ipv6() {
    echo "Configurando para IPv6..."
    
    # Atualizar .env para IPv6
    cd interface
    sed -i 's/VITE_USE_IPV6=false/VITE_USE_IPV6=true/' .env
    echo "✓ Configuração IPv6 ativada no .env"
    
    cd ..
    
    # Parar containers se estiverem rodando
    echo "Parando containers existentes..."
    docker-compose down 2>/dev/null || true
    docker-compose -f Docker-compose-ipv6.yaml down 2>/dev/null || true
    
    # Iniciar com IPv6
    echo "Iniciando containers com IPv6..."
    docker-compose -f Docker-compose-ipv6.yaml up --build -d
    
    echo ""
    echo "=== IPv6 ATIVADO ==="
    echo "Backend IPv6: http://[2001:db8:1::10]:8000"
    echo "Frontend: http://localhost:5173"
    echo "WebSocket IPv6: ws://[2001:db8:1::10]:8000/ws"
}

# Função para ativar IPv4
enable_ipv4() {
    echo "Configurando para IPv4..."
    
    # Atualizar .env para IPv4
    cd interface
    sed -i 's/VITE_USE_IPV6=true/VITE_USE_IPV6=false/' .env
    echo "✓ Configuração IPv4 ativada no .env"
    
    cd ..
    
    # Parar containers se estiverem rodando
    echo "Parando containers existentes..."
    docker-compose down 2>/dev/null || true
    docker-compose -f Docker-compose-ipv6.yaml down 2>/dev/null || true
    
    # Iniciar com IPv4
    echo "Iniciando containers com IPv4..."
    docker-compose up --build -d
    
    echo ""
    echo "=== IPv4 ATIVADO ==="
    echo "Backend IPv4: http://localhost:8000"
    echo "Frontend: http://localhost:5173"
    echo "WebSocket IPv4: ws://localhost:8000/ws"
}

# Função para testar conectividade
test_connectivity() {
    echo "Testando conectividade..."
    echo ""
    
    echo "Testando Backend IPv4:"
    curl -s "http://localhost:8000/health" && echo "✓ IPv4 OK" || echo "✗ IPv4 FALHOU"
    
    echo "Testando Backend IPv6:"
    curl -s -6 "http://[2001:db8:1::10]:8000/health" 2>/dev/null && echo "✓ IPv6 OK" || echo "✗ IPv6 FALHOU"
    
    echo ""
    echo "Verificando containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# Menu principal
case "$1" in
    "ipv6")
        enable_ipv6
        ;;
    "ipv4")
        enable_ipv4
        ;;
    "test")
        test_connectivity
        ;;
    *)
        echo "Uso: $0 {ipv6|ipv4|test}"
        echo ""
        echo "Comandos:"
        echo "  ipv6  - Configurar e iniciar com IPv6"
        echo "  ipv4  - Configurar e iniciar com IPv4 (padrão)"
        echo "  test  - Testar conectividade de ambos"
        echo ""
        echo "Exemplos:"
        echo "  $0 ipv6    # Ativa IPv6"
        echo "  $0 ipv4    # Volta para IPv4"
        echo "  $0 test    # Testa ambos"
        exit 1
        ;;
esac