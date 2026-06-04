// import DashboardLayout from "../layouts/DashboardLayout";

// export default function AdminDashboard() {
//   return (
//     <DashboardLayout
//       title="System Admin"
//       links={[
//         { to: "/dashboard/admin", label: "Overview", end: true },
//         { to: "/dashboard/admin/users", label: "Manage Users" },
//         { to: "/dashboard/admin/venues", label: "Manage Venues" },
//       ]}
//     />
//   );
// }

import DashboardLayout from "../layouts/DashboardLayout";

export default function AdminDashboard() {
  return (
    <DashboardLayout
      title="System Admin"
      links={[
        {
          to: "/dashboard/admin",
          label: "Overview",
          end: true,
        },

        {
          to: "/dashboard/admin/users",
          label: "Manage Users",
        },

        {
          to: "/dashboard/admin/venues",
          label: "Manage Venues",
        },

        // NEW
        {
          to: "/dashboard/admin/manage-events",
          label: "Manage Events",
        },
      ]}
    />
  );
}



