import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
    Box,
    Typography,
    Container,
    Grid,
    Chip,
    Stack,
    Divider,
    IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import { CHeader } from "@/components/global/header/CHeader";
import { FooterSection } from "@/components/page_related/landing/FooterSection";
import { CTASection } from "@/components/page_related/landing/CTASection";
import { BlogCard } from "@/components/page_related/landing/BlogCard";
import Link from "next/link";
import { FaLinkedin, FaFacebook, FaTwitter, FaLink } from "react-icons/fa";
import { BsXLg } from "react-icons/bs";

// --- Mock Data (Should ideally come from a shared source/API) ---
const articles = [
    {
        id: 1,
        image: "/newassets/motherbaby.png",
        category: "ARTICLES",
        date: "October 2, 2025",
        title: "Finding Trusted Help in the U.S. – How the DESI Community Supports Each Other",
        description: "Moving to the U.S. can be exciting, but it often comes with challenges like finding reliable help. For Indian families, the experience can feel even more daunting if language or cultural familiarity is important. This is where DesiHelpers.com shines.",
        content: `
            <p>Moving to the U.S. can be exciting, but it often comes with challenges—especially when it comes to finding reliable help for your home, events, or childcare. For Indian families, the experience can feel even more daunting if language or cultural familiarity is important. This is where DesiHelpers.com shines.</p>
            
            <p>Inspired by the strong sense of community in Indian culture, where neighbors and relatives traditionally support each other, DesiHelpers connects families with trusted helpers who understand both your values and your needs. Whether you’re looking for a nanny, mother’s helper, caterer, cake baker, or event decorator, you can find someone who speaks your language—Hindi, Telugu, Marathi, Punjabi, Gujarati, and many more.</p>

            <p>For example, Anil, a software engineer in Silicon Valley, was able to hire a reliable nanny for his 3-year-old within days, saving him countless hours while he focused on work. Similarly, Priya, an IT professional in New Jersey, found a caterer for her daughter’s birthday party who understood authentic Indian flavors, making the celebration feel just like back home.</p>

            <p>By bridging cultural and linguistic gaps, DesiHelpers is more than a service platform—it’s a lifeline for Indian families in the U.S., helping them feel at home while building a thriving, supportive community.</p>
        `,
        tags: ["Job Search", "Profile Building", "Local Jobs", "Community Stories"]
    },
    {
        id: 2,
        image: "/newassets/study.png",
        category: "ARTICLES",
        date: "October 1, 2025",
        title: "From Side Hustle to Success: How DESI Skills Are Turning Into Income Abroad",
        description: "For many Indian immigrants in the U.S., moving to a new country means adapting to a new lifestyle...",
        content: `
            <p>For many Indian immigrants in the U.S., moving to a new country means adapting to a new lifestyle while finding ways to sustain and grow financially. But what if the skills you already have—skills rooted in your culture and upbringing—could become a thriving source of income?</p>
            
            <p>This is the reality for countless Indian professionals and homemakers who have turned their talents into successful side hustles through platforms like DesiHelpers.com. Whether it's cooking authentic Indian meals, tutoring students in Hindi or regional languages, offering mehndi services for weddings, or helping families with childcare, Indian immigrants are leveraging their unique skill sets to build meaningful careers abroad.</p>

            <p>Take Meera, for example, a homemaker in Texas who started offering tiffin services to busy Indian families. What began as a small venture to help a few neighbors has now grown into a full-fledged catering business. Similarly, Rajesh, an IT professional in California, discovered that his passion for teaching could supplement his income. He now tutors high school students in math and science during evenings and weekends, making a significant impact while earning extra.</p>

            <p>DesiHelpers makes it easy to showcase your skills to a community that values what you offer. From event decorating to baking custom Indian sweets, from yoga instruction to professional photography, the opportunities are endless. By connecting service providers with families who need their expertise, DesiHelpers is helping Indian immigrants not just survive, but thrive in their new homes.</p>

            <p>Your skills matter. Your culture matters. And with the right platform, your side hustle can become your success story.</p>
        `,
        tags: ["Career", "Skills", "Income"]
    },
    {
        id: 3,
        image: "/newassets/motherchild1.jpg",
        category: "ARTICLES",
        date: "September 30, 2025",
        title: "Parenting Made Easier: How Indian Families Find Nannies & Helpers in U.S",
        description: "Raising children in a new country comes with its unique set of joys and hurdles...",
        content: `
            <p>Raising children in a new country comes with its unique set of joys and hurdles. For Indian families in the U.S., managing work-life balance while ensuring cultural continuity for their children can be particularly challenging. Finding a nanny or helper who understands your language, values, and traditions can make all the difference.</p>
            
            <p>DesiHelpers.com bridges this gap by connecting Indian families with trusted caregivers who share their cultural background. Imagine finding a nanny who can speak to your toddler in Telugu, prepare their favorite dosa for breakfast, or teach them traditional bhajans—all while you focus on your career.</p>

            <p>Priya, a working mother in New Jersey, shares her experience: "I was struggling to find someone who could take care of my daughter while understanding our cultural needs. Through DesiHelpers, I found the perfect nanny who speaks Marathi and follows our dietary preferences. It feels like we have family helping us."</p>

            <p>Beyond childcare, many families also find mother's helpers—young adults or experienced caregivers who assist with daily routines, light housework, and providing companionship to children. These helpers understand the importance of festivals, respect for elders, and the little cultural nuances that make a house feel like home.</p>

            <p>Whether you need full-time care or occasional help for events and gatherings, DesiHelpers offers a safe, community-driven platform where you can find verified, trustworthy helpers. With detailed profiles, reviews, and the ability to communicate directly, hiring help has never been easier.</p>

            <p>Parenting in a new country doesn't have to be overwhelming. With the right support, you can create a nurturing environment that honors both

 your heritage and your family's future.</p>
        `,
        tags: ["Parenting", "Nanny", "Childcare"]
    },
    {
        id: 4,
        image: "/newassets/card1.png",
        category: "ARTICLES",
        date: "September 23, 2025",
        title: "Building Community Through Food: Indian Caterers Making Waves in America",
        description: "Food is more than sustenance—it's a connection to home, culture, and community...",
        content: `
            <p>Food is more than sustenance—it's a connection to home, culture, and community. For Indian families living in the U.S., authentic home-cooked meals can be hard to come by, especially when juggling demanding work schedules or hosting special occasions.</p>
            
            <p>This is where talented Indian caterers and tiffin service providers step in, bringing the flavors of India straight to American kitchens. From traditional biryanis and curries to regional specialties like Gujarati thalis and Bengali fish preparations, these culinary entrepreneurs are not just feeding families—they're preserving culture and building community.</p>

            <p>Sunita, a caterer based in Seattle, started her business from her home kitchen five years ago. "I wanted to share the taste of my grandmother's recipes with people who missed home," she explains. Today, she caters for over 30 families weekly and handles events ranging from birthday parties to Diwali celebrations.</p>

            <p>Through DesiHelpers, finding these skilled caterers has become effortless. Families can browse profiles, view menus, read reviews, and directly connect with caterers who specialize in their preferred regional cuisine. Whether you need daily tiffin service, catering for a mehendi ceremony, or custom cakes for a milestone celebration, there's someone in the community ready to help.</p>

            <p>Food brings people together, and for Indian immigrants, it's a powerful reminder of where they come from. By supporting local caterers and home chefs through platforms like DesiHelpers, we're not just enjoying delicious meals—we're strengthening the bonds that make our community thrive.</p>
        `,
        tags: ["Food", "Catering", "Community"]
    },
    {
        id: 6,
        image: "/newassets/card2.png",
        category: "ARTICLES",
        date: "September 07, 2025",
        title: "Celebrating Traditions Abroad: Finding Event Decorators for Indian Festivities",
        description: "Festivals and celebrations are at the heart of Indian culture...",
        content: `
            <p>Festivals and celebrations are at the heart of Indian culture. Whether it's Diwali, Holi, Navratri, or personal milestones like weddings and baby showers, these occasions bring families together and keep traditions alive. But recreating the magic of these celebrations in the U.S. can be challenging without the right resources.</p>
            
            <p>DesiHelpers connects you with talented event decorators, planners, and vendors who specialize in Indian festivities. From rangoli artists and mandap decorators to balloon specialists and florists who understand the cultural significance of marigolds and jasmine, these professionals help transform any space into a vibrant celebration of heritage.</p>

            <p>Anjali, who recently hosted her daughter's first birthday in Houston, shares: "I wanted a traditional South Indian bhogi pallu theme, and through DesiHelpers, I found a decorator who understood exactly what I envisioned. The setup was stunning, and my family felt like we were back in India."</p>

            <p>These decorators don't just arrange flowers and lights—they bring cultural authenticity, attention to detail, and a deep understanding of what makes each celebration special. Whether it's creating a beautiful backdrop for a Ganesh Chaturthi puja or setting up an elaborate stage for a sangeet night, their work ensures that every event feels genuine and memorable.</p>

            <p>By supporting local Indian event professionals through DesiHelpers, families can celebrate their traditions with pride and joy, creating lasting memories that honor their roots while building new ones in America.</p>
        `,
        tags: ["Events", "Decoration", "Festivals"]
    },
    {
        id: 7,
        image: "/newassets/card3nanny.png",
        category: "ARTICLES",
        date: "August 22, 2025",
        title: "Language Learning at Home: Finding Tutors for Hindi, Telugu, and More",
        description: "One of the biggest concerns for Indian parents raising children in the U.S. is language preservation...",
        content: `
            <p>One of the biggest concerns for Indian parents raising children in the U.S. is language preservation. While children quickly adapt to English in schools, maintaining fluency in their mother tongue—whether it's Hindi, Telugu, Tamil, Gujarati, or Punjabi—requires consistent effort and the right resources.</p>
            
            <p>DesiHelpers offers a solution by connecting families with qualified language tutors who can teach Indian languages both online and in-person. These tutors don't just focus on speaking—they incorporate cultural stories, traditional songs, and age-appropriate literature to make learning engaging and meaningful.</p>

            <p>Vikram, a parent in California, explains: "My son was losing touch with Tamil, and I wanted him to connect with his grandparents more easily. We found an excellent tutor through DesiHelpers who makes lessons fun with storytelling and interactive activities. Now my son looks forward to his weekly Tamil classes."</p>

            <p>Beyond children, many adults also seek language tutors to brush up on their skills or learn a new Indian language before traveling to India or connecting with extended family. Tutors offer flexible schedules, customized lesson plans, and the cultural context that makes language learning relevant and practical.</p>

            <p>Language is the bridge between generations. By investing in language education through trusted tutors on DesiHelpers, Indian families ensure that their children remain connected to their heritage, communicate with confidence, and carry forward the richness of their culture.</p>
        `,
        tags: ["Education", "Language", "Culture"]
    }
];

// --- Styles ---
const HeaderSection = styled(Box)({
    backgroundColor: "#002142", // Dark blue from screenshot
    color: "#ffffff",
    paddingTop: "140px",
    paddingBottom: "60px",
    textAlign: "center",
});

const BreadcrumbLink = styled(Link)({
    color: "rgba(255, 255, 255, 0.7)",
    textDecoration: "none",
    fontSize: "0.875rem",
    "&:hover": { color: "#ffffff" },
});

const SocialButton = styled(IconButton)({
    color: "#ffffff",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    margin: "0 8px",
    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
});

const TagChip = styled(Chip)({
    backgroundColor: "#FFEDE1", // Light orange bg
    color: "#fd7e14",         // Orange text
    fontWeight: 600,
    borderRadius: "16px",
    fontSize: "0.80rem",
    height: "28px",
});

const BlogPost = () => {
    const router = useRouter();
    const { id } = router.query;
    const article = articles.find((a) => a.id === Number(id));

    // Handle loading or not found
    if (!router.isReady) return null;
    if (!article) {
        return (
            <>
                <CHeader />
                <Container sx={{ py: 20, textAlign: 'center' }}>
                    <Typography variant="h4">Article not found</Typography>
                    <Link href="/resources"><Typography sx={{ mt: 2, color: 'blue' }}>Back to Resources</Typography></Link>
                </Container>
                <FooterSection />
            </>
        )
    }

    const relatedArticles = articles.filter(a => a.id !== article.id).slice(0, 3);

    return (
        <>
            <Head>
                <title>{article.title} | DesiHelpers</title>
            </Head>

            <CHeader />

            {/* Article Header */}
            <HeaderSection>
                <Container maxWidth="lg">
                    {/* Breadcrumbs */}
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>›</Typography>
                        <BreadcrumbLink href="/resources">Resources</BreadcrumbLink>
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>›</Typography>
                        <Typography variant="body2" sx={{ color: "#ffffff", maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {article.title}
                        </Typography>
                    </Stack>

                    <Typography variant="h3" sx={{ fontWeight: 700, maxWidth: "900px", mx: "auto", mb: 2, lineHeight: 1.2 }}>
                        {article.title}
                    </Typography>

                    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 4, opacity: 0.8 }}>
                        <Typography variant="body2">🕒 {article.date}</Typography>
                    </Stack>

                    <Box>
                        <SocialButton size="small"><FaLink /></SocialButton>
                        <SocialButton size="small"><FaLinkedin /></SocialButton>
                        <SocialButton size="small"><BsXLg /></SocialButton> {/* X Icon */}
                        <SocialButton size="small"><FaFacebook /></SocialButton>
                    </Box>
                </Container>
            </HeaderSection>

            {/* Article Content */}
            <Box sx={{ backgroundColor: "#ffffff" }}>
                <Container maxWidth="md" sx={{ py: 8 }}>
                    {/* Featured Image */}
                    <Box sx={{ borderRadius: "24px", overflow: "hidden", mb: 6, boxShadow: "0px 8px 30px rgba(0,0,0,0.1)" }}>
                        <img
                            src={article.image}
                            alt={article.title}
                            style={{ width: "100%", height: "auto", display: "block" }}
                        />
                    </Box>

                    {/* Body Text */}
                    <Box sx={{ typography: 'body1', lineHeight: 1.8, fontSize: '1.1rem', color: '#333' }}>
                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    </Box>

                    {/* Tags */}
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 6 }}>
                        <Typography variant="body2" fontWeight="bold">Tags:</Typography>
                        {article.tags.map(tag => (
                            <TagChip key={tag} label={tag} />
                        ))}
                    </Stack>

                    {/* Share Footer */}
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 4 }}>
                        <Typography variant="body2" color="text.secondary">Found this helpful? <strong>Share it with your friends!</strong></Typography>
                        <IconButton size="small" color="primary"><FaLink /></IconButton>
                        <IconButton size="small" color="primary"><FaLinkedin /></IconButton>
                        <IconButton size="small" color="primary"><BsXLg /></IconButton>
                        <IconButton size="small" color="primary"><FaFacebook /></IconButton>
                    </Stack>

                </Container>
            </Box>

            {/* Related Articles */}
            <Box sx={{ backgroundColor: "#f8f9fa", py: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#003366", textAlign: "center", mb: 6 }}>
                        You May Also Like To Read
                    </Typography>
                    <Grid container spacing={4}>
                        {relatedArticles.map((related) => (
                            <Grid item xs={12} sm={6} md={4} key={related.id}>
                                <BlogCard
                                    id={related.id}
                                    title={related.title}
                                    image={related.image}
                                    date={related.date}
                                    category={related.category}
                                    description={related.description}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Ready to Get Started Section */}
            <CTASection variant="blue" />

            {/* <FooterSection /> Duplicate footer removed */}
        </>
    );
};

export default BlogPost;
