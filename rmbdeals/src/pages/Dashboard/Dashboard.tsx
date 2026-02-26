import { useState } from "react"
import OrdersChart from "@/components/OrdersChart"
import { startOfMonth, subMonths } from "date-fns"
import RecentOrders from "@/components/RecentOrders"
import Statistics from "@/components/Statistics"


const Dashboard = () => {
  const [dateRange, ] = useState<{from: Date, to: Date}>({
    from: startOfMonth(subMonths(new Date(), 2)),
    to: new Date()
  })

  return (
    <>
      <div className="w-full px-4">
        <Statistics from={dateRange.from} to={dateRange.to} />
        <OrdersChart />
        <RecentOrders />
      </div>
    </>
  )
}

export default Dashboard
