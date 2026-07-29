export default function About() {
  return (
    <main className="min-h-screen bg-black text-white p-12">

      <div className="max-w-5xl">

        <p className="text-lime-400 tracking-[0.3em] text-sm mb-8">
          RESEARCHER PROFILE
        </p>

        <h1 className="text-6xl mb-10">
          Behind
          <br />
          The Hidden Variable
        </h1>

        <p className="text-gray-300 text-xl leading-relaxed max-w-3xl">
          The Hidden Variable is an independent research project exploring
          how people make decisions when choices are uncertain.
        </p>


        <section className="mt-16 space-y-8">

          <div>
            <h2 className="text-2xl mb-3">
              Research Motivation
            </h2>

            <p className="text-gray-400">
              Many decisions appear rational on the surface,
              yet are influenced by identity, incentives,
              uncertainty, and personal values.
            </p>
          </div>


          <div>
            <h2 className="text-2xl mb-3">
              Research Approach
            </h2>

            <p className="text-gray-400">
              This project combines behavioral economics,
              psychology, and interactive technology to study
              decision-making under ambiguity.
            </p>
          </div>


        </section>

      </div>

    </main>
  )
}
          
