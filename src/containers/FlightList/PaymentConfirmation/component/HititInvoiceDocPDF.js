import React from "react";
import { Document } from "@react-pdf/renderer";
import Invoice from "./PaymentInvoice";

function HititInvoiceDocPDF({ InvoiceData }) {
  return (
    <Document>
      <Invoice InvoiceData={InvoiceData} />
    </Document>
  );
}

export default HititInvoiceDocPDF;
