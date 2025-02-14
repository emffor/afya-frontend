# Afya Frontend

Sistema de gerenciamento de produtos, categorias e pedidos com dashboard de KPIs desenvolvido com React, Material UI e TypeScript.

## 🎥 Demo da Aplicação

https://github.com/seu-usuario/afya-frontend/assets/video.gif

[![Assista ao vídeo da demonstração](https://img.youtube.com/vi/nCvctiUvKr8/maxresdefault.jpg)](https://youtu.be/nCvctiUvKr8)

### Dashboard
- Visualização de KPIs principais:
  - Total de pedidos
  - Receita total
  - Valor médio dos pedidos
- Gráfico de pedidos por período (diário/semanal/mensal)
- Navegação rápida para outros módulos

### Produtos
- Listagem em tabela com paginação
- Criação, edição e exclusão de produtos
- Upload de imagens dos produtos
- Associação com categorias

### Categorias
- Gerenciamento completo (CRUD)
- Listagem em tabela
- Formulário para criar/editar

### Pedidos
- Visualização de todos os pedidos
- Criação de novos pedidos
- Seleção múltipla de produtos
- Cálculo automático do total

## 🛠️ Tecnologias

- React 19
- TypeScript 4
- Material UI 6
- Chart.js 4 
- React Router Dom 7
- Axios
- Storybook 8

## 📋 Pré-requisitos

- Node.js 20+
- Yarn
- Docker e Docker Compose (opcional)

## ⚙️ Instalação

### Desenvolvimento local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/afya-frontend.git

# Entre na pasta
cd afya-frontend

# Instale as dependências
yarn install

# Inicie o servidor de desenvolvimento
yarn start
```

### Docker

```bash
# Build e execução com Docker Compose
docker-compose up -d

# Para parar os containers
docker-compose down
```

## 🔧 Configuração

Configure as variáveis de ambiente criando um arquivo `.env`:

## 📦 Estrutura do Projeto

```
src/
  ├── components/      # Componentes reutilizáveis
  ├── pages/          # Páginas da aplicação
  ├── services/       # Serviços e APIs
  ├── types/          # Tipos TypeScript
  └── App.tsx         # Componente principal
```

## 🎨 Storybook

O projeto utiliza Storybook para documentação de componentes:

```bash
# Iniciar Storybook
yarn storybook

# Build da documentação
yarn build-storybook
```

## 📱 Uso da Aplicação

1. **Dashboard**
   - Acesse a página inicial para ver os KPIs
   - Use o seletor de período para filtrar dados do gráfico

2. **Produtos**
   - Clique em "Add Product" para criar novo
   - Use o botão de upload para adicionar imagens
   - Edite ou exclua produtos existentes

3. **Categorias**
   - Gerencie categorias de produtos
   - Associe produtos às categorias
   - Edite ou exclua categorias existentes

4. **Pedidos**
   - Crie novos pedidos selecionando produtos
   - Visualize histórico de pedidos
   - Edite ou exclua pedidos existentes

## 🔨 Scripts Disponíveis
- `yarn start`: Inicia servidor de desenvolvimento
- `yarn build`: Gera build de produção
- `yarn storybook`: Inicia documentação Storybook
