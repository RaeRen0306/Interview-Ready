export default function Interview() {
  return (
    <div>
      <h1>Start Interview</h1>

      <p>Choose the type of interview you want to practice.</p>

      <a href="/dashboard/interview/behavioral">
        <button
          style={{
            padding: "12px 20px",
            width: "250px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Behavioral Interview
        </button>
      </a>

      <br />
      <br />
 <a href="/dashboard/interview/technical">
        <button
          style={{
            padding: "12px 20px",
            width: "250px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Technical Interview
        </button>
      </a>
            <br />
      <br />
<a href="/dashboard/interview/custom">
      <button
        style={{
          padding: "12px 20px",
          width: "250px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Custom Interview
      </button>
      </a>
    </div>
  );
}