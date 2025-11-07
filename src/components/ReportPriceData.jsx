import { useEffect, useState } from "react";

import "/src/css/report-price.css";
import { pdf, PDFDownloadLink, usePDF } from "@react-pdf/renderer";
import ReportPricePDF from "./ReportPricePDF";
import LoadingData from "./LoadingData";

function formatarReais(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function ReportPriceData(props) {
  // 1. USE O ESTADO para armazenar os itens da tabela
  const [items, setItems] = useState([]); // 'items' substitui 'dataArray'

  const { data, supplyUnit } = props; // Boa prática: desestruturar props

  const [loading, isLoading] = useState(false);

  // 2. USE EFFECT para popular o estado quando as props mudarem
  useEffect(() => {
    // Evita erros se 'data' ou 'data.resultado' não existirem
    if (!data || !data.resultado) {
      setItems([]); // Garante que o estado seja um array vazio
      return;
    }

    if (supplyUnit === null || supplyUnit === "") {
      setItems(data.resultado);
    } else {
      const splittedStringSupplyUnit = supplyUnit
        .split(" ")
        .map((item) => item.toUpperCase());

      const filteredArrayByUnit = data.resultado.filter((item) => {
        // console.log(item); // Descomente se precisar depurar
        /**Filtrar item pela unidade */
        console.log(splittedStringSupplyUnit);
        if (
          item.nomeUnidadeFornecimento === splittedStringSupplyUnit[0] ||
          item.nomeUnidadeMedida === splittedStringSupplyUnit[0]
        ) {
          return true;
        } else {
          return false;
        }
      });

      // Atualiza o estado com os dados filtrados
      setItems(filteredArrayByUnit);
    }
  }, [data, supplyUnit]); // Dependências: re-executa se 'data' ou 'supplyUnit' mudar

  // 3. 'removeItem' deve ATUALIZAR O ESTADO
  const removeItem = (idItemCompra) => {
    // Filtra baseado no estado ATUAL ('items')
    const newArrayItems = items.filter(
      (item) => item.idItemCompra !== idItemCompra
    );

    // ATUALIZA O ESTADO, o que força a re-renderização
    setItems(newArrayItems);
  };

  // --- Cálculo de média, mediana e moda ---
  // (Suas funções de cálculo estão corretas)
  const media = (numeros) => {
    if (numeros.length === 0) return 0;
    const soma = numeros.reduce((acc, val) => acc + val, 0);
    return soma / numeros.length;
  };

  const mediana = (numeros) => {
    if (numeros.length === 0) return 0;
    const precosOrdenados = [...numeros].sort((a, b) => a - b);
    const meio = Math.floor(precosOrdenados.length / 2);
    if (precosOrdenados.length % 2 === 0) {
      return (precosOrdenados[meio - 1] + precosOrdenados[meio]) / 2;
    } else {
      return precosOrdenados[meio];
    }
  };

  const menorValor = (numeros) => {
    return Math.min.apply(Math, numeros);
  };

  const maiorValor = (numeros) => {
    return Math.max.apply(Math, numeros);
  };

  // 4. Use o ESTADO 'items' para os cálculos
  const precos = items.map((item) => item.precoUnitario);

  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const downloadPDF = () => {
    isLoading(true);
    setTimeout(async () => {
      try {
        const blob = await pdf(
          <ReportPricePDF
            items={items}
            precos={precos}
            media={media(precos)}
            mediana={mediana(precos)}
            menor={menorValor(precos)}
            maior={maiorValor(precos)}
          />
        ).toBlob();

        if (blob != null) {
          isLoading(false);
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        //link.download = items[0].descricaoItem + ".pdf";
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Erro ao gerar PDF:", error);
      }
    }, 0);
  };

  if (loading) {
    return <LoadingData />;
  }

  return (
    <>
      <div className="download-pdf" id="download-pdf" onClick={downloadPDF}>
        <img
          src="/images/pdf-icon.png"
          title="Fazer download do relatório"
        ></img>
        Baixar PDF
      </div>
      <div className="report-container">
        <div className="report-presentation">
          <h1>Pesquisa de preço</h1>
          <p>Acesse o relatório de preços abaixo</p>
        </div>
        <div className="stats">
          <div className="stats-card">
            <b>Média</b>
            {formatarReais(media(precos))}
          </div>
          <div className="stats-card">
            <b>Mediana</b>
            {formatarReais(mediana(precos))}
          </div>
          <div className="stats-card">
            <b>Menor</b>
            {menorValor(precos) > 0
              ? formatarReais(menorValor(precos))
              : "Sem dados"}
          </div>
          <div className="stats-card">
            <b>Maior</b>
            {maiorValor(precos) > 0
              ? formatarReais(maiorValor(precos))
              : "Sem dados"}
          </div>
        </div>
        <div className="" id="info">
          <p>
            Consulta realizada em <strong>{dataFormatada}</strong> • Fonte:{" "}
            <strong>API de Dados Abertos do SIASG</strong>
          </p>
          <p>
            Total de registros: <b>{items.length}</b>
          </p>
        </div>
        <div className="table-report-price-data">
          {/*dataArray.map((item) => (
          <>
            <p>{item.idCompra}</p>
          </>
        ))*/}
          <table>
            <thead>
              <tr>
                <th>Órgão</th>
                <th>Municipio/Estado</th>
                <th>Fornecedor</th>
                <th>Descrição do Item</th>
                <th>Unidade de Fornecimento</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items &&
                items.map((item, index) => (
                  <tr key={index}>
                    {/* Coluna 1: CÓDIGO */}
                    <td>{item.nomeOrgao}</td>

                    {/* Coluna 2: DESCRIÇÃO */}
                    <td>
                      {item.municipio} - {item.estado}
                    </td>

                    <td>{item.nomeFornecedor}</td>
                    <td>{item.descricaoItem}</td>
                    <td>
                      {item.nomeUnidadeFornecimento != null ||
                      item.nomeUnidadeFornecimento != ""
                        ? item.nomeUnidadeFornecimento
                        : ""}{" "}
                      {item.capacidadeUnidadeFornecimento > 0
                        ? item.capacidadeUnidadeFornecimento
                        : ""}{" "}
                      {item.siglaUnidadeMedida != "" ||
                      item.siglaUnidadeMedida != null
                        ? item.siglaUnidadeMedida
                        : item.nomeUnidadeMedida}
                    </td>
                    <td>{item.quantidade}</td>
                    <td>{formatarReais(item.precoUnitario)}</td>
                    <td>
                      <input
                        className="remove-item"
                        type="submit"
                        value="Remover"
                        onClick={(e) => removeItem(item.idItemCompra)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <br />
        </div>
      </div>
      <br />
    </>
  );
}

export default ReportPriceData;
