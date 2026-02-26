import { DataTableColumnHeader } from "@/components/DataTable/ColumnHeader"
import { DataTableViewOptions } from "@/components/DataTable/ColumnToggle"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useAxiosToken from "@/hooks/useAxiosToken"
import { FormattedDate } from "@/lib/helper"
import { Order } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import {ColumnDef, SortingState, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel,getFilteredRowModel, useReactTable, } from "@tanstack/react-table"
import { useState } from "react"
import { Link } from "react-router-dom"

const emptyData: any[]= []

const OrdersAdmin = () => {
    const axios_instance_token = useAxiosToken()
    const [sorting, setSorting] = useState<SortingState>([])
    const [filtering, setFiltering] = useState("")

    const orders = useQuery<Order[]>({
        queryKey: ["orders-admin"],
        queryFn: async() => await axios_instance_token.get("/orders/admin").then(res => res.data)
    })

    const columns:ColumnDef<Order>[] =[{
        accessorKey: "id",
        header:({column})=>(<DataTableColumnHeader column={column} title='Order ID' />),
        cell:({row}) => <div>
            <Link to={`${row.original.id}`} className="w-full h-full">
                <span className='text-gray-400'>#</span>{row.original.id}
            </Link>
        </div>
    },{
        accessorKey: "createdAt",
        header:({column})=>(<DataTableColumnHeader column={column} title='Date' />),
        cell:({row}) => {
            const date = new Date(row.original.createdAt as string)
            const formattedDate = FormattedDate(date)
            
            return <div className='text-muted-foreground'>
                {formattedDate}
            </div>
        }
    },{
        accessorKey: "product",
        header:({column})=>(<DataTableColumnHeader column={column} title='Product' />),
        cell:({row}) => <div>
            {row.original.product}
        </div>
    },{
        accessorKey: "amount",
        header:({column})=>(<DataTableColumnHeader column={column} title='Price' />),
        cell:({row}) => {
            return <div>
                {row.original.amount}
            </div>
        }
    },{
        accessorKey: "recipient",
        header:({column})=>(<DataTableColumnHeader column={column} title='Recipient' />),
        cell:({row}) => <div>
            {row.original.recipient}
        </div>
    },{
        accessorKey: "account",
        header:({column})=>(<DataTableColumnHeader column={column} title='Account' />),
        cell:({row}) => <div>
            {row.original.account}
        </div>
    },{
        accessorKey: "status",
        header:({column})=>(<DataTableColumnHeader column={column} title='Status' />),
        cell:({row}) => <div>
            <span className={`${row.original.status === "HELD" && 'bg-gray-300'} ${row.original.status === "COMPLETED" && 'bg-emerald-300 text-emerald-700'} ${row.original.status === "CANCELLED" && 'bg-rose-300 text-rose-700'} ${row.original.status === "PENDING" && 'bg-blue-300 text-blue-700'} p-2 rounded-lg`}>
                {row.original.status}
            </span>
        </div>
    }]

    const table = useReactTable({
        data: orders.data || emptyData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
            pagination: {
                pageSize: 20
            }
        },
        state:{
            sorting,
            globalFilter: filtering
        },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    })

    return (
        <>
            <div className="mb-12 px-4 lg:px-0">
                <h4 className="text-3xl font-semibold mb-4">All Orders</h4>
                <hr />
                <div className='h-2 w-96 relative hidden lg:block bg-[#FFDD66] -top-1'></div>
                <div className='w-full mt-8'>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <input value={filtering}  onChange={e => setFiltering(e.target.value)} placeholder='Search orders...' className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"/>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <DataTableViewOptions table={table} />
                        </div>
                    </div>
                    <div className="rounded-md border bg-white/75">
                        <Table>
                            <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                            )}
                                    </TableHead>
                                    )
                                })}
                                </TableRow>
                            ))}
                            </TableHeader>
                            <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                    ))}
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                                </TableRow>
                            )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        >
                        Previous
                        </Button>
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        >
                        Next
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrdersAdmin
