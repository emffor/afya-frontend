# Afya Frontend

## Sobre o Projeto

O Afya Frontend é um sistema de gerenciamento que oferece uma interface intuitiva para controle de produtos, categorias e pedidos. Desenvolvido com React e Material-UI, o sistema apresenta um dashboard interativo com métricas importantes do negócio.

## Funcionalidades Principais

- **Dashboard**
  - Visualização de métricas (Total de Pedidos, Receita Total, Valor Médio por Pedido)
  - Gráficos interativos para análise de dados
  - Navegação rápida para outras seções

- **Produtos**
  - Listagem de produtos
  - Cadastro, edição e remoção de produtos
  - Associação com categorias

- **Categorias**
  - Gerenciamento de categorias de produtos
  - Operações CRUD completas
  - Interface intuitiva

- **Pedidos**
  - Controle de pedidos
  - Seleção múltipla de produtos
  - Cálculo automático de totais

## Tecnologias Utilizadas

- React 19
- TypeScript
- Material-UI v6
- Chart.js
- React Router DOM v7
- Axios

## Pré-requisitos

- Node.js
- Yarn ou npm

## Instalação

```bash
# Clone o repositório
git clone https://github.com/emffor/afya-frontend.git

# Entre no diretório
cd afya-frontend

# Instale as dependências
yarn install

# Inicie o projeto
yarn start
```

## Estrutura do Projeto

```
src/
  ├── pages/
  │   ├── DashboardPage.tsx
  │   ├── ProductsPage.tsx
  │   ├── CategoriesPage.tsx
  │   └── OrdersPage.tsx
  ├── types/
  │   ├── Product.ts
  │   ├── Category.ts
  │   └── Order.ts
  ├── services/
  │   └── api.ts
  └── App.tsx
```
