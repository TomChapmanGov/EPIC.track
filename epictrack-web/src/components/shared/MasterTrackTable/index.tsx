import React from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_RowData,
  MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Container, Typography } from "@mui/material";
import SearchIcon from "../../../assets/images/search.svg";
import { Palette } from "../../../styles/theme";
import { MET_Header_Font_Weight_Bold } from "../../../styles/constants";
import { ETHeading2 } from "..";

const NoDataComponent = ({ ...props }) => {
  const { table } = props;
  return (
    <>
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            alignItems: "center",
          }}
        >
          <Box component="img" src={SearchIcon} alt="Search" width="32px" />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <ETHeading2 bold>No results found</ETHeading2>
            {table.options.data.length > 0 && (
              <Typography color="#6D7274">
                Adjust your parameters and try again
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export interface MaterialReactTableProps<TData extends MRT_RowData>
  extends MRT_TableOptions<TData> {
  columns: MRT_ColumnDef<TData>[];
  data: TData[];
}

const MasterTrackTable = <TData extends MRT_RowData>({
  columns,
  data,
  ...rest
}: MaterialReactTableProps<TData>) => {
  const table = useMaterialReactTable({
    columns,
    data,
    globalFilterFn: "contains",
    enableHiding: false,
    enableGlobalFilter: false,
    enableStickyHeader: true,
    enableDensityToggle: false,
    enableColumnFilters: true,
    enableFullScreenToggle: false,
    enableSorting: true,
    enableFilters: true,
    enableColumnActions: false,
    enablePinning: true,
    enablePagination: false,
    positionActionsColumn: "last",
    muiTableHeadProps: {
      sx: {
        "& .MuiTableRow-root": {
          boxShadow: "none",
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: Palette.neutral.bg.light,
        padding: "1rem 0.5rem 0.5rem 1rem !important",
        "& .Mui-TableHeadCell-Content-Labels": {
          fontSize: "1rem",
          fontWeight: MET_Header_Font_Weight_Bold,
          color: Palette.neutral.dark,
          paddingBottom: "0.5rem",
        },
        "& .MuiTextField-root": {
          minWidth: "0",
        },
        "& .MuiCheckbox-root": {
          width: "2.75rem !important",
          height: "2rem",
          padding: "8px !important",
          borderRadius: "4px",
        },
      },
    },
    muiTableProps: {
      sx: {
        tableLayout: "fixed",
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      disabled: true,
      sx: {
        padding: "0.5rem 0.5rem 0.5rem 1rem",
        "& .MuiCheckbox-root": {
          width: "2.75rem !important",
          height: "2rem",
          borderRadius: "4px",
          padding: "8px !important",
          "&.Mui-disabled": {
            svg: {
              fill: Palette.neutral.light,
            },
          },
        },
      },
    }),
    muiFilterTextFieldProps: ({ column }) => ({
      placeholder: column.columnDef.header,
      variant: "outlined",
      sx: {
        backgroundColor: "white",
        "& .MuiInputBase-input::placeholder": {
          color: Palette.neutral.light,
          fontSize: "0.875rem",
          lineHeight: "1rem",
          opacity: 1,
        },
        "& .MuiInputAdornment-root": {
          display: "none",
        },
        "& .MuiSelect-icon": {
          mr: "0px !important",
        },
      },
    }),
    muiTableContainerProps: (table) => ({
      sx: {
        maxHeight: "100%",
      },
    }),
    muiTableBodyProps: {
      sx: {
        "& tr:hover td": {
          backgroundColor: Palette.primary.bg.light,
        },
      },
    },
    muiTableBodyRowProps: {
      hover: true,
      sx: {
        "&.Mui-selected": {
          backgroundColor: Palette.primary.bg.main,
        },
        "&.MuiTableRow-hover:hover": {
          backgroundColor: Palette.primary.bg.light,
        },
      },
    },
    sortingFns: {
      sortFn: (rowA: any, rowB: any, columnId: string) => {
        return rowA
          ?.getValue(columnId)
          ?.localeCompare(rowB?.getValue(columnId), "en", {
            numeric: true,
            ignorePunctuation: false,
            sensitivity: "base",
          });
      },
    },
    renderToolbarInternalActions: ({ table }) => (
      <>{/* <MRT_ToggleFiltersButton table={table} /> */}</>
    ),
    renderEmptyRowsFallback: ({ table }) => <NoDataComponent table={table} />,
    ...rest,
    initialState: {
      showColumnFilters: true,
      density: "compact",
      columnPinning: { right: ["mrt-row-actions"] },
      ...rest.initialState,
    },
    state: {
      showGlobalFilter: true,
      columnPinning: { right: ["mrt-row-actions"] },
      ...rest.state,
    },
    icons: {
      FilterAltIcon: () => null,
      CloseIcon: () => null,
    },
    filterFns: {
      multiSelectFilter: (row, id, filterValue) => {
        if (filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(id));
      },
    },
  });
  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

export default MasterTrackTable;
