"use client";

import { useMemo, useState } from "react";

type Scores = {
  future: number;
  risk: number;
  autonomy: number;
  wellbeing: number;
  social: number;
  persistence: number;
};

type Option = {
  label: string;
  detail: string;
  tradeoff: string;
  scores: Partial<Scores>;
};

type Scenario = {
  id: string;
  field: string;
  title: string;
  context: string;
  question: string;
  options: Option[];
};

const priorities = [
  ["achievement", "Achievement", "Mastery, progress, recognition"],
  ["relationships", "Relationships", "Trust, care, belonging"],
  ["freedom", "Freedom", "Agency, mobility, independence"],
  ["stability", "Stability", "Predictability, continuity, safety"],
  ["creativity", "Creativity", "Originality, expression, discovery"],
  ["security", "Financial security", "Resources, resilience, options"],
];

const scenarios: Scenario[] = [
  {
    id: "01",
    field: "Opportunity cost",
    title: "The prestigious summer",
    context:
      "You receive an internship offer from a firm that could materially improve your early career. The same twelve weeks are your last realistic chance to travel alone before graduation.",
    question: "Which use of the summer feels more defensible?",
    options: [
      {
        label: "Take the internship",
        detail: "Convert the scarce time into professional option value.",
        tradeoff:
          "You protect future access and status, while giving up an experience whose timing may be difficult to reproduce.",
        scores: { future: 2, wellbeing: -1, risk: -1 },
      },
      {
        label: "Take the journey",
        detail: "Treat exploration as a non-renewable opportunity.",
        tradeoff:
          "You preserve autonomy and lived experience, while accepting a less legible signal to future employers.",
        scores: { autonomy: 2, wellbeing: 1, risk: 1, future: -1 },
      },
      {
        label: "Negotiate a shorter placement",
        detail: "Try to preserve part of both opportunities.",
        tradeoff:
          "You reduce the sharpness of the trade-off, but risk a diluted experience and appearing less committed.",
        scores: { autonomy: 1, future: 1, persistence: 1 },
      },
    ],
  },
  {
    id: "02",
    field: "Social comparison",
    title: "A peer accelerates",
    context:
      "A close friend announces a major promotion. You are pleased for them, but the news makes your own progress feel suddenly inadequate.",
    question: "What do you do with that feeling?",
    options: [
      {
        label: "Use it as fuel",
        detail: "Set a more ambitious target this week.",
        tradeoff:
          "Comparison can supply energy and information, but may outsource your definition of enough.",
        scores: { social: 2, future: 1, wellbeing: -1 },
      },
      {
        label: "Examine the comparison",
        detail: "Separate admiration from your own priorities.",
        tradeoff:
          "Reflection may protect intrinsic motivation, though it can also soften a useful competitive signal.",
        scores: { autonomy: 2, wellbeing: 1, social: -1 },
      },
      {
        label: "Ask how they did it",
        detail: "Turn envy into practical learning.",
        tradeoff:
          "You gain information and connection, while remaining exposed to a benchmark that may not fit your values.",
        scores: { social: 1, future: 1, wellbeing: 1 },
      },
    ],
  },
  {
    id: "03",
    field: "Sunk cost",
    title: "The instrument",
    context:
      "You have practiced classical piano for nine years. You are technically accomplished, but the activity has felt empty for more than a year.",
    question: "How should the past investment affect the next year?",
    options: [
      {
        label: "Stop completely",
        detail: "Release the identity and recover the time.",
        tradeoff:
          "You avoid paying further costs for an unwanted path, but may lose a practiced source of competence and community.",
        scores: { autonomy: 2, persistence: -2, wellbeing: 1 },
      },
      {
        label: "Continue for one year",
        detail: "Test whether disciplined effort restores meaning.",
        tradeoff:
          "Persistence may reveal a temporary plateau, while another year can deepen an obligation that no longer serves you.",
        scores: { persistence: 2, future: 1, autonomy: -1 },
      },
      {
        label: "Change the relationship",
        detail: "Play informally, without exams or performance goals.",
        tradeoff:
          "You preserve the capability while relinquishing its status structure; motivation may return or fade.",
        scores: { wellbeing: 2, autonomy: 1, persistence: 1 },
      },
    ],
  },
  {
    id: "04",
    field: "Risk preference",
    title: "The asymmetric offer",
    context:
      "A small research company offers you a role with uncertain funding, unusually broad responsibility, and a 30% pay cut. Your current position is stable but narrow.",
    question: "Which uncertainty are you more willing to carry?",
    options: [
      {
        label: "Stay on the stable path",
        detail: "Protect income, reputation, and continuity.",
        tradeoff:
          "You keep downside risk low, while accepting the quieter risk of underdevelopment and regret.",
        scores: { risk: -2, future: 1, wellbeing: 0 },
      },
      {
        label: "Take the uncertain role",
        detail: "Exchange security for learning and ownership.",
        tradeoff:
          "You buy a wider range of outcomes—some transformative, some financially constraining.",
        scores: { risk: 2, autonomy: 2, future: 1 },
      },
      {
        label: "Delay and build a runway",
        detail: "Prepare financially, then pursue a similar move.",
        tradeoff:
          "Preparation lowers fragility, but the opportunity and your appetite for it may not remain.",
        scores: { future: 2, risk: 0, persistence: 1 },
      },
    ],
  },
  {
    id: "05",
    field: "Present bias",
    title: "The unstructured evening",
    context:
      "You intended to finish a demanding application tonight. You are depleted after work, and postponing it would bring immediate relief.",
    question: "What claim does your future self have on this evening?",
    options: [
      {
        label: "Finish it tonight",
        detail: "Honor the earlier commitment despite current fatigue.",
        tradeoff:
          "You protect a future option, while treating present exhaustion as a cost to absorb.",
        scores: { future: 2, persistence: 2, wellbeing: -1 },
      },
      {
        label: "Rest without guilt",
        detail: "Treat recovery as the scarce resource.",
        tradeoff:
          "Rest may improve tomorrow’s capacity, but relief can become a persuasive reason to defer again.",
        scores: { wellbeing: 2, future: -1, persistence: -1 },
      },
      {
        label: "Work for twenty minutes",
        detail: "Reduce the activation cost, then reassess.",
        tradeoff:
          "A small commitment protects momentum, though it may neither finish the task nor fully restore you.",
        scores: { future: 1, wellbeing: 1, persistence: 1 },
      },
    ],
  },
  {
    id: "06",
    field: "Loss aversion",
    title: "The concentrated position",
    context:
      "Company shares received through your job now make up 45% of your savings. Selling would lock in a meaningful loss from last year’s peak.",
    question: "Which reference point should govern the decision?",
    options: [
      {
        label: "Hold until it recovers",
        detail: "Avoid realizing the loss.",
        tradeoff:
          "You preserve the possibility of recovery, while allowing the purchase price to influence a forward-looking risk decision.",
        scores: { risk: 2, persistence: 1, future: -1 },
      },
      {
        label: "Diversify now",
        detail: "Evaluate the portfolio from today forward.",
        tradeoff:
          "You reduce concentration risk, but exchange possible recovery for the certainty of recognizing the loss.",
        scores: { risk: -1, future: 2, persistence: -1 },
      },
      {
        label: "Sell in stages",
        detail: "Reduce exposure gradually.",
        tradeoff:
          "You lower emotional and timing risk, while retaining some exposure to a company already tied to your income.",
        scores: { future: 1, risk: 0, wellbeing: 1 },
      },
    ],
  },
  {
    id: "07",
    field: "Identity",
    title: "The admired profession",
    context:
      "You are succeeding in a profession that your family deeply respects. A different field holds your attention, but starting over would change how others describe you.",
    question: "How much weight should a coherent identity receive?",
    options: [
      {
        label: "Protect the established identity",
        detail: "Deepen the path that already works.",
        tradeoff:
          "Continuity compounds expertise and trust, but can turn a social identity into a private constraint.",
        scores: { social: 2, persistence: 2, autonomy: -1 },
      },
      {
        label: "Begin again",
        detail: "Let attention, not history, define the next chapter.",
        tradeoff:
          "You reclaim authorship and curiosity, while losing status, fluency, and some social intelligibility.",
        scores: { autonomy: 2, risk: 2, persistence: -1 },
      },
      {
        label: "Run a six-month experiment",
        detail: "Test the new field before changing identities.",
        tradeoff:
          "Evidence can discipline fantasy, though divided attention may prevent either path from receiving a fair test.",
        scores: { future: 2, autonomy: 1, risk: 0 },
      },
    ],
  },
  {
    id: "08",
    field: "Scarcity",
    title: "The financial buffer",
    context:
      "You finally have six months of expenses saved. A course you have wanted for years costs one-third of that buffer and may open new work.",
    question: "What is the buffer for?",
    options: [
      {
        label: "Keep it untouched",
        detail: "Preserve protection against unknown shocks.",
        tradeoff:
          "Liquidity protects freedom under stress, while unused safety can delay investments that expand future capacity.",
        scores: { risk: -2, future: 1, wellbeing: 1 },
      },
      {
        label: "Invest in the course",
        detail: "Treat savings as capacity, not only insurance.",
        tradeoff:
          "You convert resilience into a possible opportunity, accepting that benefits are uncertain and shocks are not.",
        scores: { risk: 2, future: 2, autonomy: 1 },
      },
      {
        label: "Wait until nine months",
        detail: "Make the investment after rebuilding margin.",
        tradeoff:
          "You preserve both aims in sequence, while time itself may reduce urgency or close the opportunity.",
        scores: { future: 2, persistence: 1, risk: -1 },
      },
    ],
  },
  {
    id: "09",
    field: "Status quo bias",
    title: "The familiar city",
    context:
      "You live near close friends in a city that feels increasingly limiting. A distant city offers a role and culture that fit you better, but no existing network.",
    question: "Which form of belonging matters more?",
    options: [
      {
        label: "Stay near your people",
        detail: "Value accumulated trust over novelty.",
        tradeoff:
          "You protect relationships that cannot be instantly rebuilt, while allowing familiarity to shape the boundary of possibility.",
        scores: { social: 2, risk: -1, wellbeing: 1 },
      },
      {
        label: "Move to the new city",
        detail: "Choose environmental fit and expansion.",
        tradeoff:
          "You gain a setting aligned with your emerging self, while making closeness expensive and loneliness plausible.",
        scores: { autonomy: 2, risk: 2, social: -1 },
      },
      {
        label: "Try it for three months",
        detail: "Rent temporarily and preserve the return option.",
        tradeoff:
          "Reversibility creates information, but partial commitment can prevent the new place from becoming home.",
        scores: { future: 1, risk: 1, autonomy: 1 },
      },
    ],
  },
  {
    id: "10",
    field: "Moral preference",
    title: "The higher-paying client",
    context:
      "A client offers work that would materially improve your finances. Their business is legal, but its social effects conflict with values you often express.",
    question: "How costly should integrity be allowed to become?",
    options: [
      {
        label: "Accept the work",
        detail: "Separate professional service from endorsement.",
        tradeoff:
          "Resources can protect people and projects you value, while repeated exceptions may reshape identity through action.",
        scores: { future: 2, wellbeing: -1, autonomy: -1 },
      },
      {
        label: "Decline the work",
        detail: "Keep income aligned with stated values.",
        tradeoff:
          "You preserve coherence and agency, while placing the financial burden of principle on your future options.",
        scores: { autonomy: 2, wellbeing: 1, risk: 1 },
      },
      {
        label: "Accept with conditions",
        detail: "Limit scope and direct part of the fee elsewhere.",
        tradeoff:
          "Conditions may reduce harm and preserve resources, but can also function as moral accounting rather than resolution.",
        scores: { autonomy: 1, future: 1, social: 1 },
      },
    ],
  },
  {
    id: "11",
    field: "Commitment",
    title: "The unfinished manuscript",
    context:
      "A personal manuscript has absorbed two years. External readers are lukewarm, and revision has displaced relationships and sleep.",
    question: "When does perseverance become escalation?",
    options: [
      {
        label: "Complete and publish it",
        detail: "Finish on your own terms.",
        tradeoff:
          "Completion protects agency and learning, while more effort may be justified mainly by effort already spent.",
        scores: { persistence: 2, autonomy: 1, wellbeing: -1 },
      },
      {
        label: "Archive it",
        detail: "Let the work remain formative rather than public.",
        tradeoff:
          "You recover attention and accept the information in feedback, while giving up the value only completion can reveal.",
        scores: { wellbeing: 2, persistence: -2, future: 1 },
      },
      {
        label: "Set a final bounded revision",
        detail: "Give it six weeks, then stop regardless.",
        tradeoff:
          "A boundary reconciles commitment with evidence, but deadlines can create a rushed or emotionally artificial ending.",
        scores: { persistence: 1, future: 2, wellbeing: 1 },
      },
    ],
  },
  {
    id: "12",
    field: "Meaning & freedom",
    title: "The open year",
    context:
      "You can take a year away from conventional work without immediate financial danger. There is no guarantee the year will be productive or clarifying.",
    question: "Must freedom justify itself through an outcome?",
    options: [
      {
        label: "Take the year with a plan",
        detail: "Define projects, milestones, and a return point.",
        tradeoff:
          "Structure makes freedom legible and protects re-entry, while importing achievement logic into the space meant to question it.",
        scores: { autonomy: 1, future: 2, persistence: 1 },
      },
      {
        label: "Take the year openly",
        detail: "Allow its value to emerge without targets.",
        tradeoff:
          "Openness creates genuine discovery, while increasing the risk of drift, anxiety, and an outcome others cannot recognize.",
        scores: { autonomy: 2, risk: 2, wellbeing: 1 },
      },
      {
        label: "Keep working",
        detail: "Preserve momentum and use freedom incrementally.",
        tradeoff:
          "Continuity compounds security and competence, while the rare permission to step outside a default life may not return.",
        scores: { risk: -2, persistence: 2, future: 1 },
      },
    ],
  },
];

const emptyScores: Scores = {
  future: 0,
  risk: 0,
  autonomy: 0,
  wellbeing: 0,
  social: 0,
  persistence: 0,
};

const metricMeta: { key: keyof Scores; label: string; low: string; high: string }[] = [
  { key: "future", label: "Time horizon", low: "Present-attuned", high: "Future-weighted" },
  { key: "risk", label: "Risk posture", low: "Downside-protective", high: "Possibility-seeking" },
  { key: "autonomy", label: "Source of direction", low: "Context-responsive", high: "Self-authored" },
  { key: "wellbeing", label: "Resource allocation", low: "Goal-intensive", high: "Well-being protective" },
  { key: "social", label: "Social sensitivity", low: "Internally referenced", high: "Socially calibrated" },
  { key: "persistence", label: "Commitment style", low: "Adaptive", high: "Persevering" },
];

function normalize(value: number) {
  return Math.max(12, Math.min(88, Math.round(50 + value * 6)));
}

function Radar({ scores }: { scores: Scores }) {
  const center = 130;
  const radius = 88;
  const points = metricMeta.map((metric, index) => {
    const angle = (Math.PI * 2 * index) / metricMeta.length - Math.PI / 2;
    const r = radius * (normalize(scores[metric.key]) / 100);
    return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
  });
  const rings = [0.33, 0.66, 1].map((factor) =>
    metricMeta
      .map((_, index) => {
        const angle = (Math.PI * 2 * index) / metricMeta.length - Math.PI / 2;
        return `${center + Math.cos(angle) * radius * factor},${center + Math.sin(angle) * radius * factor}`;
      })
      .join(" ")
  );

  return (
    <svg className="radar" viewBox="0 0 260 260" role="img" aria-label="Decision profile radar chart">
      {rings.map((ring) => <polygon key={ring} points={ring} className="radar-ring" />)}
      {metricMeta.map((metric, index) => {
        const angle = (Math.PI * 2 * index) / metricMeta.length - Math.PI / 2;
        return (
          <line
            key={metric.key}
            x1={center}
            y1={center}
            x2={center + Math.cos(angle) * radius}
            y2={center + Math.sin(angle) * radius}
            className="radar-axis"
          />
        );
      })}
      <polygon points={points.join(" ")} className="radar-shape" />
      {points.map((point, i) => {
        const [x, y] = point.split(",");
        return <circle key={i} cx={x} cy={y} r="3.5" className="radar-dot" />;
      })}
    </svg>
  );
}

export default function Home() {
  const [stage, setStage] = useState<"intro" | "profile" | "experiment" | "report" | "research">("intro");
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(["freedom", "relationships", "creativity"]);
  const [lifeStage, setLifeStage] = useState("Early career");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [lastChoice, setLastChoice] = useState<number | null>(null);

  const scores = useMemo(() => {
    return answers.reduce((total, answer, scenarioIndex) => {
      const delta = scenarios[scenarioIndex].options[answer].scores;
      for (const key of Object.keys(delta) as (keyof Scores)[]) {
        total[key] += delta[key] || 0;
      }
      return total;
    }, { ...emptyScores });
  }, [answers]);

  const active = scenarios[index];
  const currentOption = lastChoice === null ? null : active.options[lastChoice];

  const togglePriority = (id: string) => {
    setSelectedPriorities((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length === 3) return [...current.slice(1), id];
      return [...current, id];
    });
  };

  const beginExperiment = () => {
    setIndex(0);
    setAnswers([]);
    setLastChoice(null);
    setStage("experiment");
  };

  const choose = (choice: number) => setLastChoice(choice);

  const next = () => {
    if (lastChoice === null) return;
    const updated = [...answers, lastChoice];
    setAnswers(updated);
    if (index === scenarios.length - 1) {
      setStage("report");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setIndex(index + 1);
      setLastChoice(null);
    }
  };

  const reset = () => {
    setStage("intro");
    setAnswers([]);
    setIndex(0);
    setLastChoice(null);
  };

  return (
    <main>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header>
        <button className="brand" onClick={reset} aria-label="Return to start">
          <span className="brand-mark"><i /><i /><i /></span>
          <span>THE-HIDDEN-VARIABLE</span>
        </button>
        <nav aria-label="Primary navigation">
          <button onClick={() => setStage("intro")} className={stage === "intro" ? "active" : ""}>Study</button>
          <button onClick={() => setStage("research")} className={stage === "research" ? "active" : ""}>Research notes</button>
          <span className="status"><b /> Protocol 01</span>
        </nav>
      </header>

      {stage === "intro" && (
        <section className="hero">
          <div className="eyebrow"><span>BEHAVIORAL STUDY 01</span><span>EST. 12 MIN</span></div>
          <div className="hero-grid">
            <div>
              <h1>What do you optimize for<br />when no option is <em>neutral?</em></h1>
              <p className="lede">
                An interactive study of decisions made where incentives, bias, identity,
                and values exert pressure in different directions.
              </p>
              <div className="hero-actions">
                <button className="primary" onClick={() => window.location.href="/about"}>Enter the lab <span>→</span></button>
                <button className="text-button" onClick={() => window.location.href="/research-notes"}>Read the research frame</button>
              </div>
              <p className="privacy"><span>◌</span> No account. Responses remain on this device.</p>
            </div>
            <div className="choice-orbit" aria-label="Abstract decision visualization">
              <div className="orbit orbit-1" />
              <div className="orbit orbit-2" />
              <div className="orbit orbit-3" />
              <div className="orbit-core"><span>CHOICE</span><strong>≠</strong><span>VERDICT</span></div>
              <span className="orbit-label label-a">INCENTIVE</span>
              <span className="orbit-label label-b">IDENTITY</span>
              <span className="orbit-label label-c">VALUES</span>
              <span className="orbit-label label-d">UNCERTAINTY</span>
            </div>
          </div>
          <div className="method-strip">
            <div><span>01</span><strong>Calibrate</strong><p>Define the values that currently carry weight.</p></div>
            <div><span>02</span><strong>Choose</strong><p>Respond to twelve consequential trade-offs.</p></div>
            <div><span>03</span><strong>Examine</strong><p>See patterns, tensions, and plausible paths.</p></div>
          </div>
        </section>
      )}

      {stage === "profile" && (
        <section className="panel profile-panel">
          <div className="step-marker">CALIBRATION <span>00 / 12</span></div>
          <div className="panel-title">
            <div>
              <p className="kicker">Before the decisions</p>
              <h2>What deserves weight<br />in a life?</h2>
            </div>
            <p>
              Select three priorities that matter most to you <em>now</em>. This is not a
              permanent identity; it is the reference point for interpreting later tensions.
            </p>
          </div>
          <div className="priority-grid">
            {priorities.map(([id, title, description], position) => {
              const selectedIndex = selectedPriorities.indexOf(id);
              return (
                <button
                  key={id}
                  className={selectedIndex >= 0 ? "priority selected" : "priority"}
                  onClick={() => togglePriority(id)}
                >
                  <span className="priority-number">0{position + 1}</span>
                  <span className="priority-copy"><strong>{title}</strong><small>{description}</small></span>
                  <span className="check">{selectedIndex >= 0 ? selectedIndex + 1 : "+"}</span>
                </button>
              );
            })}
          </div>
          <div className="profile-footer">
            <label>
              <span>Current life context</span>
              <select value={lifeStage} onChange={(e) => setLifeStage(e.target.value)}>
                <option>Student</option>
                <option>Early career</option>
                <option>Mid-career</option>
                <option>Career transition</option>
                <option>Independent / self-employed</option>
              </select>
            </label>
            <div>
              <span className="selection-count">{selectedPriorities.length} / 3 priorities selected</span>
              <button className="primary" onClick={beginExperiment} disabled={selectedPriorities.length !== 3}>
                Begin study <span>→</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {stage === "experiment" && (
        <section className="experiment">
          <div className="experiment-top">
            <div className="step-marker">EXPERIMENT <span>{String(index + 1).padStart(2, "0")} / {scenarios.length}</span></div>
            <div className="progress"><i style={{ width: `${((index + (lastChoice === null ? 0 : 1)) / scenarios.length) * 100}%` }} /></div>
          </div>
          <div className="scenario-layout">
            <aside>
              <span className="scenario-id">{active.id}</span>
              <p>{active.field}</p>
              <div className="vertical-line" />
              <small>Choose the response closest to what you would actually do—not what seems most defensible.</small>
            </aside>
            <div className="scenario-main">
              <p className="kicker">{active.field}</p>
              <h2>{active.title}</h2>
              <p className="context">{active.context}</p>
              <h3>{active.question}</h3>
              <div className="options">
                {active.options.map((option, choiceIndex) => (
                  <button
                    key={option.label}
                    className={lastChoice === choiceIndex ? "option selected" : "option"}
                    onClick={() => choose(choiceIndex)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + choiceIndex)}</span>
                    <span><strong>{option.label}</strong><small>{option.detail}</small></span>
                    <span className="option-indicator">{lastChoice === choiceIndex ? "●" : "○"}</span>
                  </button>
                ))}
              </div>
              {currentOption && (
                <div className="tradeoff">
                  <span>TRADE-OFF, NOT VERDICT</span>
                  <p>{currentOption.tradeoff}</p>
                </div>
              )}
              <div className="scenario-footer">
                <span>Your response cannot be scored as correct.</span>
                <button className="primary" disabled={lastChoice === null} onClick={next}>
                  {index === scenarios.length - 1 ? "Generate analysis" : "Commit response"} <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {stage === "report" && (
        <section className="report">
          <div className="report-head">
            <div>
              <p className="kicker">DECISION PORTRAIT / {lifeStage.toUpperCase()}</p>
              <h2>Your choices form a pattern.<br /><em>Not a diagnosis.</em></h2>
            </div>
            <p>
              This portrait describes how you allocated attention across twelve constrained
              decisions. It shows recurring trade-offs, not fixed traits.
            </p>
          </div>
          <div className="report-grid">
            <article className="radar-card">
              <div className="card-label"><span>01</span> DECISION PROFILE</div>
              <Radar scores={scores} />
              <div className="radar-legend">
                {metricMeta.map((metric) => <span key={metric.key}>{metric.label}</span>)}
              </div>
            </article>
            <article className="metrics-card">
              <div className="card-label"><span>02</span> BEHAVIORAL SIGNALS</div>
              {metricMeta.map((metric) => {
                const value = normalize(scores[metric.key]);
                return (
                  <div className="metric" key={metric.key}>
                    <div><strong>{metric.label}</strong><b>{value}</b></div>
                    <div className="metric-bar"><i style={{ width: `${value}%` }} /></div>
                    <div className="metric-poles"><span>{metric.low}</span><span>{metric.high}</span></div>
                  </div>
                );
              })}
            </article>
            <article className="value-card">
              <div className="card-label"><span>03</span> VALUE MAP</div>
              <h3>Stated values met revealed priorities.</h3>
              <div className="value-map">
                {priorities.map(([id, title], i) => {
                  const selected = selectedPriorities.includes(id);
                  const positions = [
                    ["20%", "22%"], ["60%", "16%"], ["38%", "48%"],
                    ["70%", "58%"], ["18%", "72%"], ["52%", "82%"],
                  ];
                  return (
                    <span
                      key={id}
                      className={selected ? "value-node selected" : "value-node"}
                      style={{ left: positions[i][0], top: positions[i][1] }}
                    >
                      {title}
                    </span>
                  );
                })}
              </div>
              <p>
                Your declared priorities are highlighted. Their distance is intentionally
                unresolved: values become informative when a decision makes them compete.
              </p>
            </article>
            <article className="interpretation-card">
              <div className="card-label"><span>04</span> INTERPRETATION</div>
              <h3>{normalize(scores.autonomy) > 58 ? "You tend to preserve authorship." : "You tend to keep context in the room."}</h3>
              <p>
                {normalize(scores.autonomy) > 58
                  ? "Across identity, work, and place, you often accepted uncertainty to retain control over direction."
                  : "Across identity, work, and place, you often treated obligations and existing relationships as legitimate evidence."}
                {" "}
                {normalize(scores.future) > 58
                  ? "You also gave future option value substantial weight, even when the present cost was concrete."
                  : "Immediate experience and present capacity remained visible rather than being automatically subordinated to later rewards."}
              </p>
              <div className="tension">
                <span>PRIMARY TENSION</span>
                <strong>{normalize(scores.wellbeing) > 55 ? "Meaning ↔ Momentum" : "Achievement ↔ Recovery"}</strong>
                <p>The pattern is productive precisely because neither side can be removed without loss.</p>
              </div>
            </article>
          </div>
          <div className="paths">
            <div className="card-label"><span>05</span> POSSIBLE FUTURE PATHS</div>
            <h3>Three trajectories implicit in your choices</h3>
            <div className="path-grid">
              <div><span>PATH A</span><strong>Compound</strong><p>Protect accumulated capital and deepen the capabilities already earning trust.</p><small>LOWER VARIANCE · HIGH CONTINUITY</small></div>
              <div className="featured"><span>PATH B</span><strong>Rebalance</strong><p>Preserve a stable base while running bounded experiments at the edge of identity.</p><small>MODERATE VARIANCE · HIGH LEARNING</small></div>
              <div><span>PATH C</span><strong>Reauthor</strong><p>Accept visible discontinuity to align work, place, and attention with emerging values.</p><small>HIGHER VARIANCE · HIGH AUTONOMY</small></div>
            </div>
            <p className="path-note">These are not predictions or recommendations. They expose different costs already present in your response pattern.</p>
          </div>
          <div className="report-actions">
            <button className="text-button" onClick={reset}>Restart study</button>
            <button className="primary" onClick={() => setStage("research")}>View aggregate patterns <span>→</span></button>
          </div>
        </section>
      )}

      {stage === "research" && (
        <section className="research">
          <div className="research-head">
            <p className="kicker">RESEARCH NOTES / LIVE SYNTHETIC DATASET</p>
            <h2>Decision-making<br />under <em>uncertainty.</em></h2>
            <p>
              The-Hidden-Variable examines how people allocate scarce attention, time,
              identity, and security when economically rational options conflict with
              psychological needs and personal values.
            </p>
          </div>
          <div className="research-grid">
            <article className="theory">
              <div className="card-label"><span>01</span> THE RESEARCH FRAME</div>
              <div><strong>ECONOMICS</strong><p>What is forgone? Which risks, future rewards, and irreversible costs enter the choice?</p></div>
              <div><strong>PSYCHOLOGY</strong><p>Which reference points, identities, comparisons, and motivational forces shape perception?</p></div>
              <div><strong>PHILOSOPHY</strong><p>What is the decision ultimately for—and who has authority to define a successful outcome?</p></div>
            </article>
            <article className="sample">
              <div className="card-label"><span>02</span> ANONYMOUS SAMPLE</div>
              <div className="sample-number">2,418 <span>completed protocols</span></div>
              <div className="sample-row"><span>Median completion</span><strong>10m 42s</strong></div>
              <div className="sample-row"><span>Most revisited scenario</span><strong>Sunk cost</strong></div>
              <div className="sample-row"><span>Highest response variance</span><strong>Open year</strong></div>
              <p className="synthetic">Illustrative aggregate data for this prototype. No responses are transmitted.</p>
            </article>
          </div>
          <div className="aggregate">
            <div className="card-label"><span>03</span> AGGREGATE PATTERNS</div>
            <div className="aggregate-head"><h3>What participants protected</h3><span>SHARE OF RESPONSES</span></div>
            {[
              ["Future option value", 67],
              ["Personal autonomy", 62],
              ["Financial downside", 54],
              ["Relational continuity", 48],
              ["Present well-being", 43],
              ["Existing identity", 31],
            ].map(([label, value]) => (
              <div className="aggregate-row" key={label}>
                <span>{label}</span><div><i style={{ width: `${value}%` }} /></div><strong>{value}%</strong>
              </div>
            ))}
          </div>
          <div className="research-footer">
            <p>
              <strong>Methodological caution.</strong> Scenarios reveal responses to framed,
              hypothetical trade-offs. They do not measure stable personality, predict conduct,
              or establish causal relationships.
            </p>
            <button className="primary" onClick={() => setStage("profile")}>Enter the study <span>→</span></button>
          </div>
        </section>
      )}

      <footer>
        <span>THE-HIDDEN-VARIABLE</span>
        <span>BEHAVIORAL ECONOMICS × PSYCHOLOGY × PHILOSOPHY</span>
        <span>PROTOTYPE / 2026</span>
      </footer>
    </main>
  );
}
