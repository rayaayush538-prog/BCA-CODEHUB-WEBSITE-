/* =====================================================
   EDIT HERE: everything you will change later is in this
   first block. You do not need to touch the code below it.
   ===================================================== */

// Contact number in international format (91 = India, no + or spaces)
const WHATSAPP_NUMBER = "918750399015";

// All six BCA semesters. Prices are different for each semester.
// A semester with no "subjects" shows a "coming soon" message instead of prices.
// To open a new semester later: add its prices and subjects, nothing else.
// For a subject, "code" can be "" and "details" can be left out (a default text is used).
const SEMESTERS = [
  {
    number: 1,
    pricePerSubject: 279,     // one subject, in rupees
    priceAllSubjects: 1399,   // all subjects of this semester together
    subjects: [
      { name: "Environmental Science",           code: "DCA1110" },
      { name: "Fundamentals of Computers",       code: "DCA1108" },
      { name: "C Programming",                   code: "" },
      { name: "Introduction to Web Programming", code: "" },
      { name: "Fundamentals of Mathematics",     code: "" },
      { name: "Technical Skills",                code: "" }
    ]
  },
  { number: 2, subjects: [] },   // prices and subjects will be added later
  { number: 3, subjects: [] },
  { number: 4, subjects: [] },
  { number: 5, subjects: [] },
  { number: 6, subjects: [] }
];

// Newest notice first. Delete or add blocks as needed.
const NOTICES = [
  { date: "21 Oct 2026", title: "New CodeHub website is live", text: "Updates, assignments and community links are now on one page." },
  { date: "21 Oct 2026", title: "Semester 1 assignment orders are open", text: "One subject costs ₹" + SEMESTERS[0].pricePerSubject + " and all subjects cost ₹" + SEMESTERS[0].priceAllSubjects + ". Other semesters will be added soon." }