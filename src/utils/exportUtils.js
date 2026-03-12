import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportCSV = (data, filename = "report.csv") => {
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  data.forEach((row) => {
    const values = headers.map((h) => `"${row[h]}"`);
    csvRows.push(values.join(","));
  });

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};

export const exportExcel = (data, filename = "report.xls") => {
  const table = `
    <table>
      <tr>${Object.keys(data[0])
        .map((k) => `<th>${k}</th>`)
        .join("")}</tr>
      ${data
        .map(
          (row) =>
            `<tr>${Object.values(row)
              .map((v) => `<td>${v}</td>`)
              .join("")}</tr>`,
        )
        .join("")}
    </table>
  `;

  const blob = new Blob([table], {
    type: "application/vnd.ms-excel",
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};

/* ==============================
   PDF EXPORT
================================ */
export const exportPDF = (data, filename = "report.pdf") => {
  if (!data || data.length === 0) return;

  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Compliance & Audit Report", 14, 15);

  autoTable(doc, {
    startY: 25,
    head: [Object.keys(data[0])],
    body: data.map((row) => Object.values(row)),
    styles: { fontSize: 9 },
    headStyles: {
      fillColor: [11, 92, 138],
      textColor: 255,
    },
  });

  doc.save(filename);
};
