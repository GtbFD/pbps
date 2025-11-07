import { useEffect, useState } from "react";
import "/src/css/code-search-area.css";
import axios from "axios";
import SearchResult from "./SearchResult";
import SearchInfo from "./SearchInfo";

function CodeSearchArea() {
  const [itemName, setItemName] = useState("");
  const [data, setData] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setItemName(e.target.value);

    let searchingElement = document.getElementById("search");
    let itemName = document.getElementById("item_name");

    console.log(itemName.value);

    if (itemName.value != "") {
      searchingElement.style = "display: block";
    } else {
      searchingElement.style = "display: none";
    }
  };

  useEffect(() => {
    axios
      .get(
        "https://cnbs.estaleiro.serpro.gov.br/cnbs-api/item/v1/hint?palavra=" +
          itemName
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [itemName]);

  return (
    <>
      <div className="search-area">
        <div className="search-area-pre-content">
          <h1>Busca</h1>
          <p>Faça a busca pela categoria do produto ou serviço</p>
        </div>
        <form className="search-area-form" onChange={handleSubmit}>
          <input
            name="item_name"
            id="item_name"
            placeholder="Informe o nome do item/serviço"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          {/*<input type="submit" name="search" value="Procurar" />*/}
        </form>

        <div className="search" id="search">
          <SearchResult data={data} />
        </div>
      </div>
    </>
  );
}

export default CodeSearchArea;
