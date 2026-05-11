# SIKAPTala 2026: National CS & IT Competition
## IDEATHON: SOFTWARE DEVELOPMENT PROPOSAL

**Project Name:** SakAI  
**Target Sector:** Public Transportation & Social Inclusivity  
**Theme Alignment:** "How did I ever live without this?"  

---

### I. Rationale

Public transportation is the backbone of daily mobility in the Philippines. In urban areas, public transportation constitutes 80 percent of the overall ridership and trips, of which jeepneys serve 40 percent (Dimalanta et al., 2023). Despite this dominance, the jeepney — the most prevalent motorized land transport mode used by Filipino commuters — remains entirely invisible to modern digital navigation tools. This gap is the core problem SakAI addresses, transforming a chaotic daily struggle into a guided, predictable experience that makes users ask: *"How did I ever live without this?"*

While platforms like Google Maps offer routing for private vehicles, they provide zero guidance for the coded jeepney routes and landmark-based boarding points that define Philippine cities (Mateo-Babiano et al., 2020). This invisibility forces commuters to rely on fragmented local knowledge, a system that fails tourists, newcomers, and particularly persons with disabilities (PWDs). Research shows that accessibility and vehicle design are critical factors in passenger satisfaction for PWDs, yet no existing digital tool addresses route accessibility for this population (Ong et al., 2025).

The integration of artificial intelligence (AI) offers a direct solution. Large language models (LLMs) have demonstrated the capability to enhance route planning and provide personalized travel assistance by leveraging natural language processing (Jonnala et al., 2024). SakAI applies these capabilities to informal transit by combining a locally-verified Iloilo City route database with a conversational AI reasoning layer. It transforms raw transit data into clear, actionable, and personalized commute instructions delivered in the natural language Filipinos use to navigate their city.

---

### II. Whom is the solution for?

SakAI is designed to serve four distinct user groups:
1.  **Daily Commuters:** Students and workers (the primary 80% of ridership) who currently lack digital tools to plan unfamiliar trips or calculate costs (Dimalanta et al., 2023).
2.  **Tourists and Visitors:** Individuals unfamiliar with local codes and geography who need plain-language guidance on jeepney etiquette and route identification.
3.  **PWDs and Senior Citizens:** A critically underserved population facing significant physical barriers (Manila Bulletin, 2024). SakAI’s "Accessibility Mode" provides an independent commuting tool that prioritizes low-strain routes.
4.  **Ride-sharing Drivers:** Professionals who need to understand jeepney overlap zones to better advise passengers and optimize their own positioning.

---

### III. Objectives

#### **General Objective**
To develop **SakAI**, a web-based AI-powered commuter assistant that provides real-time public transportation routing, fare estimation, and personalized commute guidance for Iloilo City, bridging the gap between local commuting practices and modern navigation technology.

#### **Specific Objectives**
1.  **Smart Trip Planning:** To deliver step-by-step recommendations through an LLM-powered routing layer that intelligently combines jeepney routes, e-bus lines, and walking segments.
2.  **Landmark-Based Navigation:** To enable conversational navigation using locally meaningful landmark references (e.g., "Molo Church") rather than formal addresses.
3.  **Transparent Fare Estimation:** To compute trip costs based on LTFRB-registered rates, including applicable discounts for students, seniors, and PWDs.
4.  **Inclusive Commute Assistance:** To provide an "Accessibility Mode" for vulnerable populations and a "First Timer Mode" for boarding etiquette and signaling guidance.
5.  **Community-Driven Alerts:** To maintain data accuracy through a moderated "Community Route Bulletin" for real-time alerts on route suspensions and terminal relocations.

---

### IV. Software Solution Development Scope

SakAI is a responsive web-based AI application accessible through any modern browser on mobile and desktop devices, requiring no installation—a critical factor for accessibility across all income levels.

*   **Platform:** Responsive Web Application built with **React 19 and Vite 8** for industry-leading performance.
*   **AI Reasoning:** Powered by the **Gemini 2.0 Flash API**, which interprets informal geographic language and maps it to a structured JSON route database.
*   **Geospatial Data:** Uses the **OpenStreetMap API** via **Leaflet.js** for landmark visualization and map context without licensing costs.
*   **Backend & Storage:** Utilizes **Firebase** for moderated community bulletins and the **browser’s LocalStorage API** for the Pamasahe Tracker and Suki Routes, ensuring 100% user privacy and no backend dependency for personal data.

---

### V. Main Features

#### **1. AI Route Planner**
The core solution to "invisible" routing. Users type queries like "from SM City to WVSU" in natural language. The AI parses the request against the Iloilo City database to return a step-by-step guide with route codes, landmarks, and fare data.

#### **2. Landmark-Based Input**
Reflecting how Filipinos actually navigate (Santos & Reyes, 2023), this feature recognizes colloquial names like "Plaza Libertad" or "CPU Gate," lowering barriers for tourists and seniors who struggle with address-based systems.

#### **3. Fare Estimator**
Computes segment and total costs based on DOTr/LTFRB modernize program rates (DOTr, 2023), allowing budget-conscious students to plan expenses in advance.

#### **4. First Timer & Accessibility Modes**
"First Timer Mode" explains jeepney etiquette (e.g., "Para!", abot-bayad). "Accessibility Mode" filters routes for minimum walking and low-transfer options, addressing long-standing mobility barriers (University of the Philippines NCTS, 2024).

#### **5. Pamasahe Ko Tracker & Suki Routes**
On-device tools for saving "Suki" (frequent) routes and tracking weekly transport spending, promoting financial awareness without requiring a login.

#### **6. Community Bulletin & Nighttime Checker**
A moderated real-time alert system and a contextual flag for routes with reduced service after-hours, preventing commuters from being stranded at terminals.

---

### VI. Mockups

*   **Mockup 1: Dashboard Interface** - A clean, mobile-first home screen with a prominent "Where to?" landmark search and easy-access toggles for Accessibility and First-Timer modes.
*   **Mockup 2: Guided Route Result** - A visual timeline showing the jeepney route code, the specific boarding landmark, transfer instructions, and the calculated fare for each segment.
*   **Mockup 3: Pamasahe Tracker & Bulletin** - A high-contrast display of the current week's transport spending and a live feed of moderated community alerts (e.g., "Terminal Move" or "Flood Alert").

---

### VII. References

Department of Transportation. (2023). *Public transport modernization program*. Republic of the Philippines. https://dotr.gov.ph/puv-modernization-program/

Dimalanta, R. V., Atienza, R. V., Samonte, J. M., & Bautista, C. (2023). *Putting transport workers and commuters first: The route to just transition in public transport modernization*. University of the Philippines Center for Integrative and Development Studies.

Jonnala, R., Liang, G., Yang, J., & Alsmadi, I. (2024). *Using large language models in public transit systems: San Antonio as a case study*. arXiv. https://arxiv.org/abs/2407.11003

Larasati, D., Cahyono, B., & Purwarianti, A. (2023). Artificial intelligence for improving public transport: A mapping study. *Public Transport*. https://doi.org/10.1007/s12469-023-00334-7

Manila Bulletin. (2024, December 10). *Step-free access in PH public transportation*. https://mb.com.ph/2024/12/10/step-free-access-in-ph-public-transportation

Mateo-Babiano, I., Bean, R., Corcoran, J., & Pojani, D. (2020). Formalising the jeepney industry in the Philippines: A confirmatory thematic analysis of key transitionary issues. *Transport Policy*, 91, 46–56. https://doi.org/10.1016/j.tranpol.2020.03.009

Ong, A. K. S., Prasetyo, Y. T., & Nadlifatin, R. (2025). Enhancing accessibility in Philippine public bus systems: Addressing the needs of persons with disabilities. *Disabilities*, 5(2), 45. https://doi.org/10.3390/disabilities5020045

Santos, J. A. L., & Reyes, M. C. (2023). The jeepney as a microcosm of Philippine society: The commuters' perspectives. *International Journal of Social Science and Human Research*, 6(8).

University of the Philippines National Center for Transportation Studies. (2024). *Walang iwanan: Strengthening inclusive mobility for PWDs in the Philippines*. https://ncts.upd.edu.ph/walang-iwanan-strengthening-inclusive-mobility-for-pwds-in-the-philippines/

Wang, J., & Shalaby, A. (2024). *Leveraging large language models for enhancing public transit services*. arXiv. https://arxiv.org/abs/2410.14147
