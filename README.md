# Marketwatch Scraper - Novas Tecnologias em Banco de Dados (NTBD)

A escolha de desenvolver essa versão final do scraper como um script JavaScript injetado diretamente no console do navegador se deve única e exclusivamente às robustas restrições anti-scraping implementadas pelo Marketwatch. Em especial, o site utiliza soluções como o DataDome – um mecanismo de proteção que dificulta métodos tradicionais de extração via bibliotecas Python (como requests, BeautifulSoup, Selenium ou CloudScraper). Essas proteções bloqueiam ou forçam erros (como o HTTP 401) quando tentamos acessar os dados fora do ambiente renderizado de um navegador real.

A solução apresentada funciona porque é executada diretamente no navegador, que já passou pelo processo de verificação do DataDome e demais mecanismos anti-scraping. Dessa forma, o script tem acesso ao DOM já renderizado, com todos os dados e interações processadas, permitindo extrair os links, informações (como Name, Exchange e Sector) e montar as URLs corretas para download dos dados históricos em CSV.

### Como Fazer a Solução Rodar

1. **Acessar a Página de Interesse:**  
   Abra o navegador e vá para a página de um país no Marketwatch, por exemplo:  
   https://www.marketwatch.com/tools/markets/stocks/country/brazil

2. **Abrir o Console do Navegador:**  
   Pressione as teclas (F12 ou Ctrl+Shift+I) para abrir as Ferramentas de Desenvolvedor. Navegue até a aba “Console”.

3. **Injetar o Código:**  
   Copie e cole o script completo que será apresentado abaixo no console e pressione Enter. O script vai ler os dados da página, montar as URLs para baixar os CSVs dos dados históricos de 2024 para cada ação e ainda extrair informações adicionais (Name, Exchange, Sector, Ticker e CountryCode).

4. **Download do CSV Completo:**  
   Ao final da execução, um link para download será automaticamente criado e acionado, permitindo que você baixe um arquivo CSV completo com todos os dados extraídos.

### Visão Geral de Como o Script Funciona (em Termos Simples)

- **Captura dos Dados Existentes:**  
  O script começa selecionando todas as linhas da tabela que contêm os dados dos ativos usando um seletor específico (`#marketsindex table tbody tr`). Cada linha contém informações como o Nome da ação, a Exchange e o Setor.

- **Extração dos Detalhes:**  
  De cada linha, o script extrai:  
  • O link que leva à página da ação (usado para pegar o ticker e o country code).  
  • As informações de Name, Exchange e Sector.  
  Importante: Os campos Ticker, Exchange e Sector são convertidos para todas as letras maiúsculas (ALL CAPS), conforme solicitado.

- **Montagem das URLs para Download:**  
  Usando o ticker, o country code e parâmetros fixos (para o período de 2024), o script cria uma URL específica para baixar os dados históricos (CSV) de cada ação.

- **Recolhimento dos Dados CSV:**  
  Para cada ação, o script utiliza a função `fetch` para solicitar o CSV a partir da URL montada. O conteúdo CSV de cada ação é capturado e, em cada linha (exceto o cabeçalho), são acrescentadas as colunas com os dados extraídos (Ticker, CountryCode, Name, Exchange, Sector).

- **Junção e Geração do Arquivo Final:**  
  Todos os CSVs são então concatenados – mantendo o cabeçalho apenas do primeiro CSV – formando um arquivo único. Esse arquivo é preparado como um "Blob" (um objeto de dados) e um link de download é criado e automaticamente acionado.

---

### Resumo Final

Devido às rigorosas restrições anti-scraping impostas pelo Marketwatch (incluindo a proteção DataDome), não conseguimos utilizar abordagens com bibliotecas Python para coletar os dados. Em vez disso, a solução foi implementada como um script JavaScript injetado no console do navegador. Essa abordagem aproveita o ambiente já autenticado do navegador, permitindo extrair as informações diretamente da página renderizada e gerar um CSV completo – com as colunas adicionais de Ticker, CountryCode, Name, Exchange e Sector – de forma simples e eficaz. Essa é a razão pela qual o scraper foi montado dessa maneira e como ele pode ser facilmente utilizado mesmo por alguém com conhecimentos leigos.
