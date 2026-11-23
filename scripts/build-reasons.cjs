const fs = require('fs');

// We will construct 365 unique, beautifully crafted romantic reasons
const reasonsData = [
  // 1-10
  { day: 1, category: 'feelings', text: "I love how you can make even my most ordinary days feel completely magical and special." },
  { day: 2, category: 'feelings', text: "I love how I can be completely, unfiltered myself around you without fear of judgment." },
  { day: 3, category: 'habits', text: "I love the little things you do every day without even realising how much they mean to me." },
  { day: 4, category: 'smile', text: "I love the crinkles that form at the corners of your eyes whenever you let out a genuine belly laugh." },
  { day: 5, category: 'kindness', text: "I love how patient you are with me when I get overwhelmed and don't know how to explain what I'm feeling." },
  { day: 6, category: 'personality', text: "I love your gentle sense of humor and how easily you can lighten the heaviest mood in a room." },
  { day: 7, category: 'memories', text: "I love remembering the exact moment I realized I was falling head-over-heels in love with you." },
  { day: 8, category: 'efforts', text: "I love how you always make an effort to understand my perspective, even during our silly disagreements." },
  { day: 9, category: 'habits', text: "I love the way you unconsciously search for my hand whenever we walk side by side in public." },
  { day: 10, category: 'feelings', text: "I love the comforting warmth of your chest when you pull me into a deep, tight embrace after a long day." },

  // 11-20
  { day: 11, category: 'admiration', text: "I love how fiercely passionate you get when you talk about the dreams and projects you care about." },
  { day: 12, category: 'smile', text: "I love that discreet, knowing half-smile you send me from across a crowded room." },
  { day: 13, category: 'kindness', text: "I love the gentle and respectful way you treat waiters, cashiers, and anyone serving us." },
  { day: 14, category: 'habits', text: "I love how you always kiss my forehead before leaving or when saying goodnight." },
  { day: 15, category: 'imperfections', text: "I love how playfully stubborn you are when you're convinced you know a faster shortcut." },
  { day: 16, category: 'feelings', text: "I love that hearing your voice after a chaotic day instantly settles my racing thoughts." },
  { day: 17, category: 'personality', text: "I love your quiet resilience—you face life's storms with steady courage rather than panic." },
  { day: 18, category: 'memories', text: "I love that rainy day we stayed indoors in our pajamas, sharing secrets and forgetting about time." },
  { day: 19, category: 'admiration', text: "I love your sharp intellect and the fascinating discussions we have about everything under the stars." },
  { day: 20, category: 'future', text: "I love picturing lazy Sunday mornings with you in our future kitchen, brewing coffee and making pancakes." },

  // 21-30
  { day: 21, category: 'efforts', text: "I love how hard you work toward your goals, never taking shortcuts or compromising your morals." },
  { day: 22, category: 'habits', text: "I love the sleepy rasp in your voice when you answer my morning calls half-awake." },
  { day: 23, category: 'kindness', text: "I love how you notice the smallest changes in my mood, even before I realize I'm feeling down." },
  { day: 24, category: 'personality', text: "I love that you are both my greatest adventure and my safest haven." },
  { day: 25, category: 'smile', text: "I love the way your lips curl up into a proud grin whenever you surprise me with something I love." },
  { day: 26, category: 'imperfections', text: "I love how you get intensely focused on a new hobby or video game and lose all track of the world." },
  { day: 27, category: 'feelings', text: "I love how secure and cherished you make me feel, with no games, doubts, or second guesses." },
  { day: 28, category: 'memories', text: "I love our very first date and how nervous we both were, trying so hard to impress each other." },
  { day: 29, category: 'habits', text: "I love how you tuck stray strands of hair behind my ear when I'm looking away." },
  { day: 30, category: 'future', text: "I love knowing that no matter what twists and turns the future brings, we will navigate them as a team." },

  // 31-40
  { day: 31, category: 'personality', text: "I love your integrity; you do the honorable thing even when nobody is looking." },
  { day: 32, category: 'efforts', text: "I love that you remember the random little snacks and treats I mentioned liking weeks ago." },
  { day: 33, category: 'feelings', text: "I love how your hand fits perfectly in mine, like two puzzle pieces designed by fate." },
  { day: 34, category: 'smile', text: "I love catching you smiling to yourself while reading a text message from me." },
  { day: 35, category: 'kindness', text: "I love how you always make sure I've eaten and rested properly whenever I'm stressed." },
  { day: 36, category: 'imperfections', text: "I love the adorably clumsy way you dance in the living room just to make me burst out laughing." },
  { day: 37, category: 'admiration', text: "I love how humble you remain about your accomplishments, letting your quiet work speak for itself." },
  { day: 38, category: 'memories', text: "I love that late-night car drive with the windows down, singing along to our favorite songs at the top of our lungs." },
  { day: 39, category: 'habits', text: "I love how you always wrap your arm around me to pull me closer when we're asleep." },
  { day: 40, category: 'future', text: "I love the thought of exploring foreign cities with you, getting lost together in little cobblestone streets." },

  // 41-50
  { day: 41, category: 'personality', text: "I love your curious mind and how you're never afraid to ask questions to learn something new." },
  { day: 42, category: 'efforts', text: "I love that you never let our romance become routine; you still court me like we just met." },
  { day: 43, category: 'feelings', text: "I love how you make me feel like the most gorgeous and desired woman on the planet." },
  { day: 44, category: 'smile', text: "I love your contagious laugh that can instantly transform a gloomy day into pure sunshine." },
  { day: 45, category: 'kindness', text: "I love the way you speak about your family and friends with genuine loyalty and warmth." },
  { day: 46, category: 'habits', text: "I love how you meticulously check the car mirrors and doors twice to keep us safe." },
  { day: 47, category: 'admiration', text: "I love your determination—when life throws you a setback, you dust yourself off and try again." },
  { day: 48, category: 'imperfections', text: "I love how competitive you get during casual board games, acting like a championship is on the line." },
  { day: 49, category: 'memories', text: "I love the memory of our first kiss and how time seemed to completely freeze for those few seconds." },
  { day: 50, category: 'future', text: "I love imagining our future home filled with plants, laughter, cozy blankets, and love." }
];

// Let's populate the remaining 51-365 systematically with rich, authentic romantic lines
const categoryPool = [
  'personality', 'smile', 'habits', 'kindness', 'efforts',
  'imperfections', 'memories', 'feelings', 'admiration', 'future'
];

const poolItems = [
  // 51-60
  { cat: 'personality', text: "I love your ability to stay calm and grounded when life feels like total chaos." },
  { cat: 'habits', text: "I love how you always make sure my phone is charging before we go to sleep." },
  { cat: 'smile', text: "I love that dimple on your cheek that only shows up when you grin playfully." },
  { cat: 'kindness', text: "I love how you stop to pet every friendly dog we walk past on the street." },
  { cat: 'efforts', text: "I love how you listened to my favorite songs just so you could understand the lyrics I quote." },
  { cat: 'imperfections', text: "I love the funny face you make when you try to swallow bitter medicine." },
  { cat: 'feelings', text: "I love how safe and protected I feel just walking beside you in the dark." },
  { cat: 'memories', text: "I love the time we got caught in a sudden downpour and ran laughing under a storefront awning." },
  { cat: 'admiration', text: "I love your emotional maturity and willingness to talk through sensitive topics calmly." },
  { cat: 'future', text: "I love that when I picture myself in thirty years, your face is the one right beside mine." },

  // 61-70
  { cat: 'habits', text: "I love how you always switch places with me so I walk on the inside of the sidewalk." },
  { cat: 'personality', text: "I love your dry wit that catches me completely off guard and makes me laugh for ten minutes." },
  { cat: 'smile', text: "I love how your eyes soften with pure affection when you look up and catch me staring at you." },
  { cat: 'kindness', text: "I love that you never make me feel silly for crying during emotional movies." },
  { cat: 'efforts', text: "I love that you learned how I take my morning tea and always brew it without asking." },
  { cat: 'imperfections', text: "I love how you pretend you're not tired while your heavy eyelids are already closing." },
  { cat: 'feelings', text: "I love the butterflies you still give me, even after all this time together." },
  { cat: 'memories', text: "I love that sunset at the beach when we sat silently shoulder to shoulder, just holding hands." },
  { cat: 'admiration', text: "I love how deeply loyal you are to the people who hold a place in your heart." },
  { cat: 'future', text: "I love knowing that we are building a life story that our future selves will look back on with smiles." },

  // 71-80
  { cat: 'habits', text: "I love how you subconsciously bite your lip when you're working through a tricky problem." },
  { cat: 'personality', text: "I love how open-minded you are, always ready to see things from someone else's shoes." },
  { cat: 'smile', text: "I love that goofy grin you wear when you know you've just told a cheesy dad joke." },
  { cat: 'kindness', text: "I love how you check in on me during busy workdays with a simple 'Thinking of you ❤️'." },
  { cat: 'efforts', text: "I love how you drive carefully and calmly whenever I'm in the passenger seat." },
  { cat: 'imperfections', text: "I love how you can't resist singing the wrong lyrics with complete and utter confidence." },
  { cat: 'feelings', text: "I love that in a world of constant noise, being with you feels like peace and sanctuary." },
  { cat: 'memories', text: "I love the memory of cooking our first dinner together, making a giant mess, and loving every bite." },
  { cat: 'admiration', text: "I love how principled you are—your word is your bond, and you always follow through." },
  { cat: 'future', text: "I love imagining us having our own traditions for every holiday and anniversary." },

  // 81-90
  { cat: 'habits', text: "I love the sweet little sigh you let out right before you drift off into deep sleep." },
  { cat: 'personality', text: "I love that you are both playful like a kid and protective like a guardian." },
  { cat: 'smile', text: "I love the radiant smile you give me at the airport arrivals gate when we reunite." },
  { cat: 'kindness', text: "I love how you comfort me with actions rather than empty clichés when I'm hurting." },
  { cat: 'efforts', text: "I love that you take the time to send me good morning texts to start my day with love." },
  { cat: 'imperfections', text: "I love how you lose your keys in the most obvious spots and search the whole apartment." },
  { cat: 'feelings', text: "I love how proud I feel every single time I introduce you as my boyfriend." },
  { cat: 'memories', text: "I love that spontaneous midnight road trip to get ice cream when neither of us could sleep." },
  { cat: 'admiration', text: "I love the respect and kindness you show toward older people and children." },
  { cat: 'future', text: "I love dreaming about the places we will pin on our world travel map together." },

  // 91-100
  { cat: 'habits', text: "I love how you adjust the room temperature or pull the blanket over my shoulders when it gets chilly." },
  { cat: 'personality', text: "I love your optimistic outlook on life—you always look for the silver lining in tough times." },
  { cat: 'smile', text: "I love the subtle smirk you give me when you catch me admiring you in your favorite shirt." },
  { cat: 'kindness', text: "I love how you cheer for my small victories with as much enthusiasm as your own." },
  { cat: 'efforts', text: "I love that you never complain when carrying heavy grocery bags or luggage for me." },
  { cat: 'imperfections', text: "I love your dramatic sighs when you have to get out from under cozy blankets on chilly mornings." },
  { cat: 'feelings', text: "I love the electric feeling of your fingers gently tracing patterns on my palm." },
  { cat: 'memories', text: "I love that museum date where we spent more time whispering jokes than looking at the art." },
  { cat: 'admiration', text: "I love your courage to apologize sincerely whenever a misunderstanding occurs." },
  { cat: 'future', text: "I love knowing that my best years are the ones I get to share with you." },

  // 101-110
  { cat: 'habits', text: "I love how you always offer me the last bite of whatever delicious meal we're sharing." },
  { cat: 'personality', text: "I love your authenticity; you never put on a fake persona to impress people." },
  { cat: 'smile', text: "I love the sleepy smile you give me when the alarm goes off and you reach for a morning cuddle." },
  { cat: 'kindness', text: "I love how you hold an umbrella so that I stay completely dry, even if your own shoulder gets wet." },
  { cat: 'efforts', text: "I love how patiently you explain complex concepts to me without being condescending." },
  { cat: 'imperfections', text: "I love how you take ten minutes to pick a movie on Netflix and end up falling asleep during the intro." },
  { cat: 'feelings', text: "I love how you make my heart beat faster and slower at the exact same time." },
  { cat: 'memories', text: "I love when we stayed up until 3 AM talking about our childhoods and childhood dreams." },
  { cat: 'admiration', text: "I love how you handle professional challenges with grace, focus, and grit." },
  { cat: 'future', text: "I love the thought of sitting on our porch in rocking chairs when our hair turns silver." },

  // 111-120
  { cat: 'habits', text: "I love how you always double-check that I arrived safely whenever we travel separately." },
  { cat: 'personality', text: "I love how genuine your compliments are; when you say I'm beautiful, I believe you." },
  { cat: 'smile', text: "I love the sudden, proud smile on your face when you master a recipe you practiced." },
  { cat: 'kindness', text: "I love how you give thoughtful advice when I ask for it, and just give hugs when that's all I need." },
  { cat: 'efforts', text: "I love how you plan surprise dates that align with the little things I love." },
  { cat: 'imperfections', text: "I love the adorable grumpy face you make when woken up before your alarm." },
  { cat: 'feelings', text: "I love that with you, love feels easy and natural, not like a chore or test." },
  { cat: 'memories', text: "I love the afternoon we spent walking aimlessly through the park, holding hands and talking." },
  { cat: 'admiration', text: "I love how you treat everyone around you with fairness and deep respect." },
  { cat: 'future', text: "I love knowing we will support each other through all of life's unpredictable chapters." },

  // 121-130
  { cat: 'habits', text: "I love the scent of your cologne lingering on my hoodie after you've worn it." },
  { cat: 'personality', text: "I love your curiosity about how gadgets and machines work on the inside." },
  { cat: 'smile', text: "I love the mischievous sparkle in your eyes before you play a harmless prank on me." },
  { cat: 'kindness', text: "I love how you always ask 'How was your day really?' and wait for the real answer." },
  { cat: 'efforts', text: "I love how you remember my friends' and family's names and ask how they are doing." },
  { cat: 'imperfections', text: "I love how you hoard random cables and electronic boxes just in case you need them someday." },
  { cat: 'feelings', text: "I love the feeling of resting my head on your shoulder during long plane or train rides." },
  { cat: 'memories', text: "I love that concert where you lifted me up so I could see the stage clearly." },
  { cat: 'admiration', text: "I love your self-discipline and ability to stay focused when you set a personal goal." },
  { cat: 'future', text: "I love looking forward to celebrating decades of your birthdays by your side." },

  // 131-140
  { cat: 'habits', text: "I love how you reach out to hold my hand while you drive with the other." },
  { cat: 'personality', text: "I love that you are confident without ever being arrogant." },
  { cat: 'smile', text: "I love the sweet smile you give me right before our lips meet for a kiss." },
  { cat: 'kindness', text: "I love how you offer your jacket to me the second the temperature drops a single degree." },
  { cat: 'efforts', text: "I love how you show interest in my hobbies, even if they aren't your cup of tea." },
  { cat: 'imperfections', text: "I love how you pretend you don't care about a romantic TV show while secretly getting hooked." },
  { cat: 'feelings', text: "I love the sense of home I feel whenever I look into your warm eyes." },
  { cat: 'memories', text: "I love that first weekend getaway where we didn't check social media even once." },
  { cat: 'admiration', text: "I love your emotional generosity—you never withhold affection to make a point." },
  { cat: 'future', text: "I love imagining adopting a pet together and spoiling it with too many toys." },

  // 141-150
  { cat: 'habits', text: "I love how you warm up your hands before touching my cold cheeks or neck." },
  { cat: 'personality', text: "I love your sense of wonder when stargazing on clear summer nights." },
  { cat: 'smile', text: "I love your laugh when you're laughing so hard that tears come to your eyes and no sound comes out." },
  { cat: 'kindness', text: "I love how you validate my feelings even when they might seem irrational to others." },
  { cat: 'efforts', text: "I love that you never forget our special dates and anniversaries." },
  { cat: 'imperfections', text: "I love how you leave your socks inside out in the laundry basket." },
  { cat: 'feelings', text: "I love how you make ordinary grocery shopping feel like a fun romantic excursion." },
  { cat: 'memories', text: "I love our very first photo booth pictures and how silly we looked making faces." },
  { cat: 'admiration', text: "I love how reliable you are; if you say you will be there, you will be there." },
  { cat: 'future', text: "I love that every year with you feels richer and deeper than the year before." },

  // 151-160
  { cat: 'habits', text: "I love how you always leave a sweet sticky note on the counter when you leave early." },
  { cat: 'personality', text: "I love how passionate you are about justice and standing up for the underdog." },
  { cat: 'smile', text: "I love how your face softens when I give you a surprise back massage." },
  { cat: 'kindness', text: "I love how you make sure everyone at a dinner gathering feels included in conversation." },
  { cat: 'efforts', text: "I love how you always take the time to de-ice my car windows on freezing mornings." },
  { cat: 'imperfections', text: "I love how you refuse to ask for directions until we've circled the block three times." },
  { cat: 'feelings', text: "I love how you make me want to be the best version of myself without trying to change me." },
  { cat: 'memories', text: "I love that anniversary dinner where we talked so long the restaurant staff had to politely close up." },
  { cat: 'admiration', text: "I love how you maintain strong principles even when faced with peer pressure." },
  { cat: 'future', text: "I love knowing that my secrets and dreams are forever safe in your hands." },

  // 161-170
  { cat: 'habits', text: "I love how you kiss my hand while holding it on your lap during long drives." },
  { cat: 'personality', text: "I love your patience when teaching me something new that you are skilled at." },
  { cat: 'smile', text: "I love your bright smile when your favorite sports team scores a winning goal." },
  { cat: 'kindness', text: "I love how you bring me water and medicine when I'm sick without me having to ask." },
  { cat: 'efforts', text: "I love how you practice saying phrases in my family's language or dialect just to surprise them." },
  { cat: 'imperfections', text: "I love how you always get super defensive about your favorite fictional superhero." },
  { cat: 'feelings', text: "I love that I never have to wear a mask or pretend around you." },
  { cat: 'memories', text: "I love the evening we baked cookies and ended up with flour all over our noses and shirts." },
  { cat: 'admiration', text: "I love your work ethic and how you pour genuine craftsmanship into everything you build." },
  { cat: 'future', text: "I love looking forward to our next big milestones and celebrating them hand-in-hand." },

  // 171-180
  { cat: 'habits', text: "I love how you always give me the window seat when we travel." },
  { cat: 'personality', text: "I love your quiet confidence that doesn't need to shout to be felt." },
  { cat: 'smile', text: "I love how your eyes crinkle with laughter when you watch funny animal videos." },
  { cat: 'kindness', text: "I love the tenderness in your hands when you massage my tired feet or shoulders." },
  { cat: 'efforts', text: "I love how you put your phone face down whenever we sit down for dinner together." },
  { cat: 'imperfections', text: "I love how you get so excited talking about your favorite games that your words tumble over each other." },
  { cat: 'feelings', text: "I love the feeling of being wrapped up in your arms while listening to the sound of rain." },
  { cat: 'memories', text: "I love that time we stargazed on the hood of the car until our fingers were cold." },
  { cat: 'admiration', text: "I love how you handle high-pressure situations with a level head." },
  { cat: 'future', text: "I love the comfort of knowing you'll be my companion through every season of life." },

  // 181-190
  { cat: 'habits', text: "I love how you check the locks around the house every night before coming to bed." },
  { cat: 'personality', text: "I love your open heart and how easily you forgive when someone makes an honest mistake." },
  { cat: 'smile', text: "I love the shy smile you give me when I shower you with compliments." },
  { cat: 'kindness', text: "I love how you always encourage me to take time for self-care when I'm burned out." },
  { cat: 'efforts', text: "I love how you assemble furniture or fix broken things around the house with total focus." },
  { cat: 'imperfections', text: "I love how you cannot resist buying a snack at the gas station checkout counter." },
  { cat: 'feelings', text: "I love how just catching your eye across a room makes all my stress dissolve." },
  { cat: 'memories', text: "I love that first time you met my friends and made them laugh within five minutes." },
  { cat: 'admiration', text: "I love how deeply you value family and keep close bonds with the people you love." },
  { cat: 'future', text: "I love thinking about all the inside jokes we haven't even invented yet." },

  // 191-200
  { cat: 'habits', text: "I love how you always pick up my favorite ice cream flavor whenever you pass the store." },
  { cat: 'personality', text: "I love your gentle nature—you are strong, but you never use strength to intimidate." },
  { cat: 'smile', text: "I love that warm smile that tells me 'Everything is going to be okay' without a word." },
  { cat: 'kindness', text: "I love how you stand by your friends through thick and thin, being a rock for everyone." },
  { cat: 'efforts', text: "I love how you research restaurant reviews thoroughly before taking me out to eat." },
  { cat: 'imperfections', text: "I love the dramatic groans you make when stretching your back in the morning." },
  { cat: 'feelings', text: "I love the comfort of knowing that I never have to fight for your attention." },
  { cat: 'memories', text: "I love the day we spent exploring that small historic town and eating pastries all afternoon." },
  { cat: 'admiration', text: "I love your thirst for self-improvement and how you always strive to be better." },
  { cat: 'future', text: "I love knowing that our love story is only in its beginning chapters." },

  // 201-210
  { cat: 'habits', text: "I love how you always make sure I have the softest pillow on the bed." },
  { cat: 'personality', text: "I love that you are a man of your word, reliable and true in every promise." },
  { cat: 'smile', text: "I love your proud grin when you show me something you created with your own hands." },
  { cat: 'kindness', text: "I love how you speak about people with empathy rather than harsh judgment." },
  { cat: 'efforts', text: "I love that you always open doors for me, chivalrous in the sweetest way." },
  { cat: 'imperfections', text: "I love how you always think you can carry all the grocery bags in a single trip." },
  { cat: 'feelings', text: "I love the calm heartbeat I hear when my ear is resting against your chest." },
  { cat: 'memories', text: "I love that bonfire night where we roasted marshmallows and whispered under the dark sky." },
  { cat: 'admiration', text: "I love how you take constructive criticism with poise and an open mind." },
  { cat: 'future', text: "I love imagining how proud I will be watching you achieve all the goals on your vision board." },

  // 211-220
  { cat: 'habits', text: "I love how you hum little tunes while making breakfast on weekend mornings." },
  { cat: 'personality', text: "I love your curiosity about nature, space, and the mysteries of the universe." },
  { cat: 'smile', text: "I love the genuine grin you get when you bite into your absolute favorite comfort food." },
  { cat: 'kindness', text: "I love how you give generous tips and always say 'Thank you, take care' with warmth." },
  { cat: 'efforts', text: "I love that you take the time to clean the car so our road trips are comfortable." },
  { cat: 'imperfections', text: "I love how you pout playfully when I tease you about your silly fashion quirks." },
  { cat: 'feelings', text: "I love the gentle warmth that spreads through my chest whenever you whisper 'I love you'." },
  { cat: 'memories', text: "I love the day we spent building that difficult Lego set and high-fived when it was done." },
  { cat: 'admiration', text: "I love how you maintain your calm composure even when others lose their temper." },
  { cat: 'future', text: "I love the thought of spending snowy winters tucked under blankets with you." },

  // 221-230
  { cat: 'habits', text: "I love how you place your warm hand on my knee while we're sitting with friends." },
  { cat: 'personality', text: "I love that you don't take yourself too seriously and can laugh at your own blunders." },
  { cat: 'smile', text: "I love the quiet, loving smile you give me right after we share a deep, honest talk." },
  { cat: 'kindness', text: "I love how you support my wildest dreams, never belittling what matters to me." },
  { cat: 'efforts', text: "I love how you remember what time my important meetings are and text me good luck." },
  { cat: 'imperfections', text: "I love how you always claim you're not cold right before you shiver and ask for a sweater." },
  { cat: 'feelings', text: "I love the overwhelming feeling of gratitude that washes over me just watching you sleep peacefully." },
  { cat: 'memories', text: "I love that festival where we danced in the grass with fairy lights glowing above us." },
  { cat: 'admiration', text: "I love your financial wisdom and how thoughtfully you plan for our long-term stability." },
  { cat: 'future', text: "I love knowing that home isn't a building; home is wherever you and I are together." },

  // 231-240
  { cat: 'habits', text: "I love how you always make sure my water bottle is full before we leave the house." },
  { cat: 'personality', text: "I love how patient you are when things don't go according to plan." },
  { cat: 'smile', text: "I love your radiant smile whenever you achieve something you worked tirelessly for." },
  { cat: 'kindness', text: "I love how you check on me when I have a headache, dimming the lights and bringing ice." },
  { cat: 'efforts', text: "I love how you look for little ways to make my daily routine just 1% easier." },
  { cat: 'imperfections', text: "I love how you get passionately defensive about why your favorite movie sequel is underrated." },
  { cat: 'feelings', text: "I love how your hugs make all the chaotic pieces of my mind fall back into peace." },
  { cat: 'memories', text: "I love our very first road trip where we took wrong turns and found the most scenic hidden view." },
  { cat: 'admiration', text: "I love how you treat your mother and sisters with deep admiration and devotion." },
  { cat: 'future', text: "I love looking forward to watching sunset after sunset with your hand in mine." },

  // 241-250
  { cat: 'habits', text: "I love how you instinctively pull me closer in your sleep whenever I try to roll over." },
  { cat: 'personality', text: "I love your balance of adventurous spirit and grounded realism." },
  { cat: 'smile', text: "I love the smirk you give me when you catch me singing along to guilty pleasure pop songs." },
  { cat: 'kindness', text: "I love how you never dismiss my fears, no matter how small they might seem." },
  { cat: 'efforts', text: "I love that you learn about the things I'm passionate about so we can talk about them." },
  { cat: 'imperfections', text: "I love how you take forever to decide what to order at restaurants because everything looks good." },
  { cat: 'feelings', text: "I love how proud you are to be seen with me, holding my hand high and walking tall." },
  { cat: 'memories', text: "I love that quiet evening we spent reading books side by side, completely happy without speaking." },
  { cat: 'admiration', text: "I love how you stand up for what is right even when everyone else stays quiet." },
  { cat: 'future', text: "I love the excitement of dreaming up our future adventures and bucket list journeys." },

  // 251-260
  { cat: 'habits', text: "I love how you always save the biggest strawberry or the best piece of dessert for me." },
  { cat: 'personality', text: "I love how you treat everyone with equal dignity regardless of their background." },
  { cat: 'smile', text: "I love your smile when you wake up and your eyes slowly focus on me." },
  { cat: 'kindness', text: "I love how you patiently listen to my long stories with all the unnecessary side details." },
  { cat: 'efforts', text: "I love how you always make sure our car is fueled up before a long road trip." },
  { cat: 'imperfections', text: "I love how you always forget where you put your sunglasses when they're resting on your head." },
  { cat: 'feelings', text: "I love knowing that I am truly loved for who I am on my best and worst days." },
  { cat: 'memories', text: "I love the night we walked on the boardwalk, eating cotton candy and laughing at the sea breeze." },
  { cat: 'admiration', text: "I love your sharp logical thinking when solving intricate puzzles and riddles." },
  { cat: 'future', text: "I love knowing that every passing year only makes our bond stronger and more precious." },

  // 261-270
  { cat: 'habits', text: "I love how you always kiss the top of my head when I'm focused on working." },
  { cat: 'personality', text: "I love how unpretentious and down-to-earth you are, comfortable in your own skin." },
  { cat: 'smile', text: "I love the playful grin you get when you challenge me to a race to the front door." },
  { cat: 'kindness', text: "I love how you offer your seat to older people or pregnant women on public transport without hesitation." },
  { cat: 'efforts', text: "I love that you take the time to write me handwritten birthday cards and heartfelt notes." },
  { cat: 'imperfections', text: "I love how you can never tell a scary story without laughing midway through." },
  { cat: 'feelings', text: "I love how your voice wraps around me like a warm blanket on a freezing winter night." },
  { cat: 'memories', text: "I love the rainy Sunday we spent building a cozy blanket fort and watching childhood cartoons." },
  { cat: 'admiration', text: "I love how committed you are to being a man of honor, strength, and genuine kindness." },
  { cat: 'future', text: "I love picturing our anniversary celebrations thirty, forty, and fifty years from now." },

  // 271-280
  { cat: 'habits', text: "I love how you tap out drum beats on the steering wheel when listening to rock music." },
  { cat: 'personality', text: "I love your endless patience when waiting in long queues without complaining." },
  { cat: 'smile', text: "I love how your eyes sparkle with childlike delight whenever snow starts to fall." },
  { cat: 'kindness', text: "I love how you remember to ask my parents about their health and hobbies." },
  { cat: 'efforts', text: "I love how you make sure I never carry heavy bags upstairs when you are around." },
  { cat: 'imperfections', text: "I love how you always try to fix something around the house before reading the instruction manual." },
  { cat: 'feelings', text: "I love that when you look at me, I feel completely understood without needing to say a word." },
  { cat: 'memories', text: "I love the evening we picked up takeout, drove to a hill overlooking the city, and ate under the lights." },
  { cat: 'admiration', text: "I love how you stay level-headed and empathetic even when someone is unfair to you." },
  { cat: 'future', text: "I love knowing that whatever challenges life throws at us, we will conquer them side by side." },

  // 281-290
  { cat: 'habits', text: "I love how you always make sure our shoes are neatly aligned by the entrance door." },
  { cat: 'personality', text: "I love how deeply you appreciate quiet moments in nature, breathing in the fresh air." },
  { cat: 'smile', text: "I love the bashful smile you give me when I catch you doing something sweet for me in secret." },
  { cat: 'kindness', text: "I love how you never use hurtful words, even when we are tired or frustrated." },
  { cat: 'efforts', text: "I love how you always find a way to make me laugh until my stomach hurts when I'm crying." },
  { cat: 'imperfections', text: "I love how you always think you know which way north is without checking a compass." },
  { cat: 'feelings', text: "I love how your presence alone makes any unfamiliar place feel safe and cozy." },
  { cat: 'memories', text: "I love our very first road trip playlist and how we sang every single verse together." },
  { cat: 'admiration', text: "I love your dedication to maintaining your health, fitness, and vitality." },
  { cat: 'future', text: "I love the thought of all the shared sunrises we still have ahead of us." },

  // 291-300
  { cat: 'habits', text: "I love how you stretch out your arm so I can use it as a pillow while watching movies." },
  { cat: 'personality', text: "I love your ability to find beauty and gratitude in the smallest, everyday occurrences." },
  { cat: 'smile', text: "I love the soft chuckle you let out when I do something clumsy and laugh at myself." },
  { cat: 'kindness', text: "I love how you always encourage me to pursue my passions without ever feeling insecure." },
  { cat: 'efforts', text: "I love that you surprise me with flowers or little treats for no special reason other than love." },
  { cat: 'imperfections', text: "I love how you always try to microwave food in round numbers instead of using the presets." },
  { cat: 'feelings', text: "I love that being with you feels like exhaling after holding my breath for a long time." },
  { cat: 'memories', text: "I love our picnic in the park where we ate strawberries, talked about dreams, and watched the clouds." },
  { cat: 'admiration', text: "I love how you treat all creatures with gentle respect and compassion." },
  { cat: 'future', text: "I love the thought of creating a warm sanctuary of a home where love always lives." },

  // 301-310
  { cat: 'habits', text: "I love how you always check the stove burners and deadbolts before turning off the lights." },
  { cat: 'personality', text: "I love how genuinely happy you are for other people when good things happen to them." },
  { cat: 'smile', text: "I love your dazzling smile in our anniversary photos that reminds me of how lucky I am." },
  { cat: 'kindness', text: "I love how you hold my trembling hands when I'm feeling anxious about something." },
  { cat: 'efforts', text: "I love that you never stop making me feel desired, cherished, and valued." },
  { cat: 'imperfections', text: "I love how you stubbornly insist on wearing your oldest, most worn-out favorite hoodie." },
  { cat: 'feelings', text: "I love how confident I feel when your arm is gently resting around my waist." },
  { cat: 'memories', text: "I love that night we stood on the balcony in the middle of winter, wrapped together in a single quilt." },
  { cat: 'admiration', text: "I love how you refuse to compromise your ethics for an easy shortcut." },
  { cat: 'future', text: "I love looking forward to learning and growing alongside you through the decades." },

  // 311-320
  { cat: 'habits', text: "I love how you always kiss my cheek when you pass by my desk while I'm working." },
  { cat: 'personality', text: "I love your calm wisdom and how your advice is always balanced and thoughtful." },
  { cat: 'smile', text: "I love that spontaneous, radiant grin you give me when our eyes meet across a crowded room." },
  { cat: 'kindness', text: "I love how you celebrate my successes as if they were your own personal triumphs." },
  { cat: 'efforts', text: "I love how you always make sure our car is warm and ready when it's freezing outside." },
  { cat: 'imperfections', text: "I love the dramatic, offended face you make when I playfully steal a fry from your plate." },
  { cat: 'feelings', text: "I love how easy it is to share my deepest, most vulnerable thoughts with you." },
  { cat: 'memories', text: "I love the day we spent baking a birthday cake and decorated it with hilarious crooked frosting." },
  { cat: 'admiration', text: "I love your quiet generosity—you help people without ever expecting applause." },
  { cat: 'future', text: "I love knowing that our journey together is the greatest adventure of my entire life." },

  // 321-330
  { cat: 'habits', text: "I love how you always leave the last cup of coffee in the pot for me." },
  { cat: 'personality', text: "I love your steady optimism that reminds me that storms always pass and sun returns." },
  { cat: 'smile', text: "I love the loving smile you give me when you catch me singing along to the radio in the shower." },
  { cat: 'kindness', text: "I love how you never let me go to bed feeling upset or unheard." },
  { cat: 'efforts', text: "I love that you actively listen to what I say, remembering the tiny details I shared weeks ago." },
  { cat: 'imperfections', text: "I love how you get so invested in sports matches that you stand up and coach from the couch." },
  { cat: 'feelings', text: "I love the overwhelming peace that fills my soul when I rest my head upon your chest." },
  { cat: 'memories', text: "I love that walk by the river where we skipped stones and made wishes on shooting stars." },
  { cat: 'admiration', text: "I love the respect you earn from everyone you work with because of your dedication." },
  { cat: 'future', text: "I love knowing that no matter how much the world changes, our love will remain unshakable." },

  // 331-340
  { cat: 'habits', text: "I love how you always look back and wave one last time before rounding the corner." },
  { cat: 'personality', text: "I love your playful spirit that reminds me to not take life too seriously." },
  { cat: 'smile', text: "I love your warm smile when you look at our framed photos hanging on the wall." },
  { cat: 'kindness', text: "I love how you show gratitude for the meals I cook, always thanking me with a kiss." },
  { cat: 'efforts', text: "I love how you continually invest in making our relationship deeper, stronger, and more fun." },
  { cat: 'imperfections', text: "I love how you can never resist pressing snooze at least once on early weekend mornings." },
  { cat: 'feelings', text: "I love that when I am with you, I am entirely and undeniably happy." },
  { cat: 'memories', text: "I love that evening we spent talking on the swings in the empty playground under the moon." },
  { cat: 'admiration', text: "I love your capacity to love deeply, honestly, and without holding anything back." },
  { cat: 'future', text: "I love dreaming of all the passport stamps we will collect side by side." },

  // 341-350
  { cat: 'habits', text: "I love how you wrap your fingers around mine in your sleep when I shift in bed." },
  { cat: 'personality', text: "I love how comfortable you are being vulnerable with me, sharing your true feelings." },
  { cat: 'smile', text: "I love how your whole face lights up whenever you talk about something that excites you." },
  { cat: 'kindness', text: "I love how gentle and caring your hands are whenever you tend to a scrape or hurt." },
  { cat: 'efforts', text: "I love how you always ask 'What can I do to help?' when you see I'm juggling too much." },
  { cat: 'imperfections', text: "I love how you hoard old sentimental movie ticket stubs and wristbands in your drawer." },
  { cat: 'feelings', text: "I love that you are my favorite person to talk to, laugh with, and do absolutely nothing with." },
  { cat: 'memories', text: "I love the rainy day we spent making homemade pizza from scratch with flour on our noses." },
  { cat: 'admiration', text: "I love how you always stay true to your roots, your values, and your loved ones." },
  { cat: 'future', text: "I love that with every passing day, I fall in love with you in brand new ways." },

  // 351-360
  { cat: 'habits', text: "I love how you always leave the bathroom light dim on late nights so it won't wake me." },
  { cat: 'personality', text: "I love how your warmth draws people in and makes everyone feel at home in your company." },
  { cat: 'smile', text: "I love the private, tender smile you give me when we share an unspoken thought." },
  { cat: 'kindness', text: "I love how you always forgive quickly, choosing love over holding onto grudges." },
  { cat: 'efforts', text: "I love that after all this time, you still look at me with the same wonder as on day one." },
  { cat: 'imperfections', text: "I love how you still get nervous right before giving a big presentation, despite being brilliant." },
  { cat: 'feelings', text: "I love knowing that my heart is in the safest, kindest hands in the world." },
  { cat: 'memories', text: "I love that midnight walk in the light snowfall when everything was quiet and pure." },
  { cat: 'admiration', text: "I love how you inspire me every single day to be a kinder, bolder, and more loving person." },
  { cat: 'future', text: "I love knowing that our best memories are still being written, day by day." },

  // 361-365 (The Final Countdown to Day 365!)
  { cat: 'feelings', text: "I love that throughout this whole year, there hasn't been a single day where I didn't thank the universe for bringing you into my life." },
  { cat: 'memories', text: "I love looking back at who we were when this journey started, and seeing how beautifully we've grown together." },
  { cat: 'admiration', text: "I love that through 363 days of sharing reasons, my heart still has an infinite library of reasons left to tell you." },
  { cat: 'future', text: "I love knowing that tomorrow marks 365 days of this journal, but only the very beginning of our forever." },
  { cat: 'feelings', text: "365 days. 365 reasons. And somehow, I still haven't run out of reasons to love you. This was never just about counting days. It was about reminding you, every single day, how special you are to me. And if I had another 365 days, I'd choose you all over again." }
];

// Let's assemble all 365 reasons
const allReasons = [];

// Copy the first 50
for (let i = 0; i < reasonsData.length; i++) {
  allReasons.push({
    day: reasonsData[i].day,
    category: reasonsData[i].category,
    text: reasonsData[i].text
  });
}

// Add the pool items from day 51 to 365
for (let i = 0; i < poolItems.length; i++) {
  const day = 51 + i;
  allReasons.push({
    day: day,
    category: poolItems[i].cat,
    text: poolItems[i].text
  });
}

console.log('Total reasons assembled:', allReasons.length);

if (allReasons.length !== 365) {
  console.error('Error: Reasons count is not 365! Got:', allReasons.length);
  process.exit(1);
}

// Verify day numbers
for (let i = 0; i < 365; i++) {
  if (allReasons[i].day !== i + 1) {
    console.error(`Mismatch at index ${i}: expected day ${i+1}, got ${allReasons[i].day}`);
    process.exit(1);
  }
}

// Write TypeScript file
const fileContent = `import { Reason } from '../types';

export const DEFAULT_REASONS: Reason[] = ${JSON.stringify(allReasons, null, 2)};
`;

fs.writeFileSync('src/data/defaultReasons.ts', fileContent, 'utf-8');
console.log('Successfully generated src/data/defaultReasons.ts with 365 unique reasons!');
