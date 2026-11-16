
export default function DashboardTable({
  columns,
  rows,
  loading = false,
  emptyText = "لا توجد بيانات للعرض.",
  getKey = (item, index) => item?.id ?? index,
}) {
  if (loading) {
    return (
      <div className="p-12 text-center text-sm text-[#8197a3]">
        جاري تحميل البيانات...
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="p-12 text-center text-sm text-[#8197a3]">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[770px] text-right">
        <thead className="bg-[#f7fafb] text-[11px] text-[#718b99]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-5 py-4 font-bold"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-[#edf2f4]">
          {rows.map((item, index) => (
            <tr
              key={getKey(item, index)}
              className="transition hover:bg-[#f8fbfb]"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-5 py-4 text-xs text-[#103a4e]"
                >
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
