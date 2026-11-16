
import {
  dashboardCompanies,
  dashboardCreateCompany,
  dashboardDeleteCompany,
  dashboardUpdateCompany,
} from "../services/dashboardApi";

import DashboardResource from "../components/DashboardResource";

import {
  displayValue,
  firstValue,
  recordId,
} from "../utils/dashboardHelpers";

// السيرفر يقبل اسم الشركة.
// الحقول phone و email و description
// تم رفضها في استجابة POST السابقة.
const fields = [
  {
    name: "name",
    label: "اسم شركة النقل",
    type: "text",
    required: true,
  },
];

const emptyForm = {
  name: "",
};

// الحفاظ على عرض البيانات القديمة إن وُجدت
const columns = [
  {
    key: "id",
    title: "الرقم",
    render: (company) => (
      <strong>
        #{recordId(company) ?? "—"}
      </strong>
    ),
  },
  {
    key: "name",
    title: "شركة النقل",
    render: (company) => (
      <strong>
        {displayValue(
          firstValue(company, [
            "name",
            "companyName",
            "nameAr",
          ])
        )}
      </strong>
    ),
  },
  {
    key: "phone",
    title: "الهاتف",
    render: (company) =>
      displayValue(
        firstValue(company, [
          "phone",
          "phoneNumber",
          "contactPhone",
        ])
      ),
  },
  {
    key: "email",
    title: "البريد",
    render: (company) =>
      displayValue(
        firstValue(company, [
          "email",
          "contactEmail",
        ])
      ),
  },
  {
    key: "description",
    title: "الوصف",
    render: (company) => (
      <span className="line-clamp-2 max-w-[290px]">
        {displayValue(
          firstValue(company, [
            "description",
            "about",
          ])
        )}
      </span>
    ),
  },
];

const detailFields = [
  {
    label: "رقم الشركة",
    value: recordId,
  },
  {
    label: "الاسم",
    value: (company) =>
      firstValue(company, [
        "name",
        "companyName",
        "nameAr",
      ]),
  },
  {
    label: "الهاتف",
    value: (company) =>
      firstValue(company, [
        "phone",
        "phoneNumber",
        "contactPhone",
      ]),
  },
  {
    label: "البريد",
    value: (company) =>
      firstValue(company, [
        "email",
        "contactEmail",
      ]),
  },
  {
    label: "الوصف",
    value: (company) =>
      firstValue(company, [
        "description",
        "about",
      ]),
  },
];

function formFrom(company) {
  return {
    name: String(
      firstValue(company, [
        "name",
        "companyName",
        "nameAr",
      ]) ?? ""
    ),
  };
}

// بيانات POST /companies و PATCH /companies/:id
function makePayload(form) {
  const name = String(
    form.name ?? ""
  ).trim();

  if (!name) {
    throw new Error("اسم الشركة مطلوب.");
  }

  return {
    name,
  };
}

export default function DashboardCompanies() {
  return (
    <DashboardResource
      title="شركات النقل"
      subtitle="إدارة الشركات المسجلة على سيرفر سيرنا"
      singular="شركة نقل"
      load={dashboardCompanies}
      create={dashboardCreateCompany}
      update={dashboardUpdateCompany}
      remove={dashboardDeleteCompany}
      listKeys="companies"
      columns={columns}
      detailFields={detailFields}
      fields={fields}
      emptyForm={emptyForm}
      formFrom={formFrom}
      makePayload={makePayload}
      searchable={(company) =>
        [
          recordId(company),
          company.name,
          company.companyName,
          company.phone,
          company.email,
        ].join(" ")
      }
    />
  );
}