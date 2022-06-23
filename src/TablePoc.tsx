import { Row } from "./data";
import MaterialTable, { Icons } from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import * as XLSX from 'xlsx';
import { FC, forwardRef } from "react";

export interface TablePocProps {
  rows: Row[];
}

const tableIcons: Icons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const compareDate = (left: string, right: string) => {
  const [leftDate, leftTime] = left.split(" ");
  const [rightDate, rightTime] = right.split(" ");
  const [leftDay, leftMonth, leftYear] = leftDate.split("-");
  const [rightDay, rightMonth, rightYear] = rightDate.split("-");
  const [leftHour, leftMinute] = leftTime.split("-");
  const [rightHour, rightMinute] = rightTime.split("-");
  let comparison = Number(leftYear) - Number(rightYear);
  if (comparison === 0) {
    comparison = Number(leftMonth) - Number(rightMonth);
  }
  if (comparison === 0) {
    comparison = Number(leftDay) - Number(rightDay);
  }
  if (comparison === 0) {
    comparison = Number(leftHour) - Number(rightHour);
  }
  if (comparison === 0) {
    comparison = Number(leftMinute) - Number(rightMinute);
  }
  return comparison;
};

const compareStatus = (left: string, right: string) => {
  const defaultOrder = ['FEITO', 'EM ANALISE', 'ERRADO'];
  return -(defaultOrder.indexOf(left) - defaultOrder.indexOf(right));
};

function sortData(data: Row[]) {
  const newData = [...data];
  newData.sort((left, right) => {
    let comparison = compareStatus(left.status, right.status);
    if (comparison === 0) {
      comparison = -compareDate(left.due, right.due);
    }
    return comparison;
  });
  return newData;
}

const exportExcel = (columns: any[], renderData: any[]) => {
  const rows = [];
  for (const rowData of renderData) {
    const row: Record<string, any> = {};
    for (const column of columns) {
      row[column.title as string] = rowData[column.field];
    }
    rows.push(row)
  }
  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: columns.map((column) => column.title),
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");
  XLSX.writeFile(workbook, "Relatorio.xlsx");
};

export const TablePoc: FC<TablePocProps> = ({
  rows,
}) => (
  <div className="pocked-table">
    <MaterialTable
      title="Basic Table PoC"
      columns={[
        {
          title: "Nome",
          field: "name",
        },
        {
          title: "CNPJ",
          field: "idNum",
        },
        {
          title: "Data de vencimento",
          field: "due",
          customSort: (left, right) => compareDate(left.due, right.due),
        },
        {
          title: "Status",
          field: "status",
        },
      ]}
      data={sortData(rows)}
      options={{
        sorting: true,
        exportButton: true,
        search: true,
        filtering: true,
        pageSize: 10,
        pageSizeOptions: [10, 20, 50],
        exportCsv: exportExcel,
      }}
      icons={tableIcons}
      localization={{
        pagination: {
          labelDisplayedRows: "{from}-{to} de {count}",
          labelRowsPerPage: "Linhas por página: ",
          firstAriaLabel: "Primeira página",
          firstTooltip: "Primeira página",
          previousAriaLabel: "Página anterior",
          previousTooltip: "Página anterior",
          nextAriaLabel: "Próxima página",
          nextTooltip: "Próxima página ",
          lastAriaLabel: "Última página",
          lastTooltip: "Última página",
          labelRowsSelect: "linhas",
        },
        body: {
          filterRow: {
            filterPlaceHolder: "Filtrar...",
            filterTooltip: "Filtrar por esse campo",
          },
        },
        toolbar: {
          searchPlaceholder: "Pesquisar...",
          searchTooltip: "Pesquisar por qualquer campo da tabela",
          exportCSVName: "Exportar para Excel",
          exportPDFName: "Exportar como PDF",
          exportTitle: "Exportar...",
          exportAriaLabel: "Exportar...",
        }
      }}
    />
  </div>
);
