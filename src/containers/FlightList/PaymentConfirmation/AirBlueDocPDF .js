import React from "react";
import { Document } from "@react-pdf/renderer";
import Invoice from "./component/PaymentInvoice";
function AirBlueDocPDF({ InvoiceData }) {
  return (
    <Document>
      <Invoice InvoiceData={InvoiceData} />
    </Document>
  );
}

export default AirBlueDocPDF;
