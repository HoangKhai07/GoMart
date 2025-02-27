import React from 'react'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from '@tanstack/react-table'

const Table = ({data, column}) => {

    const table = useReactTable({
        data,
        columns: column,
        getCoreRowModel: getCoreRowModel(),
      })
  return (
    <div className="p-5">
      <table className='w-full border-collapse'>
        <thead className='bg-gray-300'>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
                <th className="border border-white">STT</th>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="border border-white ">
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
          {table.getRowModel().rows.map((row, index) => (
            <tr key={row.id}>   
                <td className="border border-gray-300 p-2">{index+1}</td>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className=" border border-gray-300 p-1">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />
    </div>
  )
}

export default Table
