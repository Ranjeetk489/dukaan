import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { SelectContent, SelectItem, SelectTrigger } from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [popupData, setPopupData] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState("Select Delivery Status");


  type DeliveryStatus = 'Out for Delivery' | 'Delivered';

  
    const handleValueChange = (newValue: DeliveryStatus) => {
     console.log(newValue, "newValue")

      setDeliveryStatus(newValue);
    };
  

    const handleCellClick = (rowData: string | any[] | TData) => {
      //@ts-expect-error
      rowData = rowData?.products;
      if (Array.isArray(rowData) && rowData.length > 0) {
        const orderKeyValue: any[] = rowData.map((item: any, index: number) => {
          const keys = ["product_name", "price_per_unit", "product_quantity", "quantity"];
          const filteredData = Object.fromEntries(Object.entries(item).filter(([key]) => keys.includes(key)));

          return { id: `${item.order_id}_${index}`, data: filteredData };
        });

        setPopupData(orderKeyValue);
        console.log(orderKeyValue, "popupData");
        setShowPopup(true);
      }
    };

    const handleUpdateDelivery = (event: React.MouseEvent<HTMLButtonElement>) => {
      console.log("Update Delivery", event);
    };

    const handleClosePopup = () => {
      setShowPopup(false);
    };

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  );
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
                    <TableCell
                      key={cell.id}
                      //cell.row.original[cell.column.id ]
                      onClick={() => handleCellClick(cell.row.original)}
                      className="cursor-pointer"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>


        {/* Popup window */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-xl overflow-y-auto">
              <button
                className="absolute top-0 right-0 m-4 text-gray-500 hover:text-black"
                onClick={handleClosePopup}
              >
                Close
              </button>
              <h2 className="text-lg font-bold mb-4 text-black">Ordered Item List</h2>
              <div className="container mx-auto py-10">
                <Table className="text-black">
                  <TableCaption>Data Table</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableCell className="font-semibold pr-2">Product Name</TableCell>
                      <TableCell className="font-semibold pr-2">Price per Unit</TableCell>
                      <TableCell className="font-semibold pr-2">Product Quantity</TableCell>
                      <TableCell className="font-semibold pr-2">Quantity</TableCell>

                    </TableRow>
                  </TableHeader>
                  <TableBody>

                    {popupData.map((item) => (
                      <tr key={item.id}>
                        <td className="border border-gray-300">{item.data.product_name}</td>
                        <td className="border border-gray-300">{item.data.price_per_unit}</td>
                        <td className="border border-gray-300">{item.data.product_quantity}</td>
                        <td className="border border-gray-300">{item.data.quantity}</td>
                      </tr>
                    ))}
                  </TableBody>

                  {/* Total amount row */}
                  <TableFooter>
                    <tr>
                      <td colSpan={3} className="border border-gray-300 font-semibold pr-2">
                        Total Amount:
                      </td>
                      <td className="border border-gray-300 font-semibold pr-2">
                        {popupData.reduce(
                          (total, item) =>
                            total + item.data.price_per_unit * item.data.quantity,
                          0
                        )}
                      </td>
                    </tr>
                  </TableFooter>

                </Table>



                {/* Dropdown to select delivery status */}
                <div className="mt-4">
                  <label htmlFor="deliveryStatus" className="block font-semibold">
                    Delivery Status:
                  </label>
                  <Select value={deliveryStatus} onValueChange={handleValueChange}>
                    <SelectTrigger
                      className="bg-gray-200 rounded-md flex items-center justify-between px-3 py-2 text-black"
                      style={{ minWidth: '8rem' }} 
                    >
                      <span className="font-semibold pr-2">{deliveryStatus}</span>
                      <ChevronDown className="h-4 w-4 text-gray-600" />
                    </SelectTrigger>
                    <SelectContent className="mt-2">
                      <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>

                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    color="primary"
                    onClick={handleUpdateDelivery}
                    disabled={!deliveryStatus} // Disable button if delivery status is not selected
                  >
                    Update Delivery Status
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
        }
      </div >
    );
  }

