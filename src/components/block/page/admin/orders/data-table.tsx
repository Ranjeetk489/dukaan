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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  const handleCellClick = (rowData: string | any[] | TData) => {
    //@ts-expect-error
    rowData = rowData?.products;
    if (Array.isArray(rowData) && rowData.length > 0) {
      const orderKeyValue: any[] = rowData.map((item: any, index: number) => {
        const keys = [  "product_name", "price_per_unit", "product_quantity", "quantity"];
        const filteredData = Object.fromEntries(Object.entries(item).filter(([key]) => keys.includes(key)));
  
        return { id: `${item.order_id}_${index}`, data: filteredData }; 
      });
  
      setPopupData(orderKeyValue); 
      console.log(orderKeyValue, "popupData");
      setShowPopup(true);
    }
  };
  


  const handleClosePopup = () => {
    // Hide the popup
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
      {showPopup  && 
      (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-xl overflow-y-auto">
            <button
              className="absolute top-0 right-0 m-4 text-gray-500 hover:text-black"
              onClick={handleClosePopup}
            >
              Close
            </button>
            {/* color black */}
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
            <TableRow key={item.id}>
              <TableCell>{item.data.product_name}</TableCell>
              <TableCell>{item.data.price_per_unit}</TableCell>
              <TableCell>{item.data.product_quantity}</TableCell>
              <TableCell>{item.data.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
    </div>)
      
  //     && (
        // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        //   <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-xl overflow-y-auto">
        //     <button
        //       className="absolute top-0 right-0 m-4 text-gray-500 hover:text-black"
        //       onClick={handleClosePopup}
        //     >
        //       Close
        //     </button>
        //     <h2 className="text-lg font-bold mb-4">Object Details</h2>
  //           <table className="w-full">
  //           <tbody>
  // {popupData.map((item) => (
  //   <tr key={item.id}>
  //     {Object.entries(item.data).map(([key, value]) => (
  //       <React.Fragment key={key}>
  //       <td className="font-semibold pr-2 text-black">{key}:</td>
  //       <td className="text-black">{String(value)}</td>
  //       </React.Fragment>
  //     ))}
  //   </tr>
  // ))
  
//   }
// </tbody>

//             </table>
//           </div>
//         </div>
//       )
}

    </div>
  );
}

