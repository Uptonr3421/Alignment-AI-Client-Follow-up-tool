const caseStudies = [
  {
    title: "Google Face-Lift turnaround",
    outcome: "Improved local profile visibility within the first month.",
  },
  {
    title: "Landing Page conversion update",
    outcome: "Clearer offer messaging and better lead capture flow.",
  },
];

export default function WorkPage() {
  return (
    <main>
      <h1>Recent Work</h1>
      <ul>
        {caseStudies.map((study) => (
          <li key={study.title}>
            <strong>{study.title}</strong>: {study.outcome}
          </li>
        ))}
      </ul>
    </main>
  );
}
