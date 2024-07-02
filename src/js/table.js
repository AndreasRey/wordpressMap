import DataTable from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net-responsive-dt';
import 'datatables.net-responsive-dt/css/responsive.dataTables.min.css';

const createTable = (anchorDivId, dataset, dataModel) => {
  let tableHtmlString = '<table id="myTable" class="display" style="width:100%"><thead><tr>';
  for (let i = 0; i < dataModel.length; i++) {
    tableHtmlString += `<th>${dataModel[i].title}</th>`;
  }
  tableHtmlString += '</tr></thead><tbody>';
  for (let i = 0; i < dataset.length; i++) {
    tableHtmlString += '<tr>';
    for (let j = 0; j < dataModel.length; j++) {
      let value = typeof dataModel[j].data === "function" ? dataModel[j].data(dataset[i]) : dataset[i][dataModel[j].data];
      tableHtmlString += `<td>${value}</td>`;
    }
    tableHtmlString += '</tr>';
  }
  tableHtmlString += '</tbody></table>';
  document.getElementById(anchorDivId).innerHTML = tableHtmlString;
  let table = new DataTable('#myTable', {
    responsive: true,
    pageLength: 10
  });
  return table;
};

export default createTable;