export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: "250px",
          padding: "20px",
          borderRight: "1px solid gray",
        }}
      >
        <h2>Interview Ready</h2>

        <a href="/dashboard">Dashboard</a>
        <br />

        <a href="/dashboard/interview">Start Interview</a>
        <br />

        <a href="/dashboard/resume">Resume Center</a>
        <br />

        <a href="/dashboard/progress">Progress</a>
        <br />

        <a href="/dashboard/settings">Settings</a>
      </div>

      <div style={{ padding: "20px" }}>
        {children}
      </div>
    </div>
  );
}