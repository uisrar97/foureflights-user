import React from "react";
import { Document } from "@react-pdf/renderer";
import Invoice from "./PaymentInvoice";

function AirBlueDocPDF({ InvoiceData }) {
  return (
    <Document>
      <Invoice InvoiceData={InvoiceData} />
    </Document>
  );
}

export default AirBlueDocPDF;
