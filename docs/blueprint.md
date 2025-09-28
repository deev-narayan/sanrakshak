# **App Name**: Sanrakshak

## Core Features:

- New Collection Form: Form for farmers to submit a CollectionEvent with species, weight, photo upload (simulated), and auto-detected location.
- Blockchain Validation: Use a tool that is a Javascript implementation of a blockchain that runs the smart contract to validate collection event data, including species and location, before saving to the database.
- Submit Test Report Form: Form for lab technicians to submit a QualityTest with sampleId, batchId, moisturePct, pesticideDetected, reportCid, and labSignature.
- Add Processing Step Form: Form for manufacturers to add processing steps with stepName and details.
- Finalize Batch & Generate QR: Functionality for manufacturers to finalize a batch and generate a QR code for consumer verification.
- Consumer QR Resolver: Public page to display the full provenance timeline for a batch based on the batchId from the URL, including farmer details, collection location, lab results, and processing steps.
- Role-Based Dashboards: Dashboards with role-based access (Farmer, Lab, Manufacturer, Regulator) to view relevant data and perform actions.

## Style Guidelines:

- Primary color: Green (#41A95E) for buttons, success states, and highlights. This color evokes feelings of nature, health, and trustworthiness which are related to the sustainable sourcing of natural ingredients, and thus appropriate to the app.
- Accent color: Brown-Orange (#CC9767) for secondary buttons and info tags. Brown complements green because it's commonly seen with plant life; using orange ensures enough contrast from the green and dark text.
- Background color: Cream (#F4F4DC) for all page and card backgrounds; it serves as a soft, natural backdrop that's easy on the eyes and complements the brand's color scheme.
- Text color: Dark (#333333) for headings and body text, offering high readability and a professional feel against the light cream background.
- Font: 'Poppins', a clean, modern sans-serif font. Note: currently only Google Fonts are supported.
- Fixed dark-grey sidebar for navigation, providing easy access to different views based on user roles. Main content area with the cream background for a consistent look and feel.
- Use clean and professional icons to represent different actions and data points. The icons should be easily understandable and visually consistent with the overall design.