import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// --- DEFINIÇÃO DOS ESTILOS (TRADUÇÃO DO SEU CSS) ---
// Você precisa traduzir seu .css para este formato de objeto JavaScript.
// Nota: Não há 'className', 'id', '<table>', '<th>', etc.
const styles = StyleSheet.create({
  logo: {
    width: 165,
    height: 50,
  },
  page: {
    fontFamily: "Helvetica", // Fontes padrão
    fontSize: 10,
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 30,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    border: "1px solid #eee",
    padding: 10,
  },
  statsCard: {
    textAlign: "center",
  },
  statsLabel: {
    fontSize: 10,
    color: "#333",
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 9,
    color: "grey",
    marginBottom: 15,
  },
  // --- ESTILOS DA TABELA ---
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "12.5%", // 8 colunas, 100 / 8 = 12.5%
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 5,
    fontWeight: "bold",
  },
  tableCol: {
    width: "12.5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCell: {
    fontSize: 9,
  },
});

// Funções utilitárias (podem ser importadas)
const formatarReais = (valor) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const hoje = new Date();
const dataFormatada = hoje.toLocaleDateString("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});
// (Coloque suas funções media, mediana, menorValor, maiorValor aqui)

// --- O COMPONENTE PDF ---
// Ele recebe os MESMOS DADOS (items, precos, dataFormatada) como props
const ReportPricePDF = ({ items, precos, media, mediana, menor, maior }) => (
  <Document>
    <Page size="A4" style={styles.page} orientation="landscape">
      <Image style={styles.logo} src="/images/logo-pbps.png" />
      {/* Cabeçalho */}
      <Text style={styles.header}>Pesquisa de preço</Text>

      <Text style={styles.subHeader}>{items && items[0].descricaoItem}</Text>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>Média</Text>
          <Text style={styles.statsValue}>{formatarReais(media)}</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>Mediana</Text>
          <Text style={styles.statsValue}>{formatarReais(mediana)}</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>Menor</Text>
          <Text style={styles.statsValue}>
            {menor > 0 ? formatarReais(menor) : "Sem dados"}
          </Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>Maior</Text>
          <Text style={styles.statsValue}>
            {maior > 0 ? formatarReais(maior) : "Sem dados"}
          </Text>
        </View>
      </View>

      {/* Infos */}
      <Text style={styles.infoText}>
        Consulta realizada em {dataFormatada} • Fonte: API de Dados Abertos do
        SIASG
      </Text>
      <Text style={styles.infoText}>Total de registros: {items.length}</Text>

      {/* Tabela (Note que tabelas são feitas com <View> e flexbox) */}
      <View style={styles.table}>
        {/* Cabeçalho da Tabela */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Órgão</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Municipio/Estado</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Fornecedor</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Descrição</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Unidade</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Qtd</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Preço Unit.</Text>
          </View>
          {/* A coluna "Ações" (remover) geralmente não faz sentido em um PDF estático */}
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>ID Compra</Text>
          </View>
        </View>

        {/* Linhas de Dados da Tabela */}
        {items.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.nomeOrgao}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {item.municipio} - {item.estado}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.nomeFornecedor}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.descricaoItem}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {/*item.nomeUnidadeFornecimento*/}
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
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.quantidade}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {formatarReais(item.precoUnitario)}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.idItemCompra}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default ReportPricePDF;
