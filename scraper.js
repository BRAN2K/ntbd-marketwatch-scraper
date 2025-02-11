(async function () {
  // 1. Seleciona todas as linhas da tabela de ações
  const rows = document.querySelectorAll("#marketsindex table tbody tr");
  const stockInfo = [];

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length < 3) return; // Ignora linhas sem dados completos
    // Extração de Name, Exchange e Sector
    let name = cells[0].innerText.trim();
    let exchange = cells[1].innerText.trim().toUpperCase();
    let sector = cells[2].innerText.trim().toUpperCase();

    // No primeiro <td> (Name) espera-se que haja um <a> com o link da ação
    const aElem = cells[0].querySelector("a");
    if (!aElem) return;
    const link = aElem.href;
    try {
      const urlObj = new URL(link);
      const pathParts = urlObj.pathname.split("/");
      // O ticker é o último segmento da URL
      let ticker = pathParts[pathParts.length - 1];
      const tickerAll = ticker.toUpperCase(); // Ticker em ALL CAPS
      const tickerLower = ticker.toLowerCase();
      // Extraindo o countryCode (se existir) e convertendo para minúsculas
      let country = urlObj.searchParams.get("countryCode") || "";
      country = country.toLowerCase();

      // Parâmetros fixos para o CSV de 2024
      const params =
        "startdate=01/01/2024%2000:00:00&enddate=12/31/2024%2000:00:00&daterange=d30&frequency=p1d&csvdownload=true&downloadpartial=false&newdates=false";
      const csvUrl = `https://www.marketwatch.com/investing/stock/${tickerLower}/downloaddatapartial?${params}&countrycode=${country}`;

      stockInfo.push({
        ticker: tickerAll,
        country,
        csvUrl,
        name,
        exchange,
        sector,
      });
    } catch (error) {
      console.error("Erro processando a linha:", error);
    }
  });

  console.log(`Foram encontrados dados de ${stockInfo.length} ativos.`);

  // 2. Função auxiliar para fetch do CSV
  async function fetchCsv(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Erro no fetch de ${url}: HTTP ${response.status}`);
        return null;
      }
      const text = await response.text();
      return text;
    } catch (e) {
      console.error("Erro na requisição para", url, e);
      return null;
    }
  }

  // 3. Para cada ativo, busca o CSV e insere as colunas adicionais
  let csvResults = [];
  for (let i = 0; i < stockInfo.length; i++) {
    const info = stockInfo[i];
    console.log(`Buscando CSV para ${info.ticker}: ${info.csvUrl}`);

    const csvData = await fetchCsv(info.csvUrl);
    if (csvData) {
      const lines = csvData.split("\n");
      if (lines.length < 2) {
        console.warn(`CSV com poucas linhas para ${info.ticker}`);
        continue;
      }
      // Acrescenta os campos no cabeçalho (apenas para o primeiro CSV)
      if (i === 0) {
        lines[0] = lines[0] + ",Ticker,CountryCode,Name,Exchange,Sector";
      }
      // Para cada linha (exceto o cabeçalho) adiciona os campos extras
      for (let j = 1; j < lines.length; j++) {
        if (lines[j].trim() !== "") {
          lines[j] =
            lines[j] +
            `,${info.ticker},${info.country},${info.name},${info.exchange},${info.sector}`;
        }
      }
      csvResults.push(lines.join("\n"));
    }
    // Aguarda 500 ms entre as requisições para evitar sobrecarga
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // 4. Concatena os CSVs: usa o cabeçalho do primeiro e ignora o cabeçalho dos demais
  let combinedLines = [];
  csvResults.forEach((csvText, index) => {
    const lines = csvText.split("\n").filter((line) => line.trim() !== "");
    if (index === 0) {
      combinedLines = combinedLines.concat(lines);
    } else {
      combinedLines = combinedLines.concat(lines.slice(1));
    }
  });
  const finalCsv = combinedLines.join("\n");

  // 5. Cria um Blob e aciona o download do CSV completo
  const blob = new Blob([finalCsv], { type: "text/csv;charset=utf-8;" });
  const urlBlob = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = urlBlob;
  downloadLink.download = "marketwatch_complete.csv";
  downloadLink.innerText = "Download CSV completo";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  setTimeout(() => {
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(urlBlob);
  }, 10000);

  console.log("CSV completo gerado e o download foi iniciado.");
})();
