import { Box, Typography, Paper, Pagination, Stack } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useGlobalState } from "../../../utils/stateContext";
import LitterShowItem from "../LitterShowItem/LitterShowItem";

const ShowCase = () => {
  const { store } = useGlobalState();
  const { litterList } = store;

  const [litter, setLitter] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [pageCount, setPageCount] = useState(Math.ceil(litter.length / 5));

  // on component mount or when litterList or litter state updates, checks if litter has any values, if no, filters litterList to only save litters with an id that isn't 1 and has an adate value to litter state, also filters output by adate
  useEffect(() => {
    if (litter.length === 0) {
      setLitter(litterList.filter(litter => litter.id !== 1 && litter.adate).sort((a, b) => moment(b.adate) - moment(a.adate)));
    }
  }, [litterList, litter]);

  // sets values already set by default due to eslint warning regarding unused functions
  useEffect(() => {
    setItemsPerPage(5);
    setPageCount(Math.ceil(litter.length / 5));
  }, [litter]);

  // controls pagination browsing
  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <Box>
        <Box sx={{ py: 2, textAlign: 'center' }}>
          <Typography variant="h2" >Litters</Typography>
        </Box>
        <Box component={Paper}>
          <Stack
            direction="column"
          // spacing={2}
          // sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}
          >
            {/* slices litter state to use pagination and maps info through to littershowitem component */}
            {litter.slice((page - 1) * itemsPerPage, (page - 1) * itemsPerPage + itemsPerPage)
              .map((litter, index) => {
                return litter.status !== 3
                  && <LitterShowItem key={index} litter={litter} />;
              })}
          </Stack>
          <Pagination count={pageCount} page={page} onChange={handleChangePage} />
        </Box>
      </Box>
    </>
  );
};

export default ShowCase;