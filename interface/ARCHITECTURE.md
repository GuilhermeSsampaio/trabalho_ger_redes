# Arquitetura dos Componentes Frontend

## Estrutura Refatorada

A aplicação foi refatorada seguindo as melhores práticas de React, separando responsabilidades em componentes menores e reutilizáveis.

### Componentes Principais

#### `App.jsx`

- **Responsabilidade**: Componente raiz da aplicação
- **Características**: Minimalista, apenas estrutura principal
- **Gerencia**: Comunicação entre navbar e seção de download via eventos customizados

#### `DownloadSection.jsx`

- **Responsabilidade**: Container principal para funcionalidades de download
- **Características**: Gerencia estado através do hook customizado
- **Renderiza**: Controles, seções de pesquisa/URLs, lista de vídeos, loading e alertas

### Componentes de UI

#### `DownloadControls.jsx`

- **Responsabilidade**: Controles de tipo de download e modo (pesquisa/URLs)
- **Props**: `activeTab`, `setActiveTab`, `downloadType`, `setDownloadType`

#### `SearchSection.jsx`

- **Responsabilidade**: Interface de pesquisa do YouTube e exibição de resultados
- **Props**: Callbacks para busca, adição de vídeos e estado de loading
- **Características**: Inclui formatação de duração e cards de vídeo

#### `URLsSection.jsx`

- **Responsabilidade**: Interface para inserção manual de URLs
- **Props**: Estado das URLs e callback para download
- **Características**: Textarea para múltiplas URLs

#### `VideoList.jsx`

- **Responsabilidade**: Lista de vídeos selecionados e botão de download em lote
- **Props**: Lista de vídeos, função de remoção e callback de download

#### `LoadingOverlay.jsx`

- **Responsabilidade**: Modal de loading durante downloads
- **Props**: Estado de loading e mensagem de status
- **Características**: Spinner animado e backdrop

#### `StatusAlert.jsx`

- **Responsabilidade**: Alertas de status após operações
- **Props**: Estado de loading e mensagem de status

### Hook Customizado

#### `useDownloadManager.js`

- **Responsabilidade**: Gerenciamento de estado e lógica de negócio
- **Características**:
  - Estados centralizados
  - Funções memoizadas com `useCallback`
  - Escuta eventos da navbar
  - Integração com API
- **Retorna**: Estados e funções para componentes

### Configuração

#### `config/constants.js`

- **Responsabilidade**: Constantes da aplicação
- **Inclui**:
  - URLs da API
  - Configurações de UI
  - Mensagens padronizadas
  - Endpoints

## Benefícios da Refatoração

### 1. **Separação de Responsabilidades**

- Cada componente tem uma única responsabilidade
- Facilita manutenção e testes
- Melhora legibilidade do código

### 2. **Reutilização**

- Componentes podem ser reutilizados em outros contextos
- Props bem definidas facilitam uso
- Menos código duplicado

### 3. **Manutenibilidade**

- Mudanças em uma funcionalidade afetam apenas um componente
- Debugging mais fácil
- Código mais organizado

### 4. **Performance**

- Hooks memoizados evitam re-renders desnecessários
- Componentes menores renderizam mais rápido
- Estado local quando apropriado

### 5. **Testabilidade**

- Componentes isolados são mais fáceis de testar
- Props bem definidas facilitam mocking
- Lógica de negócio separada da UI

## Fluxo de Dados

```
App.jsx
  └── Navbar (emite evento 'navbarSearch')
  └── DownloadSection
      ├── useDownloadManager (escuta 'navbarSearch')
      ├── DownloadControls
      ├── SearchSection (se activeTab === 'search')
      │   └── Cards de vídeo
      ├── VideoList (se activeTab === 'search')
      ├── URLsSection (se activeTab === 'urls')
      ├── LoadingOverlay
      └── StatusAlert
```

## Comunicação Entre Componentes

### 1. **Props Down**

- Estados e callbacks passados como props
- Unidirecional e previsível

### 2. **Eventos Customizados**

- Navbar comunica com DownloadSection via eventos
- Desacoplamento entre componentes distantes

### 3. **Hook Customizado**

- Centraliza estado e lógica
- Reutilizável entre componentes
