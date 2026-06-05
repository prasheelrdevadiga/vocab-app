// lib/wordList.js

export const WORD_CATEGORIES = {
  everyday: {
    label: "🏠 Everyday Talk",
    desc: "Common daily life words",
    words: [
      "grateful","patient","reliable","sincere","flexible","cheerful","polite",
      "cautious","curious","generous","honest","humble","kind","loyal","modest",
      "optimistic","persistent","responsible","thoughtful","tolerant","vivid",
      "adequate","blunt","candid","capable","confident","decent","diligent",
      "eager","efficient","energetic","faithful","gentle","gracious","handy",
      "independent","intuitive","jovial","keen","lively","mature","nurturing",
      "practical","punctual","rational","sensible","steady","tender","unique",
      "vibrant","warm","zealous","abundant","aware","balanced","calm","caring",
      "clear","composed","content","creative","dedicated","earnest","fair",
      "focused","frank","free","giving","good","happy","healthy","helpful",
      "hopeful","joyful","mindful","natural","noble","peaceful","proud","quiet",
      "safe","smart","strong","sweet","tidy","tough","true","wise","brave",
      "clean","clever","early","firm","glad","neat","nice","open","plain",
      "pure","real","rich","sharp","shy","soft","still","thin","wild","able",
      "active","alert","alive","aware","basic","bold","busy","cool","deep",
      "fair","fit","fresh","funny","great","hard","huge","jolly","just","lazy",
      "light","little","lost","lucky","mad","main","mean","mild","new","next",
      "odd","old","pale","pink","poor","rare","raw","red","ripe","rude","sad",
      "same","sick","slim","small","sour","spare","tall","thick","tight","tiny",
      "ugly","used","vague","vast","weak","weird","well","wet","wide","wrong",
    ],
  },
  casual: {
    label: "😎 Casual Talk",
    desc: "Relaxed informal conversations",
    words: [
      "spontaneous","quirky","whimsical","banter","witty","amusing","bold",
      "breezy","bubbly","carefree","charismatic","charming","clever","colorful",
      "comical","daring","dazzling","eccentric","entertaining","enthusiastic",
      "exciting","feisty","flamboyant","funky","goofy","gutsy","hilarious",
      "imaginative","impulsive","irreverent","lighthearted","mischievous",
      "offbeat","outgoing","outspoken","playful","sassy","savvy","snappy",
      "spunky","suave","trendy","unconventional","upbeat","vivacious","wacky",
      "zany","adventurous","animated","brash","casual","cheeky","dynamic",
      "easy-going","free-spirited","gregarious","hyper","impromptu","informal",
      "laidback","nonchalant","peppy","perky","rambunctious","rowdy","spirited",
      "sprightly","unfiltered","unscripted","unpretentious","unreserved",
      "unrestrained","youthful","zesty","approachable","boisterous","candid",
      "chatty","chipper","convivial","exuberant","flippant","folksy","friendly",
      "fun-loving","genial","good-humored","happy-go-lucky","jolly","jovial",
      "laid-back","merry","personable","relaxed","sociable","sunny","talkative",
      "uninhibited","warm","welcoming","affable","airy","amicable","blithe",
      "bouncy","capricious","comfortable","cool","cordial","droll","ebullient",
      "effervescent","scintillating","facetious","waggish","jocular","whimsy",
      "iconoclastic","nonconformist","bohemian","maverick","insouciant","zestful",
      "vivid","rhapsodic","ecstatic","euphoric","elated","exhilarated","jubilant",
      "rapturous","enthralled","captivated","enchanted","spellbound","mesmerized",
    ],
  },
  office: {
    label: "💼 Office Talk",
    desc: "Professional workplace vocabulary",
    words: [
      "collaborate","delegate","facilitate","implement","leverage","optimize",
      "prioritize","streamline","strategize","synthesize","accelerate","achieve",
      "allocate","analyze","articulate","assess","benchmark","brainstorm",
      "champion","clarify","communicate","coordinate","cultivate","deadline",
      "debrief","decisive","deploy","develop","differentiate","document",
      "drive","empower","evaluate","execute","expedite","forecast","formulate",
      "govern","guide","identify","initiative","innovate","integrate","iterate",
      "launch","manage","measure","mentor","milestone","mobilize","monitor",
      "motivate","negotiate","network","organize","oversee","perform","present",
      "produce","project","promote","propose","recommend","report","resolve",
      "review","revise","scale","schedule","scope","structure","summarize",
      "support","sustain","target","transform","update","validate","visualize",
      "alignment","bandwidth","capacity","deliverable","ecosystem","framework",
      "headcount","holistic","incentive","metric","paradigm","pipeline","roadmap",
      "accountability","adaptability","agility","autonomy","clarity","cohesion",
      "commitment","competency","compliance","consistency","continuity","creativity",
      "efficiency","engagement","excellence","execution","feedback","flexibility",
      "governance","growth","impact","inclusion","innovation","integrity","leadership",
      "ownership","performance","planning","productivity","professionalism","quality",
      "reliability","scalability","stakeholder","sustainability","synergy","talent",
      "teamwork","transparency","trust","velocity","vision","workflow","workload",
      "acumen","strategic","visionary","transformative","disruptive","systematic",
      "analytical","empirical","evidence-based","data-driven","outcome-oriented",
      "fiduciary","monetization","feasibility","benchmarking","forecasting","pivot",
    ],
  },
  friends: {
    label: "👫 Friend Talk",
    desc: "Words for talking with close friends",
    words: [
      "candid","empathetic","nostalgic","vulnerable","genuine","supportive",
      "affectionate","appreciative","attentive","cherish","comfortable",
      "compassionate","confide","connected","devoted","emotional","encouraging",
      "endearing","faithful","fond","forgiving","heartfelt","intimate","meaningful",
      "reassuring","relatable","reminisce","tender","transparent","trustworthy",
      "wholehearted","accepting","amicable","camaraderie","considerate","dependable",
      "empathize","fellowship","goodwill","gracious","harmonious","kindhearted",
      "loving","mellow","mutual","nurturing","obliging","pleasant","receptive",
      "respectful","selfless","sociable","sympathetic","tactful","unselfish",
      "warmhearted","welcoming","accommodating","amiable","benevolent","charitable",
      "committed","communicative","cooperative","easygoing","flexible","friendly",
      "fulfilling","generous","grounded","helpful","honest","humble","inclusive",
      "inspiring","joyful","loyal","mindful","open","patient","peaceful","positive",
      "principled","reliable","resilient","secure","self-aware","sensitive","sincere",
      "uplifting","vibrant","wholesome","willing","magnanimous","altruistic",
      "equanimous","philanthropic","sentimental","melancholic","wistful","bittersweet",
      "poignant","steadfast","abiding","enduring","unconditional","authentic",
      "intimate","profound","precious","treasured","beloved","adored","esteemed",
      "validated","understood","embraced","included","empowered","nourished","restored",
    ],
  },
  group: {
    label: "🎤 Group Talk",
    desc: "Speaking in meetings or groups",
    words: [
      "articulate","assertive","concise","compelling","persuasive","eloquent",
      "authoritative","charismatic","coherent","confident","constructive",
      "contributive","credible","deliberate","diplomatic","direct","effective",
      "engaging","expressive","fluent","forceful","forthright","impactful",
      "inclusive","influential","informative","insightful","logical","measured",
      "mediate","moderate","motivating","objective","opinionated","organized",
      "outspoken","precise","proactive","prominent","purposeful","relevant",
      "respectful","rhetorical","structured","substantive","succinct","tactical",
      "transparent","unambiguous","vocal","accessible","balanced","collaborative",
      "composed","decisive","definitive","dynamic","empowering","enthusiastic",
      "focused","grounded","intentional","methodical","mindful","neutral","nuanced",
      "open-minded","participative","poised","polished","prepared","professional",
      "rational","receptive","responsive","solution-focused","strategic","systematic",
      "team-oriented","thorough","thoughtful","trustworthy","visionary","wise",
      "perspicacious","circumspect","judicious","sagacious","astute","discerning",
      "conciliatory","arbitrating","facilitating","synthesizing","harmonizing",
      "orchestrating","adjudicating","deliberating","contemplating","hypothesizing",
      "conceptualizing","empirical","paradigmatic","methodological","dialectical",
      "nuanced","multifaceted","contextual","analytical","evaluative","integrative",
    ],
  },
};

export const ALL_CATEGORIES = Object.keys(WORD_CATEGORIES);

// Get total word count for a category (or custom list)
export function getCategoryWordCount(category) {
  if (category === "custom") return 0; // handled separately
  return WORD_CATEGORIES[category]?.words?.length || 0;
}

// Get next unseen word from a category
export function getNextWord(category, seenWords = []) {
  if (category === "custom") return null; // handled by custom list logic
  const words = WORD_CATEGORIES[category]?.words || WORD_CATEGORIES.everyday.words;
  const unseen = words.filter(w => !seenWords.includes(w.toLowerCase()));
  if (unseen.length === 0) return null; // all words seen!
  return unseen[Math.floor(Math.random() * unseen.length)];
}