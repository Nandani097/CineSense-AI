// ── Sample IMDB Reviews ─────────────────────────────────────
const SAMPLE_REVIEWS = [
  { id:1, movie:"The Dark Knight", year:2008, genre:"Action", rating:9.0, sentiment:"positive", confidence:97, review:"An absolute masterpiece. Heath Ledger's Joker is one of cinema's greatest performances. The storytelling is layered, tense, and morally complex. Every scene feels deliberate and powerful.", keywords:["+masterpiece","+greatest","+powerful"] },
  { id:2, movie:"Inception", year:2010, genre:"Sci-Fi", rating:8.8, sentiment:"positive", confidence:94, review:"A mind-bending journey that rewards attentive viewers. Nolan's vision is unmatched — the layered dream sequences and Hans Zimmer's score create an experience unlike anything else.", keywords:["+mind-bending","+unmatched","+experience"] },
  { id:3, movie:"Morbius", year:2022, genre:"Action", rating:5.2, sentiment:"negative", confidence:91, review:"Painfully boring and poorly written. The CGI looks unfinished and the villain has zero menace. It's a soulless cash grab that wastes its talented cast completely.", keywords:["-boring","-poorly","-soulless"] },
  { id:4, movie:"Everything Everywhere All at Once", year:2022, genre:"Sci-Fi", rating:7.8, sentiment:"positive", confidence:89, review:"Chaotic, emotional, absurd and deeply touching. This film manages to be funny and heartbreaking at the same time. Truly original storytelling.", keywords:["+touching","+emotional","+original"] },
  { id:5, movie:"Transformers: Age of Extinction", year:2014, genre:"Action", rating:5.7, sentiment:"negative", confidence:88, review:"Loud, obnoxious and overlong. Three hours of explosions with paper-thin characters. The plot makes no sense and the humor falls completely flat every time.", keywords:["-obnoxious","-overlong","-flat"] },
  { id:6, movie:"Parasite", year:2019, genre:"Thriller", rating:8.6, sentiment:"positive", confidence:96, review:"A razor-sharp satire wrapped in a gripping thriller. Bong Joon-ho delivers a flawless film that transcends genre. The tension, humor, and social commentary are perfectly balanced.", keywords:["+flawless","+gripping","+perfect"] },
  { id:7, movie:"Cats", year:2019, genre:"Musical", rating:2.7, sentiment:"negative", confidence:99, review:"Horrifying. Deeply unsettling CGI combined with incoherent story and forgettable songs. This is what cinematic disaster looks like. I wanted to leave after 15 minutes.", keywords:["-horrifying","-disaster","-forgettable"] },
  { id:8, movie:"Dune", year:2021, genre:"Sci-Fi", rating:8.0, sentiment:"positive", confidence:92, review:"Visually stunning and faithfully adapted. Villeneuve builds an epic world with patience and detail. The scale is breathtaking and Zimmer's score is otherworldly.", keywords:["+stunning","+epic","+breathtaking"] },
  { id:9, movie:"Joker", year:2019, genre:"Drama", rating:8.4, sentiment:"positive", confidence:90, review:"Phoenix delivers a haunting, transformative performance. The film is dark, uncomfortable, and uncompromising. It forces you to empathize with the unempathizable.", keywords:["+haunting","+transformative","+powerful"] },
  { id:10, movie:"Suicide Squad", year:2016, genre:"Action", rating:5.9, sentiment:"negative", confidence:85, review:"A chaotic mess with no cohesion. Characters are introduced and forgotten. The editing is frantic and the villain is laughably weak. DC continues to stumble.", keywords:["-mess","-chaotic","-weak"] },
  { id:11, movie:"Oppenheimer", year:2023, genre:"Drama", rating:8.9, sentiment:"positive", confidence:95, review:"Breathtaking in scope and ambition. Cillian Murphy is phenomenal. Nolan crafts a dense, non-linear narrative that demands your full attention and rewards it generously.", keywords:["+breathtaking","+phenomenal","+ambitious"] },
  { id:12, movie:"Megan", year:2023, genre:"Horror", rating:6.3, sentiment:"positive", confidence:72, review:"More fun than expected! The film leans into its campy premise and delivers genuine entertainment. M3GAN herself is terrifying and oddly compelling.", keywords:["+fun","+entertaining","+compelling"] },
];

// ── EDA Chart Data ──────────────────────────────────────────
const EDA_DATA = {
  sentimentDist: { positive: 25000, negative: 25000 },
  reviewLengthBins: {
    labels: ["0-50","51-100","101-150","151-200","201-300","301-500","500+"],
    positive: [820,3200,5100,6800,5400,2900,780],
    negative: [1100,3600,5300,6400,5200,2700,700]
  },
  topPositiveWords: {
    labels:["great","good","best","love","wonderful","excellent","beautiful","perfect","amazing","brilliant"],
    counts:[12400,11800,10900,9800,8700,8200,7600,7100,6800,6400]
  },
  topNegativeWords: {
    labels:["bad","worst","boring","terrible","awful","waste","poor","horrible","stupid","disappointing"],
    counts:[11200,10400,9600,8900,8100,7500,7000,6600,6100,5800]
  },
  trainingHistory: {
    epochs: [1,2,3,4,5,6,7,8,9,10],
    trainAcc:  [0.62,0.74,0.81,0.85,0.88,0.90,0.91,0.92,0.93,0.932],
    valAcc:    [0.60,0.71,0.78,0.82,0.85,0.87,0.89,0.90,0.91,0.917],
    trainLoss: [0.68,0.54,0.44,0.37,0.31,0.27,0.24,0.21,0.19,0.178],
    valLoss:   [0.70,0.57,0.47,0.40,0.35,0.31,0.28,0.26,0.24,0.232]
  },
  confMatrix: { tp:11280, tn:11340, fp:660, fn:720 },
  genreSentiment: {
    labels:["Drama","Thriller","Comedy","Action","Sci-Fi","Horror","Romance","Documentary"],
    positive:[78,71,82,58,74,52,85,80],
    negative:[22,29,18,42,26,48,15,20]
  }
};

// ── Positive / Negative word banks for demo ─────────────────
const POS_WORDS = new Set(['brilliant','excellent','amazing','wonderful','fantastic','outstanding','superb','great','love','loved','perfect','beautiful','masterpiece','incredible','magnificent','awesome','best','enjoy','enjoyed','recommend','remarkable','touching','moving','compelling','exciting','hilarious','clever','thoughtful','powerful','inspiring','phenomenal','breathtaking','flawless','stunning','original','creative','gripping','thrilling','emotional','heartwarming','captivating','delightful','splendid','marvelous','terrific','glorious','charming','witty','fun','entertaining','engaging','impressive','unforgettable','timeless','masterful','insightful','profound','vivid','rich','dynamic','bold','innovative']);
const NEG_WORDS = new Set(['terrible','awful','horrible','worst','bad','boring','waste','poor','disappointing','dull','stupid','ugly','hate','hated','failed','failure','unbearable','ridiculous','pathetic','weak','mediocre','forgettable','uninspired','annoying','painful','tedious','slow','pointless','confusing','wooden','dreadful','atrocious','appalling','deplorable','disastrous','lousy','mess','chaotic','incoherent','bland','stale','flat','tiresome','dreary','vapid','shallow','lazy','clichéd','obnoxious','irritating','nonsensical','overlong','unoriginal','pretentious','soulless']);
