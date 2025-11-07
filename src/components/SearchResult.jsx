import { useEffect, useState } from "react";

import "/src/css/code-search-area.css";

import axios from "axios";

import { Link } from "react-router-dom";
import SearchInfo from "./SearchInfo";

function SearchResult(props) {
  const [item, setItem] = useState("");

  const [tipos, setTipos] = useState([]);

  const [usos, setUsos] = useState([]);

  const [composicoes, setComposicoes] = useState([]);

  const [unidades, setUnidades] = useState([]);

  let closeSearch = false;
  let searchName = document.getElementById("item_name");
  let searchResult = document.getElementById("search-result");
  const searchInfo = document.getElementById("search-info");

  const handleItem = (e, selectedItem) => {
    //e.preventDefault();

    setItem(selectedItem);
    searchResult.style = "display: none;";
    searchInfo.style = "display: flex;";
  };

  useEffect(() => {
    const unds = [];

    let searchName = document.getElementById("item_name");
    let searchResult = document.getElementById("search-result");

    searchName.addEventListener("focus", () => {
      searchResult.style = "display: flex;";
    });

    if (item.tipo == "M") {
      axios

        .get(
          "https://cnbs.estaleiro.serpro.gov.br/cnbs-api/material/v1/unidadeFornecimentoPorCodigoPdm?codigo_pdm=" +
            item.codigo
        )

        .then((response) => {
          let unidade = "";
          let id = 0;
          response.data.map((undFornecimento) => {
            unidade += undFornecimento.nomeUnidadeFornecimento;

            if (undFornecimento.capacidadeUnidadeMedida > 0) {
              unidade += " " + undFornecimento.capacidadeUnidadeMedida + " ";

              unidade += undFornecimento.siglaUnidadeMedida;
            }

            unds.push({ id: (id += 1), unidade: unidade, tipo: item.tipo });

            unidade = "";
          });

          setUnidades(unds);
        })

        .catch((error) => {
          console.error(error);
        });
    }

    if (item.tipo == "S") {
      axios

        .get(
          "https://cnbs.estaleiro.serpro.gov.br/cnbs-api/servico/v1/unidadeMedidaPorCodigo?codigo_servico=" +
            item.codigo
        )

        .then((response) => {
          let id = 0;
          response.data.map((undFornecimento) => {
            setUnidades([
              {
                id: (id += 1),
                unidade: undFornecimento.nomeUnidadeMedida,
                tipo: item.tipo,
              },
            ]);
          });
        })

        .catch((error) => {
          console.error(error);
        });
    }
  }, [item]);

  return (
    <>
      <div className="search-result" id="search-result">
        {props.data &&
          props.data.map((item) => (
            <>
              <ul key={item.codigo}>
                <li className="item" onClick={(e) => handleItem(e, item)}>
                  {item.tipo} - {item.nome}
                </li>

                {/*<Link
                  to="/"
                  className="item-action"
                  onClick={(e) => handleItem(e, item)}
                >
                  Selecionar
                </Link>*/}
              </ul>
            </>
          ))}
      </div>
      <div id="search-info" style={{ display: "none" }}>
        <SearchInfo units={unidades} item={item} />
      </div>
    </>
  );
}

export default SearchResult;
