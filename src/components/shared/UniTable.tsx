"use client"

import * as React from "react"
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, type ColumnDef } from "@tanstack/react-table"
import { Check, Minus, Trash2, Pencil, Eye, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Pagination } from "./Pagination"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

export interface UniTableProps<TData> {
    data: TData[]
    columns: ColumnDef<TData, any>[]
    enableSelection?: boolean
    onSelectionChange?: (selectedRows: TData[]) => void
    pageSize?: number
    enablePagination?: boolean
    itemLabel?: string
    serverPagination?: {
        currentPage: number
        totalPages: number
        totalItems: number
        onPageChange: (page: number) => void
    }
}

// Action Button component
export function ActionButton({
    icon: Icon,
    onClick,
    variant = "default"
}: {
    icon: any;
    onClick?: () => void;
    variant?: "default" | "danger"
}) {
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
            }}
            className={cn(
                "p-0 d-inline-flex align-items-center justify-content-center border-0 bg-transparent",
                variant === "danger"
                    ? "text-danger"
                    : "text-secondary"
            )}
            style={{ width: "32px", height: "32px" }}
        >
            <Icon size={16} />
        </Button>
    )
}

// Status selection cells
export function StatusSelectCell({
    value,
    onValueChange,
    options,
    colorMap,
    className
}: {
    value: string;
    onValueChange: (newValue: string) => void;
    options: string[];
    colorMap: Record<string, string>;
    className?: string;
}) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger
                className={cn(
                    "form-select form-select-sm",
                    className
                )}
                style={{ width: "130px" }}
            >
                <SelectValue>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </SelectValue>
            </SelectTrigger>
            <SelectContent position="popper">
                {options.map((option) => (
                    <SelectItem
                        key={option}
                        value={option}
                        className="d-flex align-items-center gap-2"
                    >
                        <span className={cn("badge rounded-pill", colorMap[option] || "bg-secondary")} style={{ width: "8px", height: "8px", padding: 0 }} />
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

// Image & Text cell
export function ImageTextCell({
    imageSrc,
    title,
    subtitle,
    fallbackText
}: {
    imageSrc?: string;
    title: string;
    subtitle?: string;
    fallbackText?: string;
}) {
    return (
        <div className="d-flex align-items-center gap-3">
            <Avatar>
                <AvatarImage src={imageSrc} alt={title} />
                <AvatarFallback>{fallbackText || title.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="d-flex flex-column">
                <span className="fw-semibold text-dark">{title}</span>
                {subtitle && <span className="text-muted text-xs">{subtitle}</span>}
            </div>
        </div>
    )
}

export function SelectionHeader({
    checked,
    indeterminate,
    onChange
}: {
    checked: boolean
    indeterminate: boolean
    onChange?: (checked: boolean) => void
}) {
    return (
        <div className="form-check style-check d-flex align-items-center m-0">
            <Checkbox
                checked={checked}
                indeterminate={indeterminate}
                onCheckedChange={onChange}
            />
        </div>
    )
}

export function SelectionCell({
    checked,
    onChange
}: {
    checked: boolean
    onChange?: (checked: boolean) => void
}) {
    return (
        <div className="form-check style-check d-flex align-items-center m-0">
            <Checkbox
                checked={checked}
                onCheckedChange={onChange}
            />
        </div>
    )
}

export function UniTable<TData>({
    data,
    columns,
    enableSelection = false,
    onSelectionChange,
    pageSize = 10,
    enablePagination = true,
    itemLabel = "items",
    serverPagination
}: UniTableProps<TData>) {
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})

    const tableColumns = React.useMemo(() => {
        if (!enableSelection) return columns;

        const selectionColumn: ColumnDef<TData, any> = {
            id: "select",
            header: ({ table }) => (
                <SelectionHeader
                    checked={table.getIsAllPageRowsSelected()}
                    indeterminate={table.getIsSomePageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <SelectionCell
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            size: 40,
        };

        return [selectionColumn, ...columns];
    }, [columns, enableSelection]);

    const table = useReactTable({
        data,
        columns: tableColumns,
        state: {
            rowSelection,
        },
        enableRowSelection: enableSelection,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: pageSize,
            },
        },
    })

    // Handle selection change callbacks
    React.useEffect(() => {
        if (onSelectionChange) {
            const selectedRows = table.getSelectedRowModel().flatRows.map((row) => row.original);
            onSelectionChange(selectedRows);
        }
    }, [rowSelection, onSelectionChange, table]);

    // Pagination calculations
    const isServerPaginated = !!serverPagination;
    const currentPage = isServerPaginated ? serverPagination.currentPage : table.getState().pagination.pageIndex + 1;
    const totalPages = isServerPaginated ? serverPagination.totalPages : table.getPageCount();
    const totalItems = isServerPaginated ? serverPagination.totalItems : data.length;
    const onPageChange = isServerPaginated ? serverPagination.onPageChange : (page: number) => table.setPageIndex(page - 1);

    return (
        <div className="table-responsive">
            <table className="table bordered-table mb-0 data-table">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    scope="col"
                                    style={header.column.columnDef.size ? { width: header.column.columnDef.size } : undefined}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    <AnimatePresence mode="popLayout">
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row, idx) => (
                                <motion.tr
                                    key={row.id}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.15, delay: idx * 0.02 }}
                                    style={{ verticalAlign: "middle" }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={tableColumns.length} className="text-center py-4">
                                    No data available.
                                </td>
                            </tr>
                        )}
                    </AnimatePresence>
                </tbody>
            </table>
            {enablePagination && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    onPageChange={onPageChange}
                    itemLabel={itemLabel}
                />
            )}
        </div>
    )
}
