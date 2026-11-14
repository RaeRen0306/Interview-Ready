export default function Home() {

  return (

    <main

      style={{

        minHeight: "100vh",

        display: "flex",

        flexDirection: "column",

        justifyContent: "center",

        alignItems: "center",

        backgroundColor: "#0f172a",

        color: "white",

        fontFamily: "Arial, sans-serif",

      }}

    >

      <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>

        Interview Ready

      </h1>



      <p style={{ fontSize: "1.5rem", color: "#94a3b8" }}>

        Practice. Improve. Get Hired.

      </p>



      <button

        style={{

          marginTop: "2rem",

          padding: "12px 24px",

          borderRadius: "8px",

          border: "none",

          backgroundColor: "#14b8a6",

          color: "white",

          fontSize: "1rem",

          cursor: "pointer",

        }}

      >

        Start Interview

      </button>

    </main>

  );

}