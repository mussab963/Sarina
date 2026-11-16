
import {
  dashboardUser,
  dashboardUsers,
} from "../services/dashboardApi";

import DashboardResource from "../components/DashboardResource";

import {
  displayValue,
  firstValue,
  formatDate,
  recordId,
} from "../utils/dashboardHelpers";

function userName(user) {
  return firstValue(user, [
    "name",
    "fullName",
    "username",
    "customerName",
  ]);
}

const columns = [
  {
    key: "id",
    title: "الرقم",
    render: (user) => (
      <strong>
        #{recordId(user) ?? "—"}
      </strong>
    ),
  },
  {
    key: "name",
    title: "الاسم",
    render: (user) => (
      <strong>
        {displayValue(userName(user))}
      </strong>
    ),
  },
  {
    key: "email",
    title: "البريد الإلكتروني",
    render: (user) => (
      <span dir="ltr">
        {displayValue(user.email)}
      </span>
    ),
  },
  {
    key: "phone",
    title: "الهاتف",
    render: (user) =>
      displayValue(
        firstValue(user, [
          "phone",
          "phoneNumber",
        ])
      ),
  },
  {
    key: "role",
    title: "الدور",
    render: (user) => (
      <span className="rounded-lg bg-[#e7f8f5] px-3 py-2 font-bold text-[#078e87]">
        {displayValue(user.role)}
      </span>
    ),
  },
  {
    key: "created",
    title: "تاريخ التسجيل",
    render: (user) =>
      formatDate(
        firstValue(user, [
          "createdAt",
          "registeredAt",
        ])
      ),
  },
];

const detailFields = [
  {
    label: "رقم المستخدم",
    value: recordId,
  },
  {
    label: "الاسم",
    value: userName,
  },
  {
    label: "البريد الإلكتروني",
    value: (user) => user.email,
  },
  {
    label: "الهاتف",
    value: (user) =>
      firstValue(user, [
        "phone",
        "phoneNumber",
      ]),
  },
  {
    label: "الدور",
    value: (user) => user.role,
  },
  {
    label: "تاريخ التسجيل",
    value: (user) =>
      formatDate(
        firstValue(user, [
          "createdAt",
          "registeredAt",
        ])
      ),
  },
];

export default function DashboardUsers() {
  return (
    <DashboardResource
      title="المستخدمون"
      subtitle="استعراض حسابات المستخدمين وتفاصيلهم (قراءة فقط)"
      singular="مستخدم"
      load={dashboardUsers}
      loadOne={dashboardUser}
      listKeys="users,customers"
      columns={columns}
      detailFields={detailFields}
      searchable={(user) =>
        [
          recordId(user),
          userName(user),
          user.email,
          user.phone,
          user.role,
        ].join(" ")
      }
    />
  );
}
