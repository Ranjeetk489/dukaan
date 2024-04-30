
import { fetchInsideTryCatch } from "@/lib/client/apiUtil";
import { AdminDashboardOrders } from "@/types/client/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<AdminDashboardOrders[]> {
  // Fetch data from your API here.
  const response = await fetchInsideTryCatch<AdminDashboardOrders[]>(
    `api/admin/orders`
  );

  if (response && response.response.statusCode === 200 && response.response.data) {
    console.log(response.response.data)
    return response.response.data;
  }
  return [];
}

export default async function AdminOrders() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
