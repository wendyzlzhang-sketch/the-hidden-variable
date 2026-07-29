export default function Study() {
  return (
    <main className="min-h-screen bg-black text-white p-12">

      <h1 className="text-5xl mb-8">
        Scenario 01
      </h1>

      <p className="text-gray-400 max-w-2xl">
        You are facing a decision where no option is completely neutral.
        Choose the option that best represents your preference.
      </p>

      <div className="mt-12 space-y-6">

        <button className="border border-gray-700 p-6 w-full text-left">
          Option A
          <br/>
          Immediate security and stability
        </button>

        <button className="border border-gray-700 p-6 w-full text-left">
          Option B
          <br/>
          Greater uncertainty with future possibility
        </button>

      </div>

    </main>
  )
}
