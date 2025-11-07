import { createContext, useContext, useEffect, useState } from "react";
import "/src/css/search-info-area.css";
import axios from "axios";
import CartProvider from "./Cart";
import Cart from "./Cart";

const CART_STORAGE_KEY = "cart";

const retreiveCart = () => {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (savedCart) {
    try {
      return JSON.parse(savedCart);
    } catch (e) {
      console.error(e);
      return [];
    }
  }
};

function SearchInfo(props) {
  const units = props.units;
  const item = props.item;

  const [itemCharac, setItemCharac] = useState([]);
  const [selectUnit, setSelectUnit] = useState(null);

  const [cart, addToCart] = useState(retreiveCart);
  const [updateCart, setUpdateCart] = useState(false);

  useEffect(() => {
    if (item.tipo === "M") {
      axios
        .get(
          "https://cnbs.estaleiro.serpro.gov.br/cnbs-api/material/v1/materialCaracteristcaValorporPDM?codigo_pdm=" +
            item.codigo
        )
        .then((response) => {
          setItemCharac(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (item.tipo === "S") {
      axios
        .get(
          "https://cnbs.estaleiro.serpro.gov.br/cnbs-api/servico/v1/dadosServicoPorCodigo?codigo_servico=" +
            item.codigo
        )
        .then((response) => {
          console.log(response.data);
          setItemCharac([response.data]);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [item]);

  const handleUnitSelection = (e) => {
    setSelectUnit(e.target.value);
    console.log(e.target.value);
  };

  const handleCart = (e, itemToCart) => {
    console.log("Adicionar item na cesta");
    addToCart((cart) => [...cart, itemToCart]);
    localStorage.setItem("OPENED_CART", true);

    const successMessage = document.getElementById("success-message");
    successMessage.style = "display: flex;";
    setTimeout(() => {
      successMessage.style = "display: none;";
    }, 3000);

    setSelectUnit("");
  };

  const saveInLocalStorate = (cart) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    setUpdateCart(true);
  };

  useEffect(() => {
    saveInLocalStorate(cart);
  }, [cart]);

  return (
    <>
      <div className="insertion-message">
        <div className="success-message" id="success-message">
          Item adicionado no carrinho!
        </div>
      </div>
      <div className="search-info-container">
        <div className="search-info-filters">
          <div className="info-presentation">
            <p className="legend">Unidade</p>
            <p className="legend-2">Selecione uma unidade de fornecimento</p>
          </div>
          <select
            className="unit-selection"
            onChange={handleUnitSelection}
            value={selectUnit}
          >
            {units &&
              units.map((unit) => (
                <option key={unit.id}>{unit.unidade}</option>
              ))}
            <option value="" selected>
              Todas as unidades
            </option>
          </select>
        </div>
        <div className="response-search">
          <div className="info-presentation">
            <p className="legend">Produtos ou serviços</p>
            <p className="legend-2">Selecione o(s) produto(s) ou serviço(s)</p>
          </div>
          <div className="table-search-info">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {itemCharac &&
                  itemCharac.map((characts) => (
                    <tr key={characts.codigoItem || characts.codigoServico}>
                      {/* Coluna 1: CÓDIGO */}
                      <td>
                        {item.tipo === "M" && characts.codigoItem}
                        {item.tipo === "S" && characts.codigoServico}
                      </td>

                      {/* Coluna 2: DESCRIÇÃO */}
                      <td>
                        {/* Descrição principal */}

                        {item.tipo === "M" && <b>{characts.nomePdm}</b>}
                        {item.tipo === "S" && (
                          <b>{characts.descricaoServicoAcentuado}</b>
                        )}

                        {/* Detalhes (loop interno) */}
                        {characts.buscaItemCaracteristica &&
                          characts.buscaItemCaracteristica.map(
                            (detail, index) => (
                              <p key={index}>
                                {detail.nomeCaracteristica}:{" "}
                                {detail.nomeValorCaracteristica}
                              </p>
                            )
                          )}
                      </td>
                      <td>
                        <input
                          className="add-to-cart"
                          name="add-to-cart"
                          type="submit"
                          value="Adicionar"
                          onClick={(e) =>
                            handleCart(e, {
                              codigo:
                                characts.codigoItem || characts.codigoServico,
                              unidade: selectUnit,
                              item: characts,
                              tipo: item.tipo,
                            })
                          }
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <br />
    </>
  );
}

export default SearchInfo;
