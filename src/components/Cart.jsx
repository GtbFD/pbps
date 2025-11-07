import { useEffect, useState } from "react";
import "/src/css/cart.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingData from "./LoadingData";

const CART_STORAGE_KEY = "cart";
const OPENED_CART_KEY = "OPENED_CART";

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

const isCartOpened = () => {
  return JSON.parse(localStorage.getItem(OPENED_CART_KEY));
};

function Cart(props) {
  const navigate = useNavigate();
  const [cart, setCart] = useState(retreiveCart);
  const [isOpened, setIsOpened] = useState(isCartOpened);
  const [loading, isLoading] = useState(false);
  const [item, setItem] = useState();

  const removeItem = (codigo) => {
    const savedCart = retreiveCart();

    const arrayItems = [...savedCart];

    let newArrayItems = arrayItems.filter((item) => item.codigo !== codigo);

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newArrayItems));
    setCart(newArrayItems);
  };

  const searchPrice = (e, item) => {
    isLoading(true);
    setItem(item);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (item) {
          if (item.tipo === "M") {
            const response = await axios.get(
              "/api/compras/modulo-pesquisa-preco/1_consultarMaterial?pagina=1&tamanhoPagina=100&codigoItemCatalogo=" +
                item.itemCodigo
            );
            isLoading(true);
            props.closeCart();
            if (response.status == 200) {
              isLoading(false);

              navigate("/report", {
                state: { data: response.data, supplyUnit: item.unidade },
              });
            }
          }

          if (item.tipo === "S") {
            const response = await axios.get(
              "/api/compras/modulo-pesquisa-preco/3_consultarServico?pagina=1&codigoItemCatalogo=" +
                item.itemCodigo
            );
            isLoading(true);
            props.closeCart();
            if (response.status == 200) {
              isLoading(false);

              navigate("/report", {
                state: { data: response.data, supplyUnit: item.unidade },
              });
            }
          }
        }
        isLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [loading]);

  if (loading) {
    return <LoadingData />;
  }

  return (
    <>
      <div className="cart-container" id="cart-container">
        <div
          className="cart-presentation"
          style={{
            "border-bottom": "1px solid #CCC",
            "padding-bottom": "10px",
          }}
        >
          <div className="close-cart" id="close=cart" onClick={props.closeCart}>
            X
          </div>
          <div className="info-presentation">
            <p className="legend">Pesquisa de itens</p>
            <p className="legend-2">
              Exclua ou insira os itens caso necessário
            </p>
          </div>
        </div>
        <div className="items">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>Unidade de Fornecimento</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {cart &&
                cart.map((item, index) => (
                  <tr key={index}>
                    {/* Coluna 1: CÓDIGO */}
                    <td>{item.codigo}</td>

                    {/* Coluna 2: DESCRIÇÃO */}
                    <td>
                      {item.tipo === "M" && (
                        <b>
                          {item.item.nomePdm}
                          <br />
                        </b>
                      )}
                      {item.tipo === "S" && (
                        <b>
                          {item.item.descricaoServicoAcentuado}
                          <br />
                        </b>
                      )}
                      {item.item.buscaItemCaracteristica &&
                        item.item.buscaItemCaracteristica.map((charact) => (
                          <>
                            {charact.nomeCaracteristica}: {""}
                            {charact.nomeValorCaracteristica} <br />
                          </>
                        ))}
                    </td>
                    <td>
                      {item.unidade == null || item.unidade == ""
                        ? "Todas as unidades"
                        : item.unidade}
                    </td>
                    <td>
                      <input
                        className="search-prices"
                        type="submit"
                        value="Pesquisa de preço"
                        onClick={(e) =>
                          searchPrice(e, {
                            itemCodigo: item.codigo,
                            tipo: item.tipo,
                            unidade: item.unidade,
                          })
                        }
                      />
                      &nbsp;
                      <input
                        className="remove-item"
                        type="submit"
                        value="Remover"
                        onClick={(e) => removeItem(item.codigo)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <br />
        </div>
      </div>
    </>
  );
}

export default Cart;
