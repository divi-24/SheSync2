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
           referrerpolicy="strict-origin-when-cross-origin"
           allowfullscreen></iframe>
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
         <iframe width="560" height="315" src="https://www.youtube.com/embed/kQyByK9XaQg?si=iyoRPoEHMefjHsQM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
         <iframe width="560" height="315" src="https://www.youtube.com/embed/NM2fnDJf_RA?si=kf8VQZ8yRcgVaV3k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
         <iframe width="560" height="315" src="https://www.youtube.com/embed/5u6Y6ZP2_Wg?si=0corejaxkLAdamVU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
         <iframe width="560" height="315" src="https://www.youtube.com/embed/5u6Y6ZP2_Wg?si=k3bqefy1Fqx9E2-o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
         <iframe width="560" height="315" src="https://www.youtube.com/embed/GVRDGQhoEYQ?si=xc5wVsaieAbEhMXA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
         <iframe width="560" height="315" src="https://www.youtube.com/embed/UBhiwkM8MIY?si=oudSo2-O9bAfbOKW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
         <iframe width="560" height="315" src="https://www.youtube.com/embed/C3ttfI5YxvE?si=k8_IdhcZe0Wjs0cN" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
       )
       },
   
];

export default blogPosts;
