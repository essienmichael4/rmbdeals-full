import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Order } from '@/lib/types'
import { DataTableColumnHeader } from './DataTable/ColumnHeader'
import { ColumnDef, getCoreRowModel, flexRender, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import useAxiosToken from '@/hooks/useAxiosToken'
import { FormattedDate } from '@/lib/helper'

const emptyData: any[]= []

const RecentOrders = () => {
    const axios_instance_token = useAxiosToken()

    const orders = useQuery<Order[]>({
        queryKey: ["summary", "orders", "recent"],
        queryFn: async() => await axios_instance_token.get(`/stats/recent-orders`).then(res => res.data)
    })

    const columns:ColumnDef<Order>[] =[{
        accessorKey: "id",
        header:({column})=>(<DataTableColumnHeader column={column} title='Order ID' />),
        cell:({row}) => <div>
            <Link to={`../orders/${row.original.id}`}>
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
        
    })

    return (
        <div className="my-8 border p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg lg:text-3xl">Recent orders</h4>
                <Link to={'../orders'} className="text-xs lg:text-sm bg-[rgb(255,221,102)] px-2 lg:px-4 py-1 lg:py-2 rounded-full">See all</Link>
            </div>
            <div className="w-full rounded-md border bg-white/75">
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
            </div>
    )
}

export default RecentOrders
