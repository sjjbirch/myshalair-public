import { TableContainer, Table, TableHead, TableRow, TableBody, Paper, TableFooter } from "@mui/material";

const CustomTable = ({ head, body, footer }) => {

  return (
    <TableContainer
      component={Paper}
    >
      <Table size='small' >
        <TableHead>
          <TableRow>
            {head}
          </TableRow>
        </TableHead>
        <TableBody>
          {body}
        </TableBody>
        <TableFooter>
          {footer}
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;