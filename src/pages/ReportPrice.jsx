import { useLocation } from "react-router-dom";
import App from "./App";
import ReportPriceData from "../components/ReportPriceData";

function ReportPrice(props) {
  const location = useLocation();
  const data = location.state.data;
  const supplyUnit = location.state.supplyUnit;

  return (
    <>
      <App children={<ReportPriceData data={data} supplyUnit={supplyUnit} />} />
    </>
  );
}

export default ReportPrice;
