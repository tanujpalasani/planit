function SocialProof() {
  const stats = [
    { number: "10,000+", label: "Tasks Managed" },
    { number: "2,000+", label: "Projects Created" },
    { number: "500+", label: "Active Users" },
  ];

  return (
    <section style={{ padding: "60px 32px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: "60px" }}>
        {stats.map((stat, index) => (
          <div key={index}>
            <h2 className="gradient-text">{stat.number}</h2>
            <p style={{ color: "var(--text-secondary)" }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SocialProof;
