import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.answerUnlock.deleteMany({});
  await prisma.answer.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.companyUnlock.deleteMany({});
  await prisma.company.deleteMany({});
  
  const companies = [
    // Tier 1: 15+ LPA (Premium)
    { name: "Google", pkg: "120+ LPA", gpa: 7.5, branches: ["CSE", "IT", "ECE"], roles: ["SDE-I", "SDE-II"], skills: ["DSA", "Java", "Python"], desc: "Google India hiring for core engineering" },
    { name: "Microsoft", pkg: "110+ LPA", gpa: 7.3, branches: ["CSE", "IT"], roles: ["SDE", "Cloud Engineer"], skills: ["C++", "Python", "Azure"], desc: "Microsoft Cloud and AI roles" },
    { name: "Amazon", pkg: "100+ LPA", gpa: 7.0, branches: ["CSE", "IT", "ECE"], roles: ["SDE", "DevOps"], skills: ["Java", "DSA", "AWS"], desc: "Amazon AWS and retail tech" },
    { name: "Meta", pkg: "110+ LPA", gpa: 7.5, branches: ["CSE", "IT"], roles: ["E3", "E4"], skills: ["C++", "React", "Systems Design"], desc: "Meta (Facebook) India campus" },
    { name: "Apple", pkg: "105+ LPA", gpa: 7.8, branches: ["CSE", "IT"], roles: ["SDE", "Hardware Engineer"], skills: ["Swift", "C++", "Embedded Systems"], desc: "Apple hardware and software" },
    { name: "Netflix", pkg: "95+ LPA", gpa: 7.4, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["Scala", "Java", "Streaming"], desc: "Netflix streaming platform" },
    { name: "Stripe", pkg: "100+ LPA", gpa: 7.2, branches: ["CSE", "IT"], roles: ["Backend Engineer"], skills: ["Go", "Python", "Payments"], desc: "Stripe payments platform" },
    { name: "Uber", pkg: "90+ LPA", gpa: 6.8, branches: ["CSE", "IT", "ECE"], roles: ["SDE", "Data Engineer"], skills: ["Java", "Scala", "Big Data"], desc: "Uber platform and maps" },
    { name: "Atlassian", pkg: "90+ LPA", gpa: 7.0, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["Java", "JavaScript", "DevOps"], desc: "Atlassian Jira and Confluence" },
    { name: "Uber Eats", pkg: "85+ LPA", gpa: 6.9, branches: ["CSE", "IT"], roles: ["Backend Engineer"], skills: ["Java", "Node.js", "Databases"], desc: "Uber food delivery platform" },
    
    // Tier 2: 10-15 LPA (High Range)
    { name: "Goldman Sachs", pkg: "90+ LPA", gpa: 7.5, branches: ["CSE", "IT"], roles: ["Analyst", "Associate"], skills: ["Java", "Python", "Finance"], desc: "Goldman Sachs trading systems" },
    { name: "Morgan Stanley", pkg: "85+ LPA", gpa: 7.3, branches: ["CSE", "IT"], roles: ["SDE", "Trader"], skills: ["C++", "Python", "Algorithms"], desc: "Morgan Stanley financial tech" },
    { name: "JPMorgan Chase", pkg: "80+ LPA", gpa: 7.0, branches: ["CSE", "IT", "ECE"], roles: ["Software Engineer"], skills: ["Java", "Spring", "Kubernetes"], desc: "JPMorgan trading and tech" },
    { name: "HubSpot", pkg: "75+ LPA", gpa: 6.7, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["JavaScript", "Python", "React"], desc: "HubSpot CRM platform" },
    { name: "Zoho", pkg: "70+ LPA", gpa: 6.5, branches: ["CSE", "IT"], roles: ["SDE", "DevOps"], skills: ["Java", "JavaScript", "Cloud"], desc: "Zoho suite of applications" },
    { name: "Flipkart", pkg: "80+ LPA", gpa: 6.8, branches: ["CSE", "IT", "ECE"], roles: ["SDE", "Data Engineer"], skills: ["Java", "Scala", "Python"], desc: "Flipkart e-commerce platform" },
    { name: "Swiggy", pkg: "75+ LPA", gpa: 6.5, branches: ["CSE", "IT"], roles: ["Backend Engineer", "Mobile Engineer"], skills: ["Java", "Go", "Kotlin"], desc: "Swiggy food delivery" },
    { name: "Zomato", pkg: "80+ LPA", gpa: 6.5, branches: ["CSE", "IT", "ECE"], roles: ["SDE", "ML Engineer"], skills: ["Python", "Java", "Machine Learning"], desc: "Zomato fintech and food" },
    { name: "Razorpay", pkg: "85+ LPA", gpa: 6.6, branches: ["CSE", "IT"], roles: ["Backend Engineer"], skills: ["Go", "Python", "Node.js"], desc: "Razorpay payment gateway" },
    { name: "PhonePe", pkg: "80+ LPA", gpa: 6.5, branches: ["CSE", "IT"], roles: ["SDE", "Platform Engineer"], skills: ["Java", "Kotlin", "Python"], desc: "PhonePe digital payments" },
    
    // Tier 3: 8-12 LPA (Mid-High Range)
    { name: "Infosys", pkg: "70+ LPA", gpa: 6.0, branches: ["CSE", "IT", "ECE", "Mech"], roles: ["Associate SDE", "SDE"], skills: ["Java", "Python", "Spring"], desc: "Infosys IT services" },
    { name: "TCS", pkg: "65+ LPA", gpa: 5.8, branches: ["CSE", "IT", "ECE", "Mech"], roles: ["Associate Engineer", "SDE"], skills: ["Java", "C++", "Mainframe"], desc: "TCS IT services giant" },
    { name: "Accenture", pkg: "70+ LPA", gpa: 6.0, branches: ["CSE", "IT", "ECE"], roles: ["Associate SDE", "SDE"], skills: ["Java", "JavaScript", "Cloud"], desc: "Accenture consulting and tech" },
    { name: "Capgemini", pkg: "65+ LPA", gpa: 5.8, branches: ["CSE", "IT", "ECE", "Mech"], roles: ["Associate Engineer", "SDE"], skills: ["Java", "Python", "DevOps"], desc: "Capgemini IT consulting" },
    { name: "Cognizant", pkg: "68+ LPA", gpa: 6.0, branches: ["CSE", "IT", "ECE", "Mech"], roles: ["Associate SDE", "SDE"], skills: ["Java", "C++", "Python"], desc: "Cognizant IT services" },
    { name: "HCL Technologies", pkg: "72+ LPA", gpa: 6.2, branches: ["CSE", "IT", "ECE"], roles: ["Trainee SDE", "SDE"], skills: ["Java", "Python", "SQL"], desc: "HCL enterprise solutions" },
    { name: "Mindtree", pkg: "75+ LPA", gpa: 6.3, branches: ["CSE", "IT", "ECE"], roles: ["Associate SDE", "SDE"], skills: ["Java", "JavaScript", "AWS"], desc: "Mindtree digital transformation" },
    { name: "Persistent Systems", pkg: "70+ LPA", gpa: 6.0, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["Java", "Python", "Embedded Systems"], desc: "Persistent software services" },
    { name: "Tech Mahindra", pkg: "65+ LPA", gpa: 5.8, branches: ["CSE", "IT", "ECE", "Mech"], roles: ["Associate SDE", "SDE"], skills: ["Java", "Python", "Cloud"], desc: "Tech Mahindra IT services" },
    { name: "Wipro", pkg: "68+ LPA", gpa: 6.0, branches: ["CSE", "IT", "ECE", "Mech"], roles: ["Associate SDE", "SDE"], skills: ["Java", "C++", "Python"], desc: "Wipro IT services" },
    
    // Tier 4: 5-8 LPA (Mid Range)
    { name: "OlaElectric", pkg: "80+ LPA", gpa: 6.5, branches: ["CSE", "IT", "ECE", "Mech"], roles: ["Software Engineer", "Firmware Engineer"], skills: ["Python", "C++", "Embedded Systems"], desc: "OlaElectric EV technology" },
    { name: "Freshworks", pkg: "80+ LPA", gpa: 6.4, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["JavaScript", "Python", "React"], desc: "Freshworks customer engagement" },
    { name: "Dailyhunt", pkg: "60+ LPA", gpa: 6.0, branches: ["CSE", "IT"], roles: ["Backend Engineer", "Android Engineer"], skills: ["Go", "Java", "Kotlin"], desc: "Dailyhunt content platform" },
    { name: "Dream11", pkg: "75+ LPA", gpa: 6.2, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["Java", "Python", "AWS"], desc: "Dream11 gaming platform" },
    { name: "Paytm", pkg: "70+ LPA", gpa: 6.0, branches: ["CSE", "IT"], roles: ["SDE", "DevOps Engineer"], skills: ["Java", "Go", "Kubernetes"], desc: "Paytm fintech platform" },
    { name: "BookMyShow", pkg: "65+ LPA", gpa: 5.8, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["Java", "Python", "React"], desc: "BookMyShow ticketing platform" },
    { name: "Unacademy", pkg: "62+ LPA", gpa: 5.9, branches: ["CSE", "IT"], roles: ["Backend Engineer", "Frontend Engineer"], skills: ["JavaScript", "Python", "Node.js"], desc: "Unacademy education platform" },
    { name: "Byju's", pkg: "60+ LPA", gpa: 5.8, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["Java", "JavaScript", "React"], desc: "Byju's learning platform" },
    { name: "Ola", pkg: "70+ LPA", gpa: 6.0, branches: ["CSE", "IT", "ECE"], roles: ["Software Engineer", "Data Engineer"], skills: ["Python", "Java", "Spark"], desc: "Ola mobility platform" },
    { name: "ShareChat", pkg: "65+ LPA", gpa: 6.0, branches: ["CSE", "IT"], roles: ["Backend Engineer"], skills: ["Go", "Python", "Node.js"], desc: "ShareChat social platform" },
    
    // Tier 5: 3-5 LPA (Base Range)
    { name: "Airtable", pkg: "85+ LPA", gpa: 6.5, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["JavaScript", "TypeScript", "React"], desc: "Airtable no-code platform" },
    { name: "Asana", pkg: "75+ LPA", gpa: 6.2, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["JavaScript", "Python", "Databases"], desc: "Asana project management" },
    { name: "Airbnb", pkg: "90+ LPA", gpa: 7.0, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["JavaScript", "Python", "React"], desc: "Airbnb marketplace platform" },
    { name: "Slack", pkg: "85+ LPA", gpa: 6.8, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["JavaScript", "Go", "TypeScript"], desc: "Slack messaging platform" },
    { name: "Notion", pkg: "80+ LPA", gpa: 6.5, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["JavaScript", "TypeScript", "React"], desc: "Notion all-in-one workspace" },
    { name: "Figma", pkg: "85+ LPA", gpa: 6.7, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["JavaScript", "Rust", "WebAssembly"], desc: "Figma design platform" },
    { name: "Canva", pkg: "75+ LPA", gpa: 6.3, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["JavaScript", "Python", "React"], desc: "Canva design tool" },
    { name: "Slack India", pkg: "75+ LPA", gpa: 6.0, branches: ["CSE", "IT"], roles: ["Software Engineer", "DevOps Engineer"], skills: ["Python", "Go", "JavaScript"], desc: "Slack India operations" },
    { name: "Oracle", pkg: "80+ LPA", gpa: 6.5, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["Java", "C++", "Database"], desc: "Oracle database and cloud" },
    { name: "IBM", pkg: "65+ LPA", gpa: 6.0, branches: ["CSE", "IT", "ECE"], roles: ["Software Engineer"], skills: ["Java", "Python", "Cloud"], desc: "IBM enterprise solutions" },
    
    // Tier 6: Additional Variety (2-4 LPA)
    { name: "Amazon Web Services (AWS)", pkg: "85+ LPA", gpa: 6.8, branches: ["CSE", "IT"], roles: ["SDE", "Solutions Architect"], skills: ["Java", "Python", "AWS"], desc: "AWS India operations" },
    { name: "Deloitte", pkg: "68+ LPA", gpa: 6.0, branches: ["CSE", "IT", "ECE"], roles: ["Associate Consultant", "Consultant"], skills: ["Java", "Python", "Consulting"], desc: "Deloitte consulting and tech" },
    { name: "EY", pkg: "62+ LPA", gpa: 5.8, branches: ["CSE", "IT", "ECE"], roles: ["Associate Consultant"], skills: ["Java", "Python", "Cloud"], desc: "EY advisory services" },
    { name: "PwC", pkg: "65+ LPA", gpa: 6.0, branches: ["CSE", "IT"], roles: ["Consultant", "Senior Consultant"], skills: ["Java", "Python", "Analytics"], desc: "PwC consulting and tech" },
    { name: "Gartner", pkg: "60+ LPA", gpa: 5.8, branches: ["CSE", "IT"], roles: ["Research Analyst", "Software Engineer"], skills: ["Python", "SQL", "Analytics"], desc: "Gartner research and analytics" },
    { name: "Forrester", pkg: "58+ LPA", gpa: 5.7, branches: ["CSE", "IT"], roles: ["Research Analyst"], skills: ["Python", "Analytics", "SQL"], desc: "Forrester research firm" },
    { name: "RPG Group", pkg: "55+ LPA", gpa: 5.5, branches: ["CSE", "IT", "Mech"], roles: ["Software Engineer"], skills: ["Java", "Python", "Manufacturing"], desc: "RPG manufacturing tech" },
    { name: "Tata Steel", pkg: "60+ LPA", gpa: 5.8, branches: ["CSE", "IT", "Mech", "MetE"], roles: ["Software Engineer"], skills: ["Java", "AutoCAD", "IoT"], desc: "Tata Steel digital transformation" },
    { name: "Reliance", pkg: "65+ LPA", gpa: 6.0, branches: ["CSE", "IT", "Mech", "ChE"], roles: ["Software Engineer", "Process Engineer"], skills: ["Java", "Python", "SAP"], desc: "Reliance energy and retail tech" },
    { name: "HDFC Bank", pkg: "70+ LPA", gpa: 6.2, branches: ["CSE", "IT"], roles: ["Software Engineer", "Risk Analyst"], skills: ["Java", "Python", "Finance"], desc: "HDFC banking platform" },
    
    // Tier 7: Additional Coverage (2-3 LPA)
    { name: "ICICI Bank", pkg: "68+ LPA", gpa: 6.0, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["Java", "Python", "Banking"], desc: "ICICI banking solutions" },
    { name: "Axis Bank", pkg: "65+ LPA", gpa: 5.9, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["Java", "C++", "Databases"], desc: "Axis Bank tech platform" },
    { name: "KOTAK Mahindra", pkg: "62+ LPA", gpa: 5.8, branches: ["CSE", "IT"], roles: ["Associate SDE"], skills: ["Java", "Python", "Financial Systems"], desc: "Kotak banking services" },
    { name: "Aditya Birla Group", pkg: "60+ LPA", gpa: 5.7, branches: ["CSE", "IT", "Mech"], roles: ["Software Engineer"], skills: ["Java", "Python", "ERP"], desc: "Aditya Birla conglomerate tech" },
    { name: "Mahindra", pkg: "62+ LPA", gpa: 5.8, branches: ["CSE", "IT", "Mech", "Auto"], roles: ["Software Engineer"], skills: ["Java", "Python", "Automotive"], desc: "Mahindra automotive tech" },
    { name: "Hero MotoCorp", pkg: "58+ LPA", gpa: 5.6, branches: ["CSE", "IT", "Mech"], roles: ["Software Engineer"], skills: ["Embedded C", "Python", "IoT"], desc: "Hero MotoCorp digital" },
    { name: "Maruti Suzuki", pkg: "60+ LPA", gpa: 5.7, branches: ["CSE", "IT", "Mech", "Auto"], roles: ["Software Engineer"], skills: ["Java", "Embedded Systems", "Automation"], desc: "Maruti tech and manufacturing" },
    { name: "BMW India", pkg: "65+ LPA", gpa: 6.0, branches: ["CSE", "IT", "Mech"], roles: ["Software Engineer", "Systems Engineer"], skills: ["C++", "Python", "Embedded C"], desc: "BMW automotive tech" },
    { name: "Mercedes Benz", pkg: "68+ LPA", gpa: 6.2, branches: ["CSE", "IT", "Mech"], roles: ["Software Engineer"], skills: ["C++", "Embedded Systems", "IoT"], desc: "Mercedes vehicle software" },
    { name: "Ford", pkg: "60+ LPA", gpa: 5.8, branches: ["CSE", "IT", "Mech"], roles: ["Software Engineer"], skills: ["C++", "Embedded C", "Automotive"], desc: "Ford India tech center" },
    
    // Tier 8: Startups and Emerging (2+ LPA)
    { name: "Meesho", pkg: "70+ LPA", gpa: 6.2, branches: ["CSE", "IT"], roles: ["SDE", "Backend Engineer"], skills: ["Go", "Python", "React"], desc: "Meesho social commerce" },
    { name: "Dunzo", pkg: "65+ LPA", gpa: 6.0, branches: ["CSE", "IT"], roles: ["Backend Engineer"], skills: ["Python", "Go", "Databases"], desc: "Dunzo delivery platform" },
    { name: "Grofers", pkg: "62+ LPA", gpa: 5.9, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["Java", "Python", "React"], desc: "Grofers grocery delivery" },
    { name: "BigBasket", pkg: "68+ LPA", gpa: 6.1, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["Java", "Scala", "AWS"], desc: "BigBasket online grocery" },
    { name: "NoBroker", pkg: "60+ LPA", gpa: 5.8, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["Python", "JavaScript", "React"], desc: "NoBroker real estate platform" },
    { name: "Urban Ladder", pkg: "55+ LPA", gpa: 5.5, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["JavaScript", "Python", "eCommerce"], desc: "Urban Ladder furniture retail" },
    { name: "Pepperfry", pkg: "58+ LPA", gpa: 5.6, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["Java", "JavaScript", "eCommerce"], desc: "Pepperfry furniture marketplace" },
    { name: "LendingKart", pkg: "60+ LPA", gpa: 5.8, branches: ["CSE", "IT"], roles: ["Backend Engineer", "Data Engineer"], skills: ["Python", "SQL", "Finance"], desc: "LendingKart fintech lending" },
    { name: "CoinSwitch", pkg: "65+ LPA", gpa: 6.0, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["Go", "Python", "Blockchain"], desc: "CoinSwitch crypto exchange" },
    { name: "Polygon", pkg: "70+ LPA", gpa: 6.2, branches: ["CSE", "IT"], roles: ["Blockchain Engineer"], skills: ["Solidity", "Go", "TypeScript"], desc: "Polygon blockchain platform" },
    
    // Tier 9: Government and Public Sector (2+ LPA)
    { name: "ISRO", pkg: "50+ LPA", gpa: 6.5, branches: ["CSE", "IT", "ECE", "Mech"], roles: ["Scientist", "Engineer"], skills: ["C", "Python", "Satellite Systems"], desc: "ISRO space research" },
    { name: "DRDO", pkg: "48+ LPA", gpa: 6.3, branches: ["CSE", "IT", "ECE", "Mech"], roles: ["Scientist", "Engineer"], skills: ["C++", "Embedded Systems", "Defense"], desc: "DRDO defense research" },
    { name: "NTPC", pkg: "55+ LPA", gpa: 6.0, branches: ["CSE", "IT", "Mech", "Civil"], roles: ["Executive Trainee"], skills: ["Java", "Automation", "SCADA"], desc: "NTPC power generation" },
    { name: "ONGC", pkg: "58+ LPA", gpa: 6.1, branches: ["CSE", "IT", "Mech", "Petro"], roles: ["Executive Trainee"], skills: ["Python", "Automation", "Oil & Gas"], desc: "ONGC oil and gas" },
    { name: "BSNL", pkg: "45+ LPA", gpa: 5.5, branches: ["CSE", "IT", "ECE"], roles: ["JTO", "Executive Engineer"], skills: ["Python", "Networking", "Telecom"], desc: "BSNL telecommunications" },
    { name: "Indian Railways", pkg: "50+ LPA", gpa: 5.8, branches: ["CSE", "IT", "Mech", "Civil"], roles: ["Software Engineer", "Systems Engineer"], skills: ["Java", "Databases", "Railway Systems"], desc: "Indian Railways IT systems" },
    { name: "Bank of India", pkg: "52+ LPA", gpa: 5.9, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["Java", "COBOL", "Banking"], desc: "Bank of India core banking" },
    { name: "State Bank of India", pkg: "55+ LPA", gpa: 6.0, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["Java", "Python", "Banking"], desc: "SBI banking platform" },
    { name: "Punjab National Bank", pkg: "50+ LPA", gpa: 5.8, branches: ["CSE", "IT"], roles: ["Software Engineer"], skills: ["Java", "Databases", "Banking"], desc: "PNB banking services" },
    { name: "Indian Bureau of Mines", pkg: "45+ LPA", gpa: 5.5, branches: ["CSE", "IT", "Mining"], roles: ["Engineer", "Software Engineer"], skills: ["GIS", "Python", "Mining Tech"], desc: "IBM mining technology" },
  ];
  
  const questions = [
    "Find two sum", "Reverse string", "Prime check", "Queue from stacks",
    "Merge arrays", "Search matrix", "Longest substring", "Tree traversal",
    "Detect cycle", "LRU cache", "URL shortener", "Notifications", "Distributed cache",
    "Database indexing", "SQL join", "ACID properties", "Processes vs threads",
    "Deadlock prevention", "Microservices", "CAP theorem", "Parking lot design",
    "Singleton pattern", "HashMap vs HashTable", "Event-driven architecture", "Trie structure",
    "Binary search tree", "Graph algorithms", "Dynamic programming intro", "Greedy algorithms",
    "Sorting algorithms", "Hashing techniques", "Linked list operations", "Stack applications",
    "Queue operations", "Tree balancing", "Recursion problems", "Backtracking algorithms",
    "String matching", "Pattern recognition", "Design patterns", "System design basics"
  ];
  
  console.log("🌱 Seeding database with companies and questions...");
  
  for (const c of companies) {
    await prisma.company.create({
      data: { 
        name: c.name, 
        package: c.pkg, 
        minGpa: c.gpa, 
        eligibleBranches: c.branches,
        roles: c.roles,
        requiredSkills: c.skills,
        description: c.desc,
        bundlePrice: Math.floor(Math.random() * 50) + 30 
      }
    });
  }
  
  const allComps = await prisma.company.findMany();
  let questionCount = 0;
  
  for (const comp of allComps) {
    for (const q of questions.slice(0, Math.floor(Math.random() * 15) + 10)) {
      await prisma.question.create({
        data: { 
          content: q, 
          round: ["Coding", "Design", "HR"][Math.floor(Math.random() * 3)], 
          year: 2023 + Math.floor(Math.random() * 3),
          companyId: comp.id,
          isPremium: Math.random() > 0.7
        }
      });
      questionCount++;
    }
  }
  
  const stats = { 
    c: await prisma.company.count(), 
    q: questionCount,
    avgGpa: (await prisma.company.aggregate({ _avg: { minGpa: true } }))._avg.minGpa?.toFixed(2)
  };
  console.log(`✅ Seeded successfully: ${stats.c} companies, ${stats.q} questions, avg GPA: ${stats.avgGpa}`);
}

main().catch(e => console.error("❌ Seed error:", e)).finally(async () => prisma.$disconnect());
