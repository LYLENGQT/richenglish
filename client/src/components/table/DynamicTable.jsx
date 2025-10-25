import { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function DynamicTable({
  data = [],
  columns = [],
  actions = [],
  excludeColumns = [],
  pagination = false,
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  // AUTO columns from first object keys (safe guard if no data)
  const autoColumns = useMemo(() => {
    if (!data || !data.length) return [];
    const keys = Object.keys(data[0]).filter(
      (k) => !excludeColumns.includes(k)
    );
    return keys.map((key) => ({
      accessorKey: key,
      header: key
        .replace(/_/g, " ")
        .replace(/([A-Z])/g, " $1")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    }));
  }, [data, excludeColumns]);

  // Merge user columns over auto columns. Skip any custom column without accessorKey.
  const mergedColumns = useMemo(() => {
    const map = new Map();

    autoColumns.forEach((col) => map.set(col.accessorKey, { ...col }));

    (columns || []).forEach((customCol) => {
      if (!customCol || !customCol.accessorKey) return; // guard
      const base = map.get(customCol.accessorKey) || {};
      map.set(customCol.accessorKey, {
        accessorKey: customCol.accessorKey,
        header:
          customCol.header ||
          (customCol.accessorKey || "")
            .replace(/_/g, " ")
            .replace(/([A-Z])/g, " $1")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/\b\w/g, (c) => c.toUpperCase()),
        // Accept either a cell renderer (function expecting getContext-like param)
        // or a simple function that receives row original (we adapt below in table render).
        cell: customCol.cell || ((info) => info.getValue && info.getValue()),
        // allow user to control sorting per-column
        enableSorting:
          customCol.enableSorting !== undefined
            ? customCol.enableSorting
            : true,
        // optional alignment/width props can be passed through
        meta: customCol.meta || undefined,
      });
    });

    // Add actions column if actions provided
    if (actions && actions.length > 0) {
      map.set("actions", {
        id: "actions",
        accessorKey: "actions",
        header: "Actions",
        // disable sorting for actions column
        enableSorting: false,
        cell: ({ row, table }) => {
          // row.original = full row data, row.index = index
          const rowData = row.original;
          const rowIndex = row.index;
          if (actions.length === 1) {
            const a = actions[0];
            return (
              <Button
                size="sm"
                variant={a?.variant || "default"}
                onClick={() => a.onClick && a.onClick(rowData, rowIndex, table)}
              >
                {a.label}
              </Button>
            );
          }
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actions.map((a, i) => (
                  <DropdownMenuItem
                    key={i}
                    onClick={() =>
                      a.onClick && a.onClick(rowData, rowIndex, table)
                    }
                  >
                    {a.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      });
    }

    return [...map.values()];
  }, [autoColumns, columns, actions]);

  const table = useReactTable({
    data: data || [],
    columns: mergedColumns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(pagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
  });

  // Pagination default page size
  useEffect(() => {
    if (pagination) {
      table.setPageSize && table.setPageSize(10);
    }
  }, [pagination, table]);

  // Helper to render a cell supporting both: (info) => ... OR (row) => ...
  const renderCell = (cell) => {
    const cellDef = cell.column.columnDef.cell;
    // If user provided a simple cell that expects row.original (older API), call that
    try {
      // prefer using provided cell renderer via flexRender (works with ctx)
      return flexRender(cellDef, cell.getContext());
    } catch (err) {
      // fallback: call as a function with row.original
      try {
        const fn = cellDef;
        if (typeof fn === "function") {
          return fn(cell.row.original, cell.row.index);
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        {globalFilter && (
          <Button size="sm" variant="ghost" onClick={() => setGlobalFilter("")}>
            Clear
          </Button>
        )}
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort =
                    header.column.getCanSort && header.column.getCanSort();
                  const sortingHandler = canSort
                    ? header.column.getToggleSortingHandler()
                    : undefined;
                  return (
                    <TableHead
                      key={header.id}
                      className={`cursor-pointer select-none ${
                        !canSort ? "cursor-default" : ""
                      }`}
                      onClick={sortingHandler}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {canSort && (
                        <ArrowUpDown className="inline-block ml-1 h-3 w-3 opacity-50" />
                      )}
                      {/* show sort direction indicator */}
                      {canSort &&
                        header.column.getIsSorted &&
                        header.column.getIsSorted() && (
                          <span className="ml-1 text-xs">
                            {header.column.getIsSorted() === "asc" ? "▲" : "▼"}
                          </span>
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {!data || data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={mergedColumns.length}
                  className="p-4 text-center text-muted-foreground"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{renderCell(cell)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()} ({table.getFilteredRowModel().rows.length}{" "}
            total results)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
