const bookListColumns = [
  { name: "Id", uid: "id" },
  { name: "Book Name", uid: "bookName" },
  { name: "Author Name", uid: "authorName" },
  { name: "Year", uid: "year" },
  { name: "Publishers", uid: "publisher" },
  { name: "Editions", uid: "edition" },
  { name: "Status", uid: "isActive" },
  { name: "ACTIONS", uid: "actions" },
];

const bookListData = [
  {
    id: 1,
    book_name: "The Great Gatsby",
    author_name: "F. Scott Fitzgerald",
    year: 1925,
    publisher_name: "Charles Scribner's Sons",
    edition: "1st Edition",
    status: "active",
  },
  {
    id: 2,
    book_name: "To Kill a Mockingbird",
    author_name: "Harper Lee",
    year: 1960,
    publisher_name: "J.B. Lippincott & Co.",
    edition: "40th Anniversary Edition",
    status: "active",
  },
  {
    id: 3,
    book_name: "1984",
    author_name: "George Orwell",
    year: 1949,
    publisher_name: "Secker & Warburg",
    edition: "Centennial Edition",
    status: "active",
  },
  {
    id: 4,
    book_name: "Pride and Prejudice",
    author_name: "Jane Austen",
    year: 1813,
    publisher_name: "Thomas Egerton",
    edition: "Original Edition",
    status: "inactive",
  },
  {
    id: 5,
    book_name: "Moby Dick",
    author_name: "Herman Melville",
    year: 1851,
    publisher_name: "Harper & Brothers",
    edition: "1st Edition",
    status: "active",
  }
];

const userListColumns = [
  { name: "User ID", uid: "id" },
  { name: "User Name", uid: "username" },
  { name: "Mobile", uid: "mobilenum" },
  { name: "Email", uid: "emailid" },
  { name: "Created At", uid: "createdAt" },
  { name: "Status", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const studentListData = [
  {
    id: 1,
    student_id: "S001",
    student_name: "John Doe",
    grade: "A",
    mobile: "+91 9597493541",
    status: "active",
    email: "john.doe@example.com",
  },
  {
    id: 2,
    student_id: "S002",
    student_name: "Jane Smith",
    grade: "B",
    mobile: "+91 9597493541",
    status: "inactive",
    email: "jane.smith@example.com",
  },
  {
    id: 3,
    student_id: "S003",
    student_name: "Alice Johnson",
    grade: "A",
    mobile: "+91 9597493541",
    status: "active",
    email: "alice.johnson@example.com",
  },
  {
    id: 4,
    student_id: "S004",
    student_name: "Bob Brown",
    grade: "C",
    mobile: "+91 9597493541",
    status: "active",
    email: "bob.brown@example.com",
  },
  {
    id: 5,
    student_id: "S005",
    student_name: "Charlie Davis",
    grade: "B",
    mobile: "+91 9597493541",
    status: "active",
    email: "charlie.davis@example.com",
  }
];

const professorListColumns = [
  { name: "Professor Id", uid: "professor_id" },
  { name: "Professor Name", uid: "professor_name" },
  { name: "Role", uid: "role" },
  { name: "Status", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const professorListData = [
  {
    id: 1,
    professor_id: "P001",
    professor_name: "Dr. John Smith",
    role: "Professor of Physics",
    status: "active",
  },
  {
    id: 2,
    professor_id: "P002",
    professor_name: "Dr. Jane Doe",
    role: "Professor of Mathematics",
    status: "active",
  },
  {
    id: 3,
    professor_id: "P003",
    professor_name: "Dr. Albert Einstein",
    role: "Theoretical Physicist",
    status: "inactive",
  },
  {
    id: 4,
    professor_id: "P004",
    professor_name: "Dr. Marie Curie",
    role: "Professor of Chemistry",
    status: "inactive",
  },
  {
    id: 5,
    professor_id: "P005",
    professor_name: "Dr. Nikola Tesla",
    role: "Electrical Engineer",
    status: "active",
  }
];
const bookMappingListColumns = [
  { name: "ID", uid: "id" },
  { name: "Book", uid: "book" },
  { name: "Student Grade", uid: "student_grade" },
  { name: "Professor Role", uid: "professor_role" },
  { name: "ACTIONS", uid: "actions" },
];

const bookMappingListData = [
  {
    id:1,
    book: "Book associated with Dr. John Smith",
    student_grade: "A",
    professor_role: "Professor of Physics",
  },
  {
    id:2,
    book: "Book associated with Dr. Jane Doe",
    student_grade: "A",
    professor_role: "Professor of Mathematics",
  },
  {
    id:3,
    book: "Book associated with Dr. Albert Einstein",
    student_grade: "A",
    professor_role: "Theoretical Physicist",
  },
  {
    id:4,
    book: "Book associated with Dr. Marie Curie",
    student_grade: "A",
    professor_role: "Professor of Chemistry",
  },
  {
    id:5,
    book: "Book associated with Dr. Nikola Tesla",
    student_grade: "A",
    professor_role: "Electrical Engineer",
  },
];




export {bookListColumns, bookListData, userListColumns, studentListData, professorListColumns, professorListData, bookMappingListColumns, bookMappingListData};
