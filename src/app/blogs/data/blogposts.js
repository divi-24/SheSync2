/* eslint-disable */

import {
  Calendar,
  Stethoscope,
  Utensils,
  Leaf,
  Clock,
  Brain,
  Dumbbell,
  Pill,
  Droplet,
} from "lucide-react";
const blogPosts = [
     {
       id: 1,
       title: (
         <a
           className="text-pink-600"
         >
           "Understanding Your Menstrual Cycle"
         </a>
       ),
       excerpt:
         "Learn about the phases of your menstrual cycle and how they affect your body.",
       author: "Dr. Janvi Gupta",
       date: "2024-03-15",
       readingTime: "5 min",
       icon: <Calendar className="h-12 w-12 text-pink-500" />,
       category: "Health",
       content:
         "The menstrual cycle is typically 28 days long, but can range from 21 to 35 days. It consists of four main phases: menstruation, the follicular phase, ovulation, and the luteal phase. Each phase is characterized by different hormonal changes that affect your body and mood. Understanding these phases can help you better manage your health and well-being throughout your cycle.",
       video: (
         <iframe
           width="560"
           height="315"
           src="https://www.youtube.com/embed/7HlHGLr1hTA?si=pGQOe9NJgCEsV9L5"
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
           referrerPolicy="strict-origin-when-cross-origin"
           allowFullScreen
         ></iframe>
       ),
     },
     {
       id: 2,
       title: (
         <a
           className="text-pink-600"
         >
           "How long does the menstrual cycle and period last?"
         </a>
       ),
       excerpt:
         "Discover the best foods to eat during your menstrual cycle for optimal health.",
       author: "Nutritionist Sachin Rai",
       date: "2024-03-10",
       readingTime: "4 min",
       icon: <Utensils className="h-12 w-12 text-green-500" />,
       category: "Nutrition",
       content:
         "Your menstrual cycle takes around 28 days to complete, but this is a good time to point out that EVERYONE is different! Just like your fingerprints are unique, so is your bloody brilliant body and how you experience periods. So, while we say 28 days it might be a little longer, it might be a little shorter, there really aren’t any set rules here. Of those 28 days, you could expect to bleed for anywhere between 3-8 days. Again, everyone is different, and your periods are likely to change. Your body can take some time to get into its own flow, so cut it a bit of slack - it’s learning what to do while you’re getting used to things too!",
       video:(
         <iframe
           width="560"
           height="315"
           src="https://www.youtube.com/embed/kQyByK9XaQg?si=Xnu21W1iMabfH68Z"
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
           referrerPolicy="strict-origin-when-cross-origin"
           allowFullScreen></iframe>
       )
       },
     {
       id: 3,
       title: (
         <a
           className="text-pink-600"
         >
           "What are the signs that my period is coming?"
         </a>
       ),
       excerpt:
         "Explore natural remedies and lifestyle changes to alleviate PMS symptoms.",
       author: "Holistic Health Coach Namita Arora",
       date: "2024-03-05",
       readingTime: "6 min",
       icon: <Leaf className="h-12 w-12 text-purple-500" />,
       category: "Wellness",
       content:
         "If you’ve never had a period before, there are some signs which might indicate your period is coming and they’re all natural parts of growing up. If you’ve noticed your boobs are beginning to develop, and you’ve started to grow pubic hair, then you could expect to get your period about two years later. A more immediate sign for some people is if you notice discharge in your pants. Discharge is a white or yellowish fluid which usually shows up a few months before your first period. There are lots of other signs your period is coming and these can be both physical and emotional. We call these signs PMS (premenstrual syndrome). Not everyone gets PMS and we all experience it differently. It usually happens just before and during your period, and it’s basically the reason you might find yourself wanting to eat your body weight in chocolate or burst into tears at the smallest of things…lost sock, bad hair day, burnt toast…trust me, we all have those days! PMS brings with it all kinds of symptoms such as headaches, bloating, cramps, mood swings, feeling tired and having trouble concentrating. We’ve got a great blog all about PMS with top tips on how to help with these symptoms and many more, so go and take a look. It will finally explain some of those weird and wonderful feelings that you never knew were thanks to your bloody brilliant period!",
       className: "blog-post-3",
       video:(
         <iframe width="560" height="315" src="https://www.youtube.com/embed/kQyByK9XaQg?si=iyoRPoEHMefjHsQM" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
       )
     },
     {
       id: 4,
       title: (
         <a
           className="text-pink-600"
         >
           "Why does the colour vary so much?"
         </a>
       ),
       excerpt:
         "A journey through time exploring the evolution of menstrual products.",
       author: "Historian Dr. Ayesha Khan",
       date: "2024-02-28",
       readingTime: "7 min",
       icon: <Clock className="h-12 w-12 text-blue-500" />,
       category: "History",
       content:
         "Like we just said, there’s lots of other things going on in there besides blood, that’s why it doesn’t always come out bright red like you might expect. But it’s not just what your period is made up of that determines the colour. The colour of your period can be a great tool for knowing what’s going on in your body. It can highlight signs of a poor diet, possible infections or other health conditions. In most cases a variety of shades is totally normal, with oxygen and hormones (there they are again) also playing a role in the shade of your flow (which is COMPLETELY NATURAL!).We’ve got a handy diagram and more information on the different colours of your period here.",
       video:(
         <iframe width="560" height="315" src="https://www.youtube.com/embed/NM2fnDJf_RA?si=kf8VQZ8yRcgVaV3k" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
       )
       },
     {
       id: 5,
       title: (
         <a
           className="text-pink-600"
         >
           "Pain and WHAT IS NORMAL?"
         </a>
       ),
       excerpt:
         "Learn how to optimize your workouts based on your menstrual cycle phases.",
       author: "Fitness Expert Vaibhavi Jain",
       date: "2024-03-20",
       readingTime: "5 min",
       icon: <Dumbbell className="h-12 w-12 text-orange-500" />,
       category: "Fitness",
       content:
         "A not-so-fun part about getting your period is period pains, or menstrual cramps, as they’re also called. It’s worth pointing out that not everyone gets period cramps. Most women, girls and people who have periods do, but if you don’t, then that’s absolutely nothing to worry about – just embrace the fact you can enjoy your bloody brilliant period cramp free. So, what is period pain? Period pain is mainly caused by your uterus contracting (tensing up like the other muscles in your body) to help get rid of the lining which we spoke about earlier. You can get pains in your stomach, but it can also spread into your back and thighs. We’ve got a whole heap more information on period pain and what you can do to help here. Hopefully by now you’ll be getting the idea that there’s all kinds of normal when it comes to your period: your normal, your mates’ normal, your next-door neighbours’ normal! What we’re trying to say is we’re all unique, but periods themselves are a normal part of life. After all, half the population will have periods at some point in their lives, so we should all be able to support each other. It’s important to have conversations about periods, as it’s something so many of us have in common! Getting to know your body, your feelings, your health and your flow is really important. If you notice changes in your normal, or if you find it difficult to cope with any aspect of your period, ask for support. There’s no shame in asking for advice, like our team of Bloody Brilliant experts - your local doctor or nurse has all the skills and experience needed to help you. Only you know how you feel, so it’s important you get help if you need it! ",
       video:(
         <iframe width="560" height="315" src="https://www.youtube.com/embed/5u6Y6ZP2_Wg?si=0corejaxkLAdamVU" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
       )
       },
     {
       id: 6,
       title: (
         <a
           className="text-pink-600"
         >
           "Hormones and Mental Health"
         </a>
       ),
       excerpt:
         "Understand the connection between hormonal changes and mental well-being.",
       author: "Psychologist Dr. Richa Malhotra",
       date: "2024-03-25",
       readingTime: "6 min",
       icon: <Brain className="h-12 w-12 text-indigo-500" />,
       category: "Mental Health",
       content:
         "Hormonal fluctuations during the menstrual cycle can significantly impact mental health. Many women experience mood swings, anxiety, or depression, especially during the premenstrual phase. Understanding these changes can help in managing symptoms. Techniques such as cognitive-behavioral therapy, mindfulness, and in some cases, medication, can be effective in addressing hormone-related mental health concerns.",
       video:(
         <iframe width="560" height="315" src="https://www.youtube.com/embed/5u6Y6ZP2_Wg?si=k3bqefy1Fqx9E2-o" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
       )
       },
     {
       id: 7,
       title: (
         <a
           className="text-pink-600"
         >
           "Menstrual Hygiene Best Practices"
         </a>
       ),
       excerpt:
         "Essential tips for maintaining proper menstrual hygiene and preventing infections.",
       author: "Gynecologist Dr. Siya Choudhary",
       date: "2024-03-30",
       readingTime: "4 min",
       icon: <Droplet className="h-12 w-12 text-cyan-500" />,
       category: "Hygiene",
       content:
         "Proper menstrual hygiene is crucial for preventing infections and ensuring comfort. Change your menstrual product regularly, at least every 4-8 hours for pads and tampons. Wash your hands before and after changing products. If using reusable products like menstrual cups or cloth pads, ensure they are thoroughly cleaned and sterilized between uses. Avoid scented products as they can disrupt your natural pH balance.",
       video:(
         <iframe width="560" height="315" src="https://www.youtube.com/embed/GVRDGQhoEYQ?si=xc5wVsaieAbEhMXA" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
       )
       },
     {
       id: 8,
       title: (
         <a
           className="text-pink-600"
         >
           "Hormonal Birth Control Options"
         </a>
       ),
       excerpt:
         "An overview of different hormonal contraceptive methods and their effects on your cycle.",
       author: " Dr. Manisha Agarwal ",
       date: "2024-04-05",
       readingTime: "7 min",
       icon: <Pill className="h-12 w-12 text-red-500" />,
       category: "Contraception",
       content:
         "Hormonal birth control methods include pills, patches, injections, and intrauterine devices (IUDs). These work by altering your hormone levels to prevent ovulation or fertilization. While effective for contraception, they can also affect your menstrual cycle, often making periods lighter or more regular. Some methods may even stop periods altogether. It's important to discuss the pros and cons of each method with your healthcare provider to find the best option for you.",
       video:(
         <iframe width="560" height="315" src="https://www.youtube.com/embed/UBhiwkM8MIY?si=oudSo2-O9bAfbOKW" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
       )
       },
     {
       id: 9,
       title: (
         <a
           className="text-pink-600"
         >
           "Menstrual Disorders: When to Seek Help"
         </a>
       ),
       excerpt:
         "Learn about common menstrual disorders and signs that indicate you should consult a doctor.",
       author: "Obstetrician Dr. Hazel ",
       date: "2024-04-10",
       readingTime: "6 min",
       icon: <Stethoscope className="h-12 w-12 text-teal-500" />,
       category: "Health",
       content:
         "While some variation in menstrual cycles is normal, certain symptoms may indicate a disorder. Heavy bleeding, severe pain, irregular cycles, or bleeding between periods could be signs of conditions like endometriosis, PCOS, or fibroids. If you experience these symptoms, or if your period significantly impacts your daily life, it's important to consult with a healthcare provider for proper diagnosis and treatment.",
       video:(
         <iframe width="560" height="315" src="https://www.youtube.com/embed/C3ttfI5YxvE?si=k8_IdhcZe0Wjs0cN" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
       )
       },
     {
       id: 10,
       title: (
         <a className="text-pink-600">
           "The Complete Guide to Period Pain Relief"
         </a>
       ),
       excerpt:
         "Discover proven methods to manage and reduce menstrual cramps naturally and safely.",
       author: "Dr. Priya Sharma",
       date: "2024-04-15",
       readingTime: "7 min",
       icon: <Leaf className="h-12 w-12 text-green-500" />,
       category: "Wellness",
       content:
         "Menstrual cramps affect millions of women worldwide. This comprehensive guide covers everything from heat therapy, exercise, and stretching to dietary changes and when to seek professional help. Learn about over-the-counter pain relievers, herbal remedies like ginger and turmeric, and lifestyle modifications that can significantly reduce your discomfort. We also discuss when persistent pain might indicate an underlying condition requiring medical attention.",
       video:(
         <iframe width="560" height="315" src="https://www.youtube.com/embed/P9ddmRiKM_g" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
       )
     },
     {
       id: 11,
       title: (
         <a className="text-pink-600">
           "Endometriosis: What You Need to Know"
         </a>
       ),
       excerpt:
         "Understanding endometriosis symptoms, diagnosis, and treatment options.",
       author: "Dr. Meera Patel",
       date: "2024-04-18",
       readingTime: "8 min",
       icon: <Stethoscope className="h-12 w-12 text-red-500" />,
       category: "Health",
       content:
         "Endometriosis is a chronic condition affecting approximately 10% of women of reproductive age. This detailed article explores what endometriosis is, how tissue grows outside the uterus, common symptoms including severe pain and infertility, diagnostic procedures like ultrasound and laparoscopy, and various treatment options ranging from medication to surgery. We discuss pain management strategies, fertility concerns, and living well with this condition.",
       video:(
         <iframe width="560" height="315" src="https://www.youtube.com/embed/uu0EKzRBvg4" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
       )
     },
     {
       id: 12,
       title: (
         <a className="text-pink-600">
           "PCOS and Your Menstrual Health"
         </a>
       ),
       excerpt:
         "A comprehensive look at polycystic ovary syndrome and its impact on menstrual cycles.",
       author: "Dr. Anjali Singh",
       date: "2024-04-20",
       readingTime: "9 min",
       icon: <Brain className="h-12 w-12 text-purple-500" />,
       category: "Health",
       content:
         "Polycystic Ovary Syndrome (PCOS) is one of the most common hormonal disorders in women. This article explains the causes, symptoms including irregular periods, excess hair growth, and acne, and how PCOS affects fertility. We cover diagnostic criteria, insulin resistance, hormonal imbalances, and comprehensive treatment approaches including lifestyle modifications, medications like metformin, and fertility treatments. Managing PCOS effectively can significantly improve quality of life.",
       video:(
         <iframe width="560" height="315" src="https://www.youtube.com/embed/NcGeMWaF4ac" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
       )
     },
     {
       id: 13,
       title: (
         <a className="text-pink-600">
           "Menopause and Perimenopause: The Transition"
         </a>
       ),
       excerpt:
         "Understanding the menopausal transition and managing symptoms during perimenopause.",
       author: "Dr. Divya Mehta",
       date: "2024-04-22",
       readingTime: "7 min",
       icon: <Clock className="h-12 w-12 text-orange-500" />,
       category: "Health",
       content:
         "Perimenopause and menopause represent significant life transitions for women. This guide explains the hormonal changes occurring during perimenopause, typically lasting 4-10 years, and the various symptoms including hot flashes, night sweats, mood changes, and irregular periods. We discuss how to manage symptoms through hormone replacement therapy (HRT), lifestyle adjustments, exercise, diet, and alternative therapies. Understanding what to expect helps women navigate this natural life stage with confidence.",
       video:(
         <iframe width="560" height="315" src="https://www.youtube.com/embed/_nMdn6EI6WA" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
       )
     },
     {
       id: 14,
       title: (
         <a className="text-pink-600">
           "Nutrient Deficiencies and Heavy Periods"
         </a>
       ),
       excerpt:
         "How heavy menstrual bleeding affects your iron levels and nutritional health.",
       author: "Nutritionist Dr. Kavya Nair",
       date: "2024-04-25",
       readingTime: "6 min",
       icon: <Utensils className="h-12 w-12 text-blue-500" />,
       category: "Nutrition",
       content:
         "Heavy menstrual bleeding (menorrhagia) can lead to iron deficiency anemia, affecting energy levels and overall health. This article explains the connection between heavy periods and nutrient depletion, particularly iron, B vitamins, and magnesium. We provide detailed nutritional guidance including iron-rich foods from both plant and animal sources, how to enhance iron absorption with vitamin C, and the role of B12 and folate in managing fatigue. Learn when supplementation is necessary and how to optimize your diet during your cycle.",
       video:(
         <iframe width="560" height="315" src="https://www.youtube.com/embed/gsYDJNrYvIw" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
       )
     },
       {
       id: 15,
       title: (
         <a className="text-pink-600">
           "Cycle Syncing: Optimizing Your Life with Your Period"
         </a>
       ),
       excerpt:
         "Learn how to sync your activities, diet, and workouts with your menstrual cycle.",
       author: "Health Coach Ritika Desai",
       date: "2024-04-28",
       readingTime: "8 min",
       icon: <Dumbbell className="h-12 w-12 text-pink-500" />,
       category: "Wellness",
       content:
         "Cycle syncing is the practice of aligning your activities, nutrition, and exercise with your menstrual cycle phases. During the follicular phase (low energy), focus on light cardio and complex carbs. During ovulation, maximize intense workouts. In the luteal phase, prioritize strength training and serotonin-boosting foods. This comprehensive guide covers hormone-specific nutrition, workout recommendations for each phase, sexual activity optimization, and productivity scheduling. By working with your body instead of against it, you can enhance performance and well-being.",
       video:(
         <iframe width="560" height="315" src="https://www.youtube.com/embed/7HlHGLr1hTA" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
       )
       },
       {
         id: 16,
         title: (
           <a className="text-pink-600">
             "Understanding Your Period While on Birth Control"
           </a>
         ),
         excerpt:
           "How different birth control methods affect your menstrual cycle and what to expect.",
         author: "Dr. Neha Verma",
         date: "2024-05-01",
         readingTime: "7 min",
         icon: <Pill className="h-12 w-12 text-teal-500" />,
         category: "Health",
         content:
           "Birth control affects menstrual cycles in different ways depending on the method. Combined oral contraceptives may reduce flow and cramping. The hormonal IUD can cause lighter periods or amenorrhea. The copper IUD typically increases bleeding. This article explains how each birth control method works, what cycle changes to expect, potential side effects, and troubleshooting strategies. We discuss breakthrough bleeding, spotting, and when to contact your healthcare provider. Understanding these changes helps you make informed decisions about contraception.",
         video:(
           <iframe width="560" height="315" src="https://www.youtube.com/embed/BYBR48mIKt8" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
         )
       },
     {
       id: 17,
       title: (
         <a className="text-pink-600">
           "Teenage Period Problems: A Parent's Guide"
         </a>
       ),
       excerpt:
         "Helping your teen navigate period challenges and establish healthy habits.",
       author: "Dr. Pooja Sharma",
       date: "2024-05-03",
       readingTime: "6 min",
       icon: <Brain className="h-12 w-12 text-indigo-500" />,
       category: "Education",
       content:
         "When a teenager gets their period, questions and challenges often arise. This guide addresses common issues like irregular cycles (normal during early years), heavy bleeding, severe cramps, and emotional changes. We provide practical advice for parents on supporting their teens, managing period products, maintaining school attendance, and knowing when to seek medical help. Topics include explaining hormonal changes, product options, dealing with period anxiety, and fostering a positive relationship with menstruation.",
       video:(
         <iframe width="560" height="315" src="https://www.youtube.com/embed/303cuAYEiXw" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
       )
     },
       {
         id: 18,
         title: (
           <a className="text-pink-600">
             "Sustainable Period Products: Making the Switch"
           </a>
         ),
         excerpt:
           "Exploring eco-friendly and cost-effective alternatives to disposable products.",
         author: "Environmental Advocate Maya Gupta",
         date: "2024-05-05",
         readingTime: "7 min",
         icon: <Leaf className="h-12 w-12 text-green-600" />,
         category: "Wellness",
         content:
           "Disposable period products generate significant waste and expense over a lifetime. This article explores sustainable alternatives including menstrual cups, reusable cloth pads, period underwear, and sea sponges. We discuss the environmental impact, cost savings over time, health considerations, and how to transition to sustainable products. Each option has unique benefits and considerations regarding comfort, convenience, and maintenance. Making sustainable choices benefits both your health and the planet.",
         video:(
           <iframe width="560" height="315" src="https://www.youtube.com/embed/-xaGp9c9Kkc" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
         )
       },
       {
         id: 19,
         title: (
           <a className="text-pink-600">
             "Period Sex: Myths, Safety, and Comfort"
           </a>
         ),
         excerpt:
           "Evidence-based information about sexual activity during menstruation.",
         author: "Dr. Anika Roy",
         date: "2024-05-08",
         readingTime: "6 min",
         icon: <Brain className="h-12 w-12 text-pink-600" />,
         category: "Health",
         content:
           "Many myths surround period sex, but the reality is that sexual activity during menstruation is safe and can be beneficial. This article debunks common myths, discusses health considerations including STI transmission and pregnancy prevention, and addresses comfort concerns. We cover communication with partners, product options including period-safe menstrual discs, hygiene practices, and how sexual activity may affect period flow. Understanding that period sex is a personal choice helps people make informed decisions without shame.",
         video:(
           <iframe width="560" height="315" src="https://www.youtube.com/embed/lmcsGPPd5Ok" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
         )
       },
       {
         id: 20,
         title: (
           <a className="text-pink-600">
             "Stress, Anxiety, and Your Menstrual Cycle"
           </a>
         ),
         excerpt:
           "How psychological stress affects your period and strategies for management.",
         author: "Psychologist Dr. Sophia Iyer",
         date: "2024-05-10",
         readingTime: "7 min",
         icon: <Brain className="h-12 w-12 text-purple-600" />,
         category: "Mental Health",
         content:
           "Stress directly impacts menstrual health by affecting hormonal balance, potentially causing irregular periods, missed periods (amenorrhea), or worsening PMS symptoms. This comprehensive guide explains the stress-hormone connection, cortisol's effect on reproductive hormones, and the cycle's influence on mood and anxiety. We provide stress-reduction techniques including meditation, yoga, breathing exercises, therapy, and lifestyle modifications. Understanding this bidirectional relationship empowers you to manage both stress and menstrual health effectively.",
         video:(
           <iframe width="560" height="315" src="https://www.youtube.com/embed/S6pnhXOs7VA" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
         )
       },
     {
       id: 21,
       title: (
         <a className="text-pink-600">
           "Fertility Awareness and Ovulation Tracking"
         </a>
       ),
       excerpt:
         "Master ovulation tracking for fertility or natural contraception purposes.",
       author: "Fertility Specialist Dr. Kavita Bansal",
       date: "2024-05-12",
       readingTime: "8 min",
       icon: <Calendar className="h-12 w-12 text-pink-600" />,
       category: "Health",
       content:
         "Understanding your fertile window is essential whether you're trying to conceive or use natural contraception. This detailed guide covers ovulation physiology, basal body temperature tracking, cervical mucus observation, and ovulation predictor kits. We explain symptothermal methods that combine multiple indicators for accuracy. Learn how to chart your cycle, interpret patterns, and identify your most fertile days. This knowledge empowers informed family planning decisions.",
       video:(
         <iframe width="560" height="315" src="https://www.youtube.com/embed/w4CWz9pWfCA" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
       )
     },
       {
         id: 22,
         title: (
           <a className="text-pink-600">
             "Period Poverty and Access to Menstrual Products"
           </a>
         ),
         excerpt:
           "Understanding period poverty and working toward equitable menstrual health access.",
         author: "Social Advocate Dr. Neha Kapoor",
         date: "2024-05-15",
         readingTime: "7 min",
         icon: <Droplet className="h-12 w-12 text-cyan-600" />,
         category: "Social",
         content:
           "Period poverty affects millions of people globally who cannot afford menstrual products, leading to school absenteeism, health issues, and social stigma. This article examines the systemic issues, economic barriers, and solutions including subsidized products, free distribution programs, and policy changes. We discuss the psychological impact of period poverty and efforts by organizations and governments to ensure menstrual equity. Everyone deserves access to products and information needed for healthy menstruation.",
         video:(
           <iframe width="560" height="315" src="https://www.youtube.com/embed/gPWriykB0xY" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
         )
       },
       {
         id: 23,
         title: (
           <a className="text-pink-600">
             "Premenstrual Syndrome (PMS): Beyond the Stereotypes"
           </a>
         ),
         excerpt:
           "Scientific understanding of PMS and evidence-based management strategies.",
         author: "Dr. Ritu Sharma",
         date: "2024-05-18",
         readingTime: "8 min",
         icon: <Brain className="h-12 w-12 text-orange-600" />,
         category: "Health",
         content:
           "PMS affects 75% of menstruating people to some degree, with symptoms ranging from mild to severe (PMDD). This comprehensive guide explains the neurobiology of PMS, hormonal triggers, and why it differs between individuals. We cover symptom tracking, dietary interventions, supplements like calcium and magnesium, exercise recommendations, lifestyle modifications, and medication options. Understanding PMS as a real medical condition rather than emotional overreaction helps people access appropriate support and treatment.",
         video:(
           <iframe width="560" height="315" src="https://www.youtube.com/embed/_xHUp3mZQyw" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
         )
       },
       {
         id: 24,
         title: (
           <a className="text-pink-600">
             "Irregular Periods: When to Worry and What to Do"
           </a>
         ),
         excerpt:
           "Understanding irregular cycles and when medical evaluation is necessary.",
         author: "Dr. Anjali Puri",
         date: "2024-05-20",
         readingTime: "7 min",
         icon: <Clock className="h-12 w-12 text-red-600" />,
         category: "Health",
         content:
           "While cycle variation is normal, extreme irregularity may indicate underlying health issues. This article defines irregular periods, explores common causes including stress, extreme exercise, weight changes, hormonal imbalances, and thyroid disorders. We discuss tracking methods to identify patterns, when to see a healthcare provider, and diagnostic tests. Understanding your personal baseline helps distinguish normal variation from concerning changes requiring medical attention.",
         video:(
           <iframe width="560" height="315" src="https://www.youtube.com/embed/wwDJpQqxHEk" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
         )
       },
       {
         id: 25,
         title: (
           <a className="text-pink-600">
             "Exercise and Your Period: Myths and Facts"
           </a>
         ),
         excerpt:
           "How physical activity affects your menstrual cycle and how to optimize workouts.",
         author: "Fitness Expert Dr. Vikram Singh",
         date: "2024-05-22",
         readingTime: "7 min",
         icon: <Dumbbell className="h-12 w-12 text-teal-600" />,
         category: "Wellness",
         content:
           "Exercise is beneficial during menstruation, contrary to outdated myths. This guide explains how different phases of your cycle affect energy, strength, and recovery. During menstruation, light exercise like walking and yoga provides relief. During the follicular and ovulatory phases, maximize intense training. In the luteal phase, focus on steady-state exercise. We cover energy availability, nutrient needs during each phase, managing period symptoms through exercise, and when to modify intensity. Proper cycle-synced training optimizes results and enjoyment.",
         video:(
           <iframe width="560" height="315" src="https://www.youtube.com/embed/PSYxUn4NsJA" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
         )
       },
       {
         id: 26,
         title: (
           <a className="text-pink-600">
             "Traveling During Your Period: Complete Guide"
           </a>
         ),
         excerpt:
           "Practical tips for managing your period while traveling domestically or internationally.",
         author: "Travel & Health Advisor Maya Kumar",
         date: "2024-05-25",
         readingTime: "6 min",
         icon: <Calendar className="h-12 w-12 text-blue-600" />,
         category: "Lifestyle",
         content:
           "Traveling during your period requires preparation and flexibility. This practical guide covers packing essentials, managing products in different countries with varying availability, dealing with time zone changes and cycle disruption, and comfort strategies. We discuss timing trips around your cycle when possible, managing flow during flights or long travel days, hygiene in unfamiliar bathrooms, and emergency supplies. With proper planning, you can enjoy travels regardless of menstrual timing.",
         video:(
           <iframe width="560" height="315" src="https://www.youtube.com/embed/rSsIrs_jkAw" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
         )
       },
     ];

     export default blogPosts;
