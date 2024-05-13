// Table.tsx
import React from 'react';

interface TableColumn {
  key: string;
  header: string;
}

interface TableProps {
  data: any[];
  columns: TableColumn[];
  onActionClick?: (row: any) => void;
}

const Table: React.FC<TableProps> = ({ data, columns, onActionClick }) => {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((row, index) => (
                  <tr key={index}>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                      >
                        {column.key === 'Action' ? (
                          <button
                            className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-500 hover:text-red-600 disabled:opacity-50 disabled:pointer-events-none"
                            onClick={() => onActionClick && onActionClick(row)}
                          >
                            Recruit
                          </button>
                        ) : (
                          row[column.key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;