-- Real content seed for Sameera Hussainy Pattan's portfolio.
-- Source: resume (127018042_PattanSameeraHussainy.pdf) + LinkedIn data export, supplied by the owner.
-- Run this once in the Supabase SQL editor, AFTER supabase/schema.sql.
-- Idempotent: every insert is guarded with "where not exists", so re-running is safe.

-- =========================================================================
-- Tech stack
-- =========================================================================

insert into public.tech_stack (name, category, display_order)
select v.name, v.category, v.display_order
from (values
  ('Python', 'language', 0),
  ('C', 'language', 1),
  ('C++', 'language', 2),
  ('Java', 'language', 3),
  ('R', 'language', 4),
  ('JavaScript', 'language', 5),
  ('SQL', 'language', 6),
  ('PL/SQL', 'language', 7),
  ('HTML5', 'language', 8),
  ('CSS', 'language', 9),
  ('React.js', 'framework', 0),
  ('Node.js', 'framework', 1),
  ('Express.js', 'framework', 2),
  ('TensorFlow', 'framework', 3),
  ('XGBoost', 'framework', 4),
  ('PyTorch', 'framework', 5),
  ('MongoDB', 'database', 0),
  ('Git', 'tool', 0),
  ('REST APIs', 'tool', 1),
  ('Microsoft Power BI', 'tool', 2),
  ('ObsPy', 'tool', 3),
  ('VS Code', 'tool', 4),
  ('Modelio', 'tool', 5),
  ('IBM Rational Software (UML)', 'tool', 6),
  ('Ubuntu', 'tool', 7),
  ('Cloud Computing', 'cloud', 0),
  ('Machine Learning', 'other', 0),
  ('Deep Learning', 'other', 1),
  ('Data Science', 'other', 2),
  ('Artificial Intelligence', 'other', 3),
  ('Cybersecurity', 'other', 4),
  ('Ethical Hacking', 'other', 5)
) as v(name, category, display_order)
where not exists (select 1 from public.tech_stack t where t.name = v.name);

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
