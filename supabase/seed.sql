-- Real content seed for Sameera Hussainy Pattan's portfolio.
-- Source: resume (127018042_PattanSameeraHussainy.pdf) + LinkedIn data export, supplied by the owner.
-- Run this once in the Supabase SQL editor, AFTER supabase/schema.sql.
-- Idempotent: every insert is guarded with "where not exists", so re-running is safe.

-- =========================================================================
-- Tech stack
-- =========================================================================

-- icon_slug values are Simple Icons slugs (cdn.simpleicons.org/{slug}), verified
-- against simple-icons' own slugs.md — left null where no icon exists there.
insert into public.tech_stack (name, category, icon_slug, display_order)
select v.name, v.category, v.icon_slug, v.display_order
from (values
  ('Python', 'language', 'python', 0),
  ('C', 'language', 'c', 1),
  ('C++', 'language', 'cplusplus', 2),
  ('Java', 'language', null, 3),
  ('R', 'language', 'r', 4),
  ('JavaScript', 'language', 'javascript', 5),
  ('SQL', 'language', null, 6),
  ('PL/SQL', 'language', null, 7),
  ('HTML5', 'language', 'html5', 8),
  ('CSS', 'language', 'css', 9),
  ('React.js', 'framework', 'react', 0),
  ('Node.js', 'framework', 'nodedotjs', 1),
  ('Express.js', 'framework', 'express', 2),
  ('TensorFlow', 'framework', 'tensorflow', 3),
  ('XGBoost', 'framework', null, 4),
  ('PyTorch', 'framework', 'pytorch', 5),
  ('MongoDB', 'database', 'mongodb', 0),
  ('Git', 'tool', 'git', 0),
  ('REST APIs', 'tool', null, 1),
  ('Microsoft Power BI', 'tool', null, 2),
  ('ObsPy', 'tool', null, 3),
  ('VS Code', 'tool', null, 4),
  ('Modelio', 'tool', null, 5),
  ('IBM Rational Software (UML)', 'tool', null, 6),
  ('Ubuntu', 'tool', 'ubuntu', 7),
  ('Cloud Computing', 'cloud', null, 0),
  ('Machine Learning', 'other', null, 0),
  ('Deep Learning', 'other', null, 1),
  ('Data Science', 'other', null, 2),
  ('Artificial Intelligence', 'other', null, 3),
  ('Cybersecurity', 'other', null, 4),
  ('Ethical Hacking', 'other', null, 5)
) as v(name, category, icon_slug, display_order)
where not exists (select 1 from public.tech_stack t where t.name = v.name);

-- Backfill icon_slug for rows that already existed before this update.
update public.tech_stack set icon_slug = 'python' where name = 'Python' and icon_slug is null;
update public.tech_stack set icon_slug = 'c' where name = 'C' and icon_slug is null;
update public.tech_stack set icon_slug = 'cplusplus' where name = 'C++' and icon_slug is null;
update public.tech_stack set icon_slug = 'r' where name = 'R' and icon_slug is null;
update public.tech_stack set icon_slug = 'javascript' where name = 'JavaScript' and icon_slug is null;
update public.tech_stack set icon_slug = 'html5' where name = 'HTML5' and icon_slug is null;
update public.tech_stack set icon_slug = 'css' where name = 'CSS' and icon_slug is null;
update public.tech_stack set icon_slug = 'react' where name = 'React.js' and icon_slug is null;
update public.tech_stack set icon_slug = 'nodedotjs' where name = 'Node.js' and icon_slug is null;
update public.tech_stack set icon_slug = 'express' where name = 'Express.js' and icon_slug is null;
update public.tech_stack set icon_slug = 'tensorflow' where name = 'TensorFlow' and icon_slug is null;
update public.tech_stack set icon_slug = 'pytorch' where name = 'PyTorch' and icon_slug is null;
update public.tech_stack set icon_slug = 'mongodb' where name = 'MongoDB' and icon_slug is null;
update public.tech_stack set icon_slug = 'git' where name = 'Git' and icon_slug is null;
update public.tech_stack set icon_slug = 'ubuntu' where name = 'Ubuntu' and icon_slug is null;

-- =========================================================================
-- Internships (most recent/current first)
-- =========================================================================

insert into public.internships (company, role, location, start_date, end_date, description, display_order)
select 'Rakch.ai', 'AI/ML and Software Development Intern', 'India', '2026-04-01', null, null, 0
where not exists (select 1 from public.internships where company = 'Rakch.ai');

insert into public.internships (company, role, location, start_date, end_date, description, display_order)
select 'Indian Institute of Technology, Kharagpur', 'AI/ML Intern, KRITI Program', 'Kharagpur, West Bengal', '2026-05-24', '2026-07-10',
  'Developed an end-to-end machine learning system for seismic waveform analysis using Python, ObsPy, TensorFlow, and XGBoost to automate earthquake detection and multi-class seismic event classification.', 1
where not exists (select 1 from public.internships where company = 'Indian Institute of Technology, Kharagpur');

insert into public.internships (company, role, location, start_date, end_date, description, display_order)
select 'UCANLY x Wipro', 'Java Development Intern', null, '2026-04-01', '2026-04-30',
  'Developed Java applications using object-oriented programming principles, strengthening problem-solving skills through hands-on implementation of core Java concepts and software development practices.', 2
where not exists (select 1 from public.internships where company = 'UCANLY x Wipro');

insert into public.internships (company, role, location, start_date, end_date, description, display_order)
select 'Webstack Academy (WSA)', 'MERN Stack Development Intern', null, '2025-12-01', '2025-12-31',
  'Built a full-stack music playlist management system using the MERN stack, implementing REST APIs, CRUD operations, and a responsive UI with integrated database connectivity.', 3
where not exists (select 1 from public.internships where company = 'Webstack Academy (WSA)');

insert into public.internships (company, role, location, start_date, end_date, description, display_order)
select 'Vault of Codes', 'Web Development Intern', null, '2025-05-01', '2025-07-31', null, 4
where not exists (select 1 from public.internships where company = 'Vault of Codes');

-- Internship <-> tech stack links

insert into public.internship_tech_stack (internship_id, tech_stack_id)
select i.id, t.id from public.internships i, public.tech_stack t
where i.company = 'Indian Institute of Technology, Kharagpur' and t.name in ('Python', 'ObsPy', 'TensorFlow', 'XGBoost')
and not exists (select 1 from public.internship_tech_stack its where its.internship_id = i.id and its.tech_stack_id = t.id);

insert into public.internship_tech_stack (internship_id, tech_stack_id)
select i.id, t.id from public.internships i, public.tech_stack t
where i.company = 'Webstack Academy (WSA)' and t.name in ('React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs')
and not exists (select 1 from public.internship_tech_stack its where its.internship_id = i.id and its.tech_stack_id = t.id);

insert into public.internship_tech_stack (internship_id, tech_stack_id)
select i.id, t.id from public.internships i, public.tech_stack t
where i.company = 'UCANLY x Wipro' and t.name in ('Java')
and not exists (select 1 from public.internship_tech_stack its where its.internship_id = i.id and its.tech_stack_id = t.id);

-- =========================================================================
-- Projects (technical projects featured; research/concept projects not featured)
-- =========================================================================

insert into public.projects (title, slug, summary, description, featured, display_order)
select 'Bank Loan Management System', 'bank-loan-management-system',
  'Front-end for a bank loan management system, built with HTML, CSS, JavaScript, and React.',
  'Developed the front-end of a Bank Loan Management System using HTML, CSS, JavaScript, and React, while contributing to SRS documentation, UML design, requirement analysis, and system usability improvements.',
  true, 0
where not exists (select 1 from public.projects where slug = 'bank-loan-management-system');

insert into public.projects (title, slug, summary, description, featured, display_order)
select 'CASCADE: Algorithmic IT Asset Cascading Protocol', 'cascade-it-asset-cascading-protocol',
  'A software-driven framework for hardware health assessment, asset lifecycle extension, and carbon impact analysis.',
  'Developed CASCADE, a software-driven framework for hardware health assessment, asset lifecycle extension, and carbon impact analysis to reduce e-waste and promote sustainable computing.',
  true, 1
where not exists (select 1 from public.projects where slug = 'cascade-it-asset-cascading-protocol');

insert into public.projects (title, slug, summary, description, featured, display_order)
select 'AI/ML-Based Data Science Job Market Analysis', 'data-science-job-market-analysis',
  'A machine learning model predicting data science job salaries across 5,000 roles using an XGBoost regressor.',
  'Built a machine learning model to analyze and predict data science job salaries using a dataset of 5,000 roles with features like employee residence, experience level, employment type, work setting, company location, and company size. Performed data cleaning, exploratory data analysis with visualizations, label encoding of categorical features, and feature scaling, then trained an XGBoost regressor, evaluating performance using Mean Absolute Error (MAE).',
  true, 2
where not exists (select 1 from public.projects where slug = 'data-science-job-market-analysis');

insert into public.projects (title, slug, summary, description, featured, display_order)
select 'VUCA World: Geopolitical, Cyber & Biosecurity Risk Research', 'vuca-world-risk-research',
  'Team research project analyzing how modern conflicts unfold in a VUCA environment and how nations move from instability to resolution.',
  'A team project analysing how modern wars unfold in a VUCA (volatile, uncertain, complex, ambiguous) environment and how nations move from instability to resolution. Contributed to research, case-study analysis, and final report assembly, covering geopolitical, cyber, and biosecurity challenges and adaptive response strategies.',
  false, 3
where not exists (select 1 from public.projects where slug = 'vuca-world-risk-research');

insert into public.projects (title, slug, summary, description, featured, display_order)
select 'Aroviya Care: Solar-Powered Telemedicine Kiosk', 'aroviya-care-telemedicine-kiosk',
  'A solar-powered telemedicine kiosk concept improving healthcare accessibility for rural and underserved communities.',
  'Designed a technology-driven, solar-powered telemedicine kiosk aimed at improving healthcare accessibility in rural and underserved communities. Contributed to product planning, business strategy, market research, UI workflow design, and operational planning — integrating telemedicine, digital health records, diagnostic devices, and renewable energy for affordable remote healthcare. Conducted market analysis, SWOT analysis, financial planning, and end-to-end user journey design.',
  false, 4
where not exists (select 1 from public.projects where slug = 'aroviya-care-telemedicine-kiosk');

insert into public.projects (title, slug, summary, description, featured, display_order)
select 'PureSenz: Food Adulteration Detection Concept', 'puresenz-purity-detection',
  'A design-thinking concept for fast, user-friendly food adulteration detection using MNDT technology.',
  'A design thinking project focused on a food adulteration detection concept that delivers accurate, real-time purity insights using MNDT technology. Contributed to research, ideation, and shaping the final solution using user-centric methods.',
  false, 5
where not exists (select 1 from public.projects where slug = 'puresenz-purity-detection');

insert into public.projects (title, slug, summary, description, featured, display_order)
select 'Pratibimba E-Magazine', 'pratibimba-e-magazine',
  'Interview and content team member for SASTRA''s CSBS e-magazine, conducting interviews and shaping written coverage.',
  'Worked as part of the interview and content team for Pratibimba Magazine, conducting interviews with students and faculty and helping shape the written content for the publication. Contributed to developing clear, engaging articles and ensuring the magazine captured authentic voices and meaningful stories from the CSBS community.',
  false, 6
where not exists (select 1 from public.projects where slug = 'pratibimba-e-magazine');

insert into public.projects (title, slug, summary, description, github_url, featured, display_order)
select 'Fetal Health Classification', 'fetal-health-classification',
  'Machine learning model classifying fetal health using Logistic Regression, XGBoost, and MLP Neural Networks.',
  'Machine learning-based fetal health classification using Logistic Regression, XGBoost, and MLP Neural Networks.',
  'https://github.com/sameera-hussainy18/fetal-health-classification',
  false, 7
where not exists (select 1 from public.projects where slug = 'fetal-health-classification');

insert into public.projects (title, slug, summary, description, github_url, featured, display_order)
select 'Brain Tumor CNN Classification', 'brain-tumor-cnn-classification',
  'CNN-based brain tumor classification from MRI scans using PyTorch, with a full training and evaluation breakdown.',
  'CNN-based brain tumor classification from MRI scans using PyTorch — trained on Kaggle imaging data, with training curves, confusion matrix, and per-class performance breakdown.',
  'https://github.com/sameera-hussainy18/brain-tumor-cnn-classification',
  false, 8
where not exists (select 1 from public.projects where slug = 'brain-tumor-cnn-classification');

insert into public.projects (title, slug, summary, description, featured, display_order)
select 'Chettinad CodeFest: AI Agent & LLM Automation', 'chettinad-codefest-ai-agent',
  'Built an AI agent automation solution with LLM integration at Hackathon Chettinad CodeFest 2026.',
  'Participated in Hackathon Chettinad CodeFest 2026, organized by Overseas Cyber Technical Services (OCTS) Pvt. Ltd. Demonstrated skills in AI agent development, LLM integration, and intelligent automation, applying analytical thinking and software engineering principles to develop innovative solutions.',
  false, 9
where not exists (select 1 from public.projects where slug = 'chettinad-codefest-ai-agent');

-- Project <-> tech stack links

insert into public.project_tech_stack (project_id, tech_stack_id)
select p.id, t.id from public.projects p, public.tech_stack t
where p.slug = 'bank-loan-management-system' and t.name in ('HTML5', 'CSS', 'JavaScript', 'React.js')
and not exists (select 1 from public.project_tech_stack pts where pts.project_id = p.id and pts.tech_stack_id = t.id);

insert into public.project_tech_stack (project_id, tech_stack_id)
select p.id, t.id from public.projects p, public.tech_stack t
where p.slug = 'data-science-job-market-analysis' and t.name in ('Python', 'XGBoost', 'Machine Learning', 'Data Science')
and not exists (select 1 from public.project_tech_stack pts where pts.project_id = p.id and pts.tech_stack_id = t.id);

insert into public.project_tech_stack (project_id, tech_stack_id)
select p.id, t.id from public.projects p, public.tech_stack t
where p.slug = 'fetal-health-classification' and t.name in ('Python', 'XGBoost', 'Machine Learning')
and not exists (select 1 from public.project_tech_stack pts where pts.project_id = p.id and pts.tech_stack_id = t.id);

insert into public.project_tech_stack (project_id, tech_stack_id)
select p.id, t.id from public.projects p, public.tech_stack t
where p.slug = 'brain-tumor-cnn-classification' and t.name in ('Python', 'PyTorch', 'Deep Learning')
and not exists (select 1 from public.project_tech_stack pts where pts.project_id = p.id and pts.tech_stack_id = t.id);

insert into public.project_tech_stack (project_id, tech_stack_id)
select p.id, t.id from public.projects p, public.tech_stack t
where p.slug = 'chettinad-codefest-ai-agent' and t.name in ('Artificial Intelligence')
and not exists (select 1 from public.project_tech_stack pts where pts.project_id = p.id and pts.tech_stack_id = t.id);

-- =========================================================================
-- Certificates (most recent first)
-- =========================================================================

insert into public.certificates (title, issuer, issue_date, credential_url, credential_id, display_order)
select 'Hackathon Chettinad CodeFest 2026', 'OCTS Pvt. Ltd.', '2026-07-01', null, null, 0
where not exists (select 1 from public.certificates where title = 'Hackathon Chettinad CodeFest 2026');

insert into public.certificates (title, issuer, issue_date, credential_url, credential_id, display_order)
select 'TCS iON Career Edge – Young Professional', 'TCS iON', '2026-06-01', null, '272697-29721187-1016', 1
where not exists (select 1 from public.certificates where title = 'TCS iON Career Edge – Young Professional');

insert into public.certificates (title, issuer, issue_date, credential_url, credential_id, display_order)
select 'Joy of Computing using Python (NPTEL)', 'NPTEL', '2026-04-01',
  'https://nptel.ac.in/noc/E_Certificate/NPTEL26CS84S36650053704203782', 'NPTEL26CS84S366500537', 2
where not exists (select 1 from public.certificates where title = 'Joy of Computing using Python (NPTEL)');

insert into public.certificates (title, issuer, issue_date, credential_url, credential_id, display_order)
select 'Full Stack Web Development in MERN – Internship', 'Webstack Academy (WSA)', '2026-01-01', null, 'WMSI25_005', 3
where not exists (select 1 from public.certificates where title = 'Full Stack Web Development in MERN – Internship');

insert into public.certificates (title, issuer, issue_date, credential_url, credential_id, display_order)
select 'Web Development Internship', 'Vault of Codes', '2025-12-01', null, 'CORPORATE6511252d7c3271695622445', 4
where not exists (select 1 from public.certificates where title = 'Web Development Internship');

insert into public.certificates (title, issuer, issue_date, credential_url, credential_id, display_order)
select 'Master Data Science & Machine Learning – Foundations to Deep Learning and LLMs', 'HCL GUVI', '2025-12-01',
  'https://www.guvi.in/share-certificate/4977803o68jLa8R514', '4977803o68jLa8R514', 5
where not exists (select 1 from public.certificates where title = 'Master Data Science & Machine Learning – Foundations to Deep Learning and LLMs');

insert into public.certificates (title, issuer, issue_date, credential_url, credential_id, display_order)
select 'Power BI Workshop', 'Office Master', '2025-12-01',
  'https://certx.in/certificate/36a28147-6eed-47a5-8342-e5f926ebba61829534', '42', 6
where not exists (select 1 from public.certificates where title = 'Power BI Workshop');

insert into public.certificates (title, issuer, issue_date, credential_url, credential_id, display_order)
select 'Ethical Hacking & Cybersecurity Workshop', 'Vault of Codes', '2025-12-01', null, null, 7
where not exists (select 1 from public.certificates where title = 'Ethical Hacking & Cybersecurity Workshop');

insert into public.certificates (title, issuer, issue_date, credential_url, credential_id, display_order)
select 'Responsive Web Design Developer Certification', 'freeCodeCamp', '2025-12-01',
  'https://www.freecodecamp.org/certification/sameera_hussainy18/responsive-web-design-v9', null, 8
where not exists (select 1 from public.certificates where title = 'Responsive Web Design Developer Certification');

insert into public.certificates (title, issuer, issue_date, credential_url, credential_id, display_order)
select 'AI Tools & ChatGPT Workshop', 'Be10x', '2025-11-01',
  'https://certx.in/certificate/0270772f-3809-4400-b29b-1e1c61cd0997823035', '46', 9
where not exists (select 1 from public.certificates where title = 'AI Tools & ChatGPT Workshop');

insert into public.certificates (title, issuer, issue_date, credential_url, credential_id, display_order)
select 'Cloud Computing (NPTEL)', 'NPTEL', '2025-10-01',
  'https://nptel.ac.in/noc/E_Certificate/NPTEL25CS107S46990045510204398', 'NPTEL25CS107S469900455', 10
where not exists (select 1 from public.certificates where title = 'Cloud Computing (NPTEL)');

insert into public.certificates (title, issuer, issue_date, credential_url, credential_id, display_order)
select 'AI Hackathon – Certificate of Participation', 'DAKSH', '2025-03-01', null, null, 11
where not exists (select 1 from public.certificates where title = 'AI Hackathon – Certificate of Participation');

insert into public.certificates (title, issuer, issue_date, credential_url, credential_id, display_order)
select 'DAKSH''25 – Team Hospitality', 'DAKSH', '2025-03-01', null, null, 12
where not exists (select 1 from public.certificates where title = 'DAKSH''25 – Team Hospitality');

-- =========================================================================
-- Coursework
-- =========================================================================

-- Source: SASTRA University's official "Scheme of Study" for the B.Tech in
-- Computer Science and Business Systems (Semesters I-VI), supplied by the
-- owner. Only courses that are substantively CS or Business are included:
-- CSE/INT-coded courses -> cs; MGT-coded, "Business Communication & Value
-- Science"-coded (ENG), and COM-coded courses -> business; Operations
-- Research is classified business given its direct tie to the owner's
-- Supply Chain & Project Management minor. General foundation courses
-- (Mathematics, Physics, Electrical/Electronics Engineering) and non-credit
-- courses (Induction, Environmental Sciences, Indian Constitution, Essence
-- of Indian Traditional Knowledge) are omitted as belonging to neither
-- track. Sem 5 elective: Modern Web Applications (INT316). Sem 6 elective:
-- Behavioural Economics (MGT222) — both confirmed by the owner from the
-- Departmental Electives options.
insert into public.coursework (category, semester, course_code, course_title, display_order)
select v.category, v.semester, v.course_code, v.course_title, v.display_order
from (values
  -- Computer Science
  ('cs', 1, 'CSE106', 'Fundamentals of Computer Science', 0),
  ('cs', 2, 'CSE209', 'Data Structures & Algorithms', 0),
  ('cs', 3, 'CSE211', 'Formal Language and Automata Theory', 0),
  ('cs', 3, 'CSE212', 'Computer Organization & Architecture', 1),
  ('cs', 3, 'CSE213', 'Object Oriented Programming', 2),
  ('cs', 3, 'CSE214', 'Computational Statistics', 3),
  ('cs', 3, 'INT104', 'Database Management Systems', 4),
  ('cs', 4, 'CSE308', 'Operating Systems', 0),
  ('cs', 4, 'CSE215', 'Software Engineering', 1),
  ('cs', 4, 'CSE318', 'Algorithm Design Strategies & Analysis', 2),
  ('cs', 5, 'CSE316', 'Software Design with UML', 0),
  ('cs', 5, 'CSE320', 'Compiler Design', 1),
  ('cs', 5, 'INT316', 'Modern Web Applications (Elective)', 2),
  ('cs', 6, 'CSE322', 'Computer Networking Principles & Components', 0),
  ('cs', 6, 'INT313', 'Computer System Security', 1),
  ('cs', 6, 'INT314', 'Artificial Intelligence & Logical Reasoning', 2),
  -- Business
  ('business', 1, 'ENG136', 'Business Communication & Value Science — I', 0),
  ('business', 2, 'MGT131', 'Fundamentals of Economics', 0),
  ('business', 2, 'ENG138', 'Business Communication & Value Science — II', 1),
  ('business', 4, 'MGT207', 'Introduction to Innovation, IP Management & Entrepreneurship', 0),
  ('business', 4, 'ENG212', 'Business Communication & Value Science — III', 1),
  ('business', 4, 'MAT330R01', 'Operations Research', 2),
  ('business', 5, 'MGT132', 'Fundamentals of Management for Engineers', 0),
  ('business', 5, 'MGT133', 'Business Strategy', 1),
  ('business', 5, 'ENG315', 'Design Thinking', 2),
  ('business', 6, 'COM117', 'Financial & Cost Accounting', 0),
  ('business', 6, 'ENG316', 'Business Communication & Value Science — IV', 1),
  ('business', 6, 'MGT222', 'Behavioural Economics (Elective)', 2)
) as v(category, semester, course_code, course_title, display_order)
where not exists (select 1 from public.coursework c where c.course_code = v.course_code);

-- Minor (Logistics & Supply Chain / Project Management) and Honours (NPTEL)
-- tracks, supplied directly by the owner. No official course code confirmed
-- for these yet, so course_code is left null (shown once she provides it).
-- Guarded by course_title since course_code is null here.
insert into public.coursework (category, semester, course_code, course_title, display_order)
select v.category, v.semester, null, v.course_title, v.display_order
from (values
  ('minor', 3, 'Logistics and Supply Chain Management', 0),
  ('minor', 4, 'Digital Supply Chain Transformation', 1),
  ('minor', 5, 'Total Productive Maintenance', 2),
  ('minor', 6, 'Project Management', 3),
  ('honours', 5, 'Cloud Computing', 0),
  ('honours', 6, 'Joy of Computing', 1)
) as v(category, semester, course_title, display_order)
where not exists (select 1 from public.coursework c where c.course_title = v.course_title);

-- =========================================================================
-- Updates from the November 2026 resume (127018042_PattanSameeraHussainy.pdf)
-- Where the resume conflicts with details the owner gave directly, the direct
-- details stay: CGPA 9.27 (site config) and the KRITI dates (May 24 - Jul 10).
-- =========================================================================

-- New skills
insert into public.tech_stack (name, category, icon_slug, display_order)
select v.name, v.category, v.icon_slug, v.display_order
from (values
  ('TypeScript', 'language', 'typescript', 10),
  ('Next.js', 'framework', 'nextdotjs', 6),
  ('Tailwind CSS', 'framework', 'tailwindcss', 7),
  ('Prisma', 'framework', 'prisma', 8),
  ('FastAPI', 'framework', 'fastapi', 9),
  ('Keras', 'framework', 'keras', 10),
  ('Scikit-learn', 'framework', 'scikitlearn', 11),
  ('Pandas', 'framework', 'pandas', 12),
  ('NumPy', 'framework', 'numpy', 13),
  ('Sentence-Transformers', 'framework', null, 14),
  ('PostgreSQL', 'database', 'postgresql', 1),
  ('Supabase', 'database', 'supabase', 2),
  ('Vercel', 'cloud', 'vercel', 1),
  ('MATLAB', 'tool', null, 8),
  ('Streamlit', 'tool', 'streamlit', 9),
  ('Generative AI', 'other', null, 6)
) as v(name, category, icon_slug, display_order)
where not exists (select 1 from public.tech_stack t where t.name = v.name);

-- Internships
update public.internships set
  location = 'Delhi (Remote)',
  end_date = '2026-08-01',
  description = 'Built CredEx, a role-based lending management system for SME loan origination, spanning KYC, underwriting, co-lending, sanction, and disbursement, with rule-based credit decisioning driven by CIBIL score.'
where company = 'Rakch.ai';

update public.internships set
  description = 'Built an ML pipeline (ObsPy, TensorFlow, XGBoost) that detects earthquakes in raw seismic waveforms with a CNN and classifies event type with XGBoost: 95.78% detection and 93.17% classification accuracy.'
where company = 'Indian Institute of Technology, Kharagpur';

update public.internships set
  location = 'Remote',
  description = 'Built a Java card-deck simulator with enums, encapsulated Card and Deck classes, and the Collections framework, supporting shuffling, exception-guarded draws, and multi-key sorting via Comparator chaining and lambdas.'
where company = 'UCANLY x Wipro';

-- New projects
insert into public.projects (title, slug, summary, description, featured, display_order)
select v.title, v.slug, v.summary, v.description, false, v.display_order
from (values
  ('SASTRA Companion', 'sastra-companion',
   'Multi-user academic dashboard for timetable, attendance, OD leave, academic calendar, and SGPA/CGPA, with a calendar-PDF parser, email-OTP and JWT authentication, and Playwright-tested CI.',
   'Built and deployed a multi-user academic dashboard (July - October 2026) for timetable, attendance, OD leave, academic calendar, and SGPA/CGPA, with a calendar-PDF parser, email-OTP and JWT authentication, and Playwright-tested CI.',
   0),
  ('TalentIQ: Job–Resume Matching', 'talentiq-job-resume-matching',
   'Explainable job–resume matcher (SASTRA mini project): a MiniLM encoder fine-tuned with contrastive learning plus 20 field-level signals, reaching 0.962 MAP vs 0.533 for BM25 keyword search.',
   'Built an explainable job–resume matcher (SASTRA mini project, August - November 2026) by fine-tuning a MiniLM encoder with contrastive learning on hard negatives and scoring 20 field-level signals with a sign-constrained logistic-regression model. Reached 0.962 MAP vs 0.533 for BM25 keyword search; shipped an on-device Streamlit app that reads PDF, Word, and scanned resumes (Tesseract OCR) and quotes the resume line behind every match.',
   1),
  ('OneRecon: AI-Powered Reconciliation', 'onerecon-ai-reconciliation',
   'Built at a BNP Paribas 24-hour hackathon: reconciles XML, CSV, and REST ledgers with LLM-suggested field mapping, a deterministic matching engine, and anomaly checks, with a 90.58% match rate over 22,258 records.',
   'Built at a BNP Paribas 24-hour hackathon (September 2026): reconciles XML, CSV, and REST ledgers with LLM-suggested field mapping, a deterministic matching engine, and anomaly checks, with a 90.58% match rate over 22,258 records.',
   2)
) as v(title, slug, summary, description, display_order)
where not exists (select 1 from public.projects p where p.slug = v.slug);

insert into public.project_tech_stack (project_id, tech_stack_id)
select p.id, t.id
from (values
  ('sastra-companion', array['Next.js', 'React.js', 'TypeScript', 'Prisma', 'PostgreSQL']),
  ('talentiq-job-resume-matching', array['Python', 'PyTorch', 'Sentence-Transformers', 'Streamlit']),
  ('onerecon-ai-reconciliation', array['React.js', 'Node.js', 'FastAPI', 'MongoDB'])
) as v(slug, techs)
join public.projects p on p.slug = v.slug
join public.tech_stack t on t.name = any (v.techs)
where not exists (
  select 1 from public.project_tech_stack pts
  where pts.project_id = p.id and pts.tech_stack_id = t.id
);

-- Results from the resume on existing projects
update public.projects set
  summary = 'End-to-end ML pipeline for seismic waveforms: a CNN detects earthquakes in raw waveforms (95.78% accuracy) and XGBoost classifies the event type (93.17%), built with Python, TensorFlow, XGBoost, and ObsPy.',
  description = 'End-to-end ML pipeline for seismic waveforms: a CNN detects earthquakes in raw waveforms (95.78% accuracy) and XGBoost classifies the event type (93.17%), built with Python, TensorFlow, XGBoost, and ObsPy.'
where title = 'Applications of ML in Earthquake';

update public.projects set
  summary = 'Fetal health classification on 2,126 cardiotocography (CTG) records, comparing Logistic Regression, XGBoost, and an MLP neural network, with 93.66% accuracy.',
  description = 'Fetal health classification on 2,126 cardiotocography (CTG) records, comparing Logistic Regression, XGBoost, and an MLP neural network, with 93.66% accuracy.'
where title = 'Fetal Health Classification';

update public.projects set
  summary = 'Custom PyTorch CNN classifying 7,023 brain MRI scans into four tumor classes at 84.31% test accuracy, with training curves, a confusion matrix, and a per-class breakdown.',
  description = 'Custom PyTorch CNN classifying 7,023 brain MRI scans into four tumor classes at 84.31% test accuracy, with training curves, a confusion matrix, and a per-class breakdown.'
where title = 'Brain Tumor CNN Classification';

-- Summary was cut off mid-word by the GitHub import; wording from the owner's GitHub profile README.
update public.projects set
  summary = 'Full-stack placement-season tracker: applications, interview reminders, calendar view, and session auth.'
where title = 'Placement Tracker';

-- Explicit order for every project (several shared 0, so their order wasn't stable).
update public.projects p set display_order = v.display_order
from (values
  ('SASTRA Companion', 0),
  ('TalentIQ: Job–Resume Matching', 1),
  ('OneRecon: AI-Powered Reconciliation', 2),
  ('Applications of ML in Earthquake', 3),
  ('Fetal Health Classification', 4),
  ('Brain Tumor CNN Classification', 5),
  ('CASCADE: Algorithmic IT Asset Cascading Protocol', 6),
  ('Chettinad CodeFest: AI Agent & LLM Automation', 7),
  ('Placement Tracker', 8),
  ('Portfolio', 9),
  ('Bank Loan Management System', 10),
  ('AI/ML-Based Data Science Job Market Analysis', 11),
  ('VUCA World: Geopolitical, Cyber & Biosecurity Risk Research', 12),
  ('Aroviya Care: Solar-Powered Telemedicine Kiosk', 13),
  ('PureSenz: Food Adulteration Detection Concept', 14),
  ('Pratibimba E-Magazine', 15)
) as v(title, display_order)
where p.title = v.title;

-- Tags for projects that had none (from their own repos).
insert into public.project_tech_stack (project_id, tech_stack_id)
select p.id, t.id
from (values
  ('Portfolio', array['Next.js', 'React.js', 'TypeScript', 'Tailwind CSS', 'Supabase']),
  ('CASCADE: Algorithmic IT Asset Cascading Protocol', array['Python'])
) as v(title, techs)
join public.projects p on p.title = v.title
join public.tech_stack t on t.name = any (v.techs)
where not exists (
  select 1 from public.project_tech_stack pts
  where pts.project_id = p.id and pts.tech_stack_id = t.id
);

-- =========================================================================
-- Semester 7 coursework, Maths & Science block, Coursera certificate (Nov 2026)
-- Source: SASTRA scheme of study (Semesters I-VII) and the owner's choices:
-- Elective III = Machine Learning Essentials, Elective IV = Data Mining and
-- Analytics; semester 7 Honours = Introduction to Generative AI (Coursera).
-- Labs, projects, and non-credit courses stay out, as before.
-- =========================================================================


insert into public.coursework (category, semester, course_code, course_title, display_order)
select v.category, v.semester, v.course_code, v.course_title, v.display_order
from (values
  -- Maths & Science
  ('foundation', 1, 'MAT133', 'Discrete Mathematics', 0),
  ('foundation', 1, 'MAT132', 'Probability & Statistics', 1),
  ('foundation', 1, 'EEE104', 'Principles of Electrical Engineering', 2),
  ('foundation', 1, 'PHY137', 'Fundamentals of Physics', 3),
  ('foundation', 2, 'MAT134', 'Linear Algebra', 0),
  ('foundation', 2, 'MAT244', 'Statistical Modelling', 1),
  ('foundation', 2, 'EIE219', 'Principles of Electronics', 2),
  -- Semester 7
  ('cs', 7, 'CSE232', 'Usability Design of Software Applications', 0),
  ('cs', 7, 'INT318', 'IT Workshop (Scilab / MATLAB)', 1),
  ('cs', 7, 'CSE425', 'Machine Learning Essentials (Elective)', 2),
  ('cs', 7, 'INT317', 'Data Mining and Analytics (Elective)', 3),
  ('business', 7, 'MGT211', 'Fundamentals of Human Resource Management', 0),
  ('business', 7, 'MGT212', 'Introduction to Financial Management', 1)
) as v(category, semester, course_code, course_title, display_order)
where not exists (select 1 from public.coursework c where c.course_code = v.course_code);

insert into public.coursework (category, semester, course_code, course_title, display_order)
select 'honours', 7, null, 'Introduction to Generative AI', 2
where not exists (select 1 from public.coursework c where c.course_title = 'Introduction to Generative AI');

-- Coursera certificate (newest, so first; the rest shift down one).
update public.certificates set display_order = display_order + 1
where not exists (select 1 from public.certificates where title = 'Introduction to Generative AI');

insert into public.certificates (title, issuer, issue_date, credential_url, credential_id, image_url, display_order)
select 'Introduction to Generative AI', 'Duke University (Coursera)', '2026-09-13',
  'https://coursera.org/verify/S6T489LV07MB', 'S6T489LV07MB',
  'https://xkdfzzsfljaldbjgfkak.supabase.co/storage/v1/object/public/certificate-images/1795113239786.jpeg', 0
where not exists (select 1 from public.certificates where title = 'Introduction to Generative AI');
