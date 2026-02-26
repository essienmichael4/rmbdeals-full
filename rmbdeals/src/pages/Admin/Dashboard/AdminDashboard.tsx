import { useState } from "react"
import { startOfMonth, subMonths } from "date-fns"
import AdminStatistics from "@/components/AdminStatistics"
import AdminRecentOrders from "@/components/AdminRecentOrders"
import AdminOrdersChart from "@/components/AdminOrdersChart"
import { DateRangePicker } from "@/components/ui/date-range-picker"
// import { toast } from "sonner"


const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState<{from: Date, to: Date}>({
    from: startOfMonth(subMonths(new Date(), 2)),
    to: new Date()
  })

  return (
    <>
      <div className="w-full px-4">
        <div className='flex flex-wrap items-center justify-between gap-8 mb-4'>
          <h2 className='text-xl lg:text-3xl font-semibold'>Dashboard</h2>
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values)=>{
              const {from, to} = values.range
              if(!from || !to) return
              setDateRange({from, to})
            }}
          />
        </div>
        <hr />
        <div className='h-2 w-96 relative hidden lg:block bg-[#FFDD66] -top-1'></div>
        <AdminStatistics from={dateRange.from} to={dateRange.to} />
        <AdminOrdersChart />
        <AdminRecentOrders />
      </div>
    </>
  )
}

export default AdminDashboard
