export default function ResearchNotes() {
  return (
    <main className="min-h-screen bg-black text-white p-12">

      <h1 className="text-5xl mb-8">
        Research Notes
      </h1>

      <p className="max-w-3xl text-gray-300">
        The Hidden Variable explores how economic incentives,
        psychological biases, identity, and values influence
        human decisions under uncertainty.
      </p>


      <div className="mt-12 space-y-10">

        <section>
          <h2 className="text-2xl">
            01 — Prospect Theory
          </h2>
          <p>
            People often evaluate gains and losses differently.
            Decisions are shaped by perceived risk rather than
            pure rational calculation.
          </p>
        </section>


        <section>
          <h2 className="text-2xl">
            02 — Cognitive Bias
          </h2>
          <p>
            Human judgment is influenced by framing,
            uncertainty, and mental shortcuts.
          </p>
        </section>


        <section>
          <h2 className="text-2xl">
            03 — Identity and Values
          </h2>
          <p>
            Choices reflect not only incentives,
            but also personal beliefs and identity.
          </p>
        </section>

      </div>

    </main>
  );
}
