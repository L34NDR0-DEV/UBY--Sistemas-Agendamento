# UBY Sistemas - Gestão de Agendamentos

![UBY Logo](assets/logo.png)

## 📋 Descrição do Sistema

O **UBY Sistemas** é uma aplicação desktop profissional desenvolvida em Electron para gestão inteligente de agendamentos, especialmente projetada para Windows 10 e 11. O sistema oferece uma interface moderna e intuitiva para gerenciar compromissos, clientes e recursos de forma eficiente.

## 🚀 Características Principais

- **Interface Moderna**: Design responsivo com tema claro/escuro
- **Multiplataforma**: Compatível com Windows 10 e 11
- **Tempo Real**: Sincronização via WebSocket
- **Notificações Inteligentes**: Sistema completo de alertas visuais e sonoros
- **Busca Avançada**: Localização rápida de agendamentos
- **Backup Automático**: Proteção de dados integrada
- **Sistema de Usuários**: Controle de acesso e permissões

## 📁 Estrutura do Projeto

```
UBY - Sistemas/
├── app/
│   └── main.js                 # Processo principal do Electron
├── src/
│   ├── scripts/                # Scripts JavaScript do sistema
│   ├── styles/                 # Arquivos CSS
│   ├── views/                  # Páginas HTML
│   ├── server/                 # Configurações do servidor
│   └── utils/                  # Utilitários
├── assets/                     # Recursos (imagens, sons, ícones)
├── data/                       # Dados da aplicação
└── package.json               # Configurações do projeto
```

## 🔧 Funcionalidades Detalhadas

### 1. Sistema de Autenticação (`src/scripts/login.js`)

**Funcionalidades:**
- Login seguro com validação de credenciais
- Opção "Lembrar de mim"
- Controle de sessão
- Validação de usuários do sistema Windows

**Funções principais:**
- `validateCredentials()`: Valida usuário e senha
- `rememberUser()`: Salva credenciais para login automático
- `checkSession()`: Verifica sessão ativa

### 2. Gerenciamento de Agendamentos (`src/scripts/main.js`)

**Funcionalidades:**
- Criação, edição e exclusão de agendamentos
- Visualização em lista e calendário
- Status de agendamentos (Agendado, Em Andamento, Concluído, Cancelado)
- Filtros por data, cliente e status
- Busca por nome de cliente ou atendente

**Funções principais:**
- `createAgendamento()`: Cria novo agendamento
- `editAgendamento()`: Edita agendamento existente
- `deleteAgendamento()`: Remove agendamento
- `updateStatus()`: Atualiza status do agendamento
- `loadAgendamentos()`: Carrega lista de agendamentos
- `filterAgendamentos()`: Aplica filtros na lista
- `searchAgendamentos()`: Busca por termos específicos

### 3. Sistema de Notificações (`src/scripts/notifications.js`)

**Funcionalidades:**
- Notificações em tempo real
- Alertas para agendamentos próximos
- Notificações de agendamentos atrasados
- Sistema de badges com contadores
- Histórico de notificações

**Funções principais:**
- `createNotification()`: Cria nova notificação
- `showNotification()`: Exibe notificação na tela
- `markAsRead()`: Marca notificação como lida
- `clearAllNotifications()`: Limpa todas as notificações
- `checkUpcomingAppointments()`: Verifica agendamentos próximos
- `checkOverdueAppointments()`: Verifica agendamentos atrasados

### 4. Comunicação em Tempo Real (`src/scripts/websocket-client.js`)

**Funcionalidades:**
- Conexão WebSocket para sincronização
- Compartilhamento de agendamentos entre usuários
- Notificações em tempo real
- Sistema de reconexão automática
- Autenticação de usuários

**Funções principais:**
- `connect()`: Estabelece conexão WebSocket
- `authenticate()`: Autentica usuário na conexão
- `sendAgendamentoUpdate()`: Envia atualizações de agendamento
- `shareAgendamento()`: Compartilha agendamento com outros usuários
- `handleAgendamentoUpdate()`: Processa atualizações recebidas
- `requestSync()`: Solicita sincronização de dados

### 5. Gerenciamento de Som (`src/scripts/sound-manager.js`)

**Funcionalidades:**
- Reprodução de alertas sonoros
- Controle de volume
- Diferentes tipos de sons (alerta, sucesso, erro)
- Configurações de áudio personalizáveis

**Funções principais:**
- `playSound()`: Reproduz som específico
- `playAlert()`: Toca alerta
- `playNotification()`: Toca som de notificação
- `setVolume()`: Ajusta volume
- `enable()/disable()`: Liga/desliga sons

### 6. Sistema de Voz (TTS) (`src/scripts/voice-manager.js`)

**Funcionalidades:**
- Síntese de fala (Text-to-Speech)
- Notificações por voz
- Suporte a português brasileiro
- Controle de velocidade e tom
- Fila de reprodução para evitar sobreposição

**Funções principais:**
- `speak()`: Converte texto em fala
- `speakAgendamentoCriado()`: Anuncia criação de agendamento
- `speakAgendamentoProximo()`: Anuncia agendamento próximo
- `speakAgendamentoAtrasado()`: Anuncia agendamento atrasado
- `setEnabled()`: Liga/desliga sistema de voz
- `stop()`: Para reprodução atual

### 7. Autocomplete de Endereços (`src/scripts/address-autocomplete.js`)

**Funcionalidades:**
- Sugestões automáticas de endereços
- Integração com OpenStreetMap Nominatim API
- Suporte a cidades específicas
- Cache de resultados para performance

**Funções principais:**
- `searchAddresses()`: Busca endereços na API
- `formatSuggestions()`: Formata sugestões de endereço
- `selectSuggestion()`: Seleciona endereço sugerido
- `getSupportedCities()`: Lista cidades suportadas

### 8. Sistema de Busca (`src/scripts/search-system.js`)

**Funcionalidades:**
- Busca em tempo real
- Filtros por múltiplos campos
- Debounce para otimização
- Destaque de resultados

**Funções principais:**
- `search()`: Executa busca
- `applyFilters()`: Aplica filtros de busca
- `highlightResults()`: Destaca termos encontrados
- `clearSearch()`: Limpa busca atual

### 9. Modal de Compartilhamento (`src/scripts/shareModal.js`)

**Funcionalidades:**
- Compartilhamento de agendamentos entre usuários
- Seleção de destinatários
- Mensagens personalizadas
- Preview do agendamento

**Funções principais:**
- `open()`: Abre modal de compartilhamento
- `loadUsers()`: Carrega lista de usuários
- `selectUser()`: Seleciona usuário destinatário
- `confirmShare()`: Confirma compartilhamento

### 10. Integração WhatsApp (`src/scripts/whatsapp-modal.js`)

**Funcionalidades:**
- Geração de mensagens para WhatsApp
- Formatação automática de dados do agendamento
- Cópia de mensagem para área de transferência
- Preview da mensagem

**Funções principais:**
- `generateWhatsAppMessage()`: Gera mensagem formatada
- `copyMessage()`: Copia mensagem para clipboard
- `updatePreview()`: Atualiza preview da mensagem

### 11. Preferências do Usuário (`src/scripts/user-preferences.js`)

**Funcionalidades:**
- Configurações personalizadas por usuário
- Temas (claro/escuro)
- Configurações de notificação
- Persistência de preferências

**Funções principais:**
- `loadPreferences()`: Carrega preferências do usuário
- `savePreferences()`: Salva preferências
- `applyTheme()`: Aplica tema selecionado
- `applyNotificationSettings()`: Aplica configurações de notificação

### 12. Sistema de Atualizações (`src/scripts/updater.js`)

**Funcionalidades:**
- Verificação automática de atualizações
- Download e instalação de updates
- Interface de progresso
- Notificações de atualização

**Funções principais:**
- `checkForUpdates()`: Verifica atualizações disponíveis
- `downloadUpdate()`: Baixa atualização
- `installUpdate()`: Instala atualização
- `showUpdateProgress()`: Exibe progresso da atualização

## 🎨 Interface do Usuário

### Telas Principais

1. **Login** (`src/views/login.html`)
   - Autenticação de usuário
   - Opção "Lembrar de mim"
   - Design moderno com gradientes

2. **Dashboard Principal** (`src/views/main.html`)
   - Lista de agendamentos
   - Painel de notificações
   - Barra de ferramentas
   - Sidebar de navegação

### Estilos CSS

- `src/styles/main.css`: Estilos principais da aplicação
- `src/styles/login.css`: Estilos da tela de login
- `src/styles/notifications.css`: Estilos do sistema de notificações
- `src/styles/updater.css`: Estilos do sistema de atualizações
- `src/styles/icons.css`: Ícones e elementos visuais

## 🔧 Configuração e Instalação

### Pré-requisitos

- Node.js 16.0.0 ou superior
- Windows 10 ou 11
- Electron 28.0.0

### Dependências Principais

```json
{
  "electron": "^28.0.0",
  "electron-log": "^5.0.0",
  "electron-store": "^8.1.0",
  "electron-updater": "^6.0.0",
  "express": "^4.18.0",
  "socket.io": "^4.7.0",
  "sqlite3": "^5.1.0",
  "uuid": "^10.0.0"
}
```

### Scripts Disponíveis

```bash
npm start          # Inicia a aplicação
npm run build      # Constrói a aplicação
npm run build-win  # Constrói para Windows
npm run dist       # Gera distribuição
npm run pack       # Empacota aplicação
```

## 📊 Funcionalidades de Dados

### Armazenamento

- **Electron Store**: Configurações e preferências
- **SQLite**: Dados de agendamentos (futuro)
- **JSON Files**: Dados de usuários e configurações
- **LocalStorage**: Cache e dados temporários

### Backup e Sincronização

- Backup automático de dados
- Sincronização em tempo real via WebSocket
- Recuperação de dados em caso de falha

## 🔔 Sistema de Notificações

### Tipos de Notificação

1. **Agendamentos Próximos**: Alertas 15 minutos antes
2. **Agendamentos Atrasados**: Notificação de atraso
3. **Novos Agendamentos**: Confirmação de criação
4. **Atualizações**: Mudanças em agendamentos
5. **Sistema**: Atualizações da aplicação

### Canais de Notificação

- **Visual**: Toasts e badges na interface
- **Sonoro**: Alertas de áudio configuráveis
- **Voz**: Síntese de fala em português
- **Sistema**: Notificações do Windows

## 🛠️ Desenvolvimento

### Arquitetura

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Node.js com Electron
- **Comunicação**: WebSocket (Socket.IO)
- **Dados**: Electron Store + SQLite

### Padrões de Código

- Modularização em classes
- Event-driven architecture
- Async/await para operações assíncronas
- Error handling robusto

## 🔒 Segurança

- Validação de entrada de dados
- Sanitização de conteúdo
- Controle de acesso por usuário
- Criptografia de dados sensíveis
- Content Security Policy (CSP)

## 📈 Performance

- Lazy loading de componentes
- Cache inteligente
- Debounce em buscas
- Otimização de renderização
- Compressão de dados

## 🐛 Debug e Logs

- Sistema de logs detalhado
- Console de desenvolvimento
- Tratamento de erros
- Monitoramento de performance

## 📱 Responsividade

- Interface adaptável
- Suporte a diferentes resoluções
- Otimização para telas pequenas
- Controles touch-friendly

## 🌐 Internacionalização

- Suporte a português brasileiro
- Formatação de datas e horários
- Números e moedas localizados
- Síntese de voz em português

## 🔄 Atualizações

- Sistema automático de updates
- Verificação periódica
- Download em background
- Instalação sem interrupção

## 📞 Suporte

- Documentação integrada
- Sistema de feedback
- Logs de erro automáticos
- Diagnóstico de problemas

## 👥 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste thoroughly
5. Submeta um pull request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## 👨‍💻 Autor

**L34NDR0-DEV**
- GitHub: [@L34NDR0-DEV](https://github.com/L34NDR0-DEV)
- Projeto: [UBY--Sistemas-Agendamento](https://github.com/L34NDR0-DEV/UBY--Sistemas-Agendamento)

---

**UBY Sistemas** - Gestão Inteligente de Agendamentos para Windows

*Versão 1.0.3 - Desenvolvido com ❤️ para profissionais que valorizam eficiência e qualidade.*
