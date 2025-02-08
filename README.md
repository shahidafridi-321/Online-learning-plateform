# Online-learning-plateform

Planning:
creating an online learning platform that will have two views , one for students and one for teachers .

Student view:
in this view, the students will see all the courses on the platform , a student dashboard that will show all the courses in which the student is enrolled. It will contains a lot of other details is well.

Teacher view:
in this view there will be teachers dashboard where they can upload,update and delete courses ,lectures and payment details and methods.

Objectives:

1. to provide an easy way for learning to students.
2. to provide a way for teachers to monetize their courses.

Project Setup:
Introduction:

the project will be developed using modern technologies , the most popular “MERN stack” meaning MongosDb , database for data storing, Express , a library use for server side routing and communication between frontend and backend, React , a javascript library for creating frontend web apps and reuseable components and Node.js, a run time enviroment to run code outside browser for server side logic only.
Create project:
inside I create two directories client and server.

Client:

1. will have frontend code
2. install frontend packages needed. For now we have installed react for creating components and tailwindCSS for styling.

Server:

1. will have backend code
2. install backend packages needed. For now we have installed ,
   bcryptjs: To hash and verify passwords securely.
   cloudinary: To upload, store, and manage media files like images and videos.
   cors: To handle Cross-Origin Resource Sharing, allowing API access from different domains. express: To build web servers and APIs using Node.js.
   dotenv: To manage environment variables securely.
   jsonwebtoken: To generate and verify JSON Web Tokens (JWT) for authentication.
   multer: To handle file uploads in Node.js applications.
   paypal-rest-sdk: To integrate PayPal payment functionality into applications.

References:
learn what collections and documents is ,from the MongoDB manual to get a basic idea of how a document database stores data.

MongoDB service providers:
The internet is full of mongodb services providers but we will be using MongoDB Atlas.

Challenges:
I have faced a problem of database connection when I was try to get connection to online mongoDB service provider “Altas MongoDB” I got error “ETIMEOUT” I tried and research a lot but cannot find any solution at the end I decide to use mongoDB locally so I installed it on my machine.

  <!-- 
  now i am going to start the filtring logic for courses based on catagories,level such beginer or advance and language.i added handleFilterOnChange function that is called when a value is checked or unchecked in select options,i also added a function createSearchParamsHelper that will create dynamic URI using useSearchParams hook by selecting multiple choices for filtering next i am going to do little changes on my backend for data filtring logic in course-controller file.so in getAllStudentViewCourses function a added logic for sorting and filtring.applied filters succefully now students can sort by low to high price and vice versa also on A to Z and vice versa and now also can filter on categories ,levels and language,use another use effect to setFilters and setSort from sessionstorage. Remove filters from sessionStorage using useEffect when visite studentHomePage.Add loading state and pass it student context and then consume it in coursepage of students when loading it shows skelton just to remove page blanking ,its done

  now i am created a new page component called StudentViewCourseDetailsPage create route for it for navigations,Add onClick event to Card when clicked it navigates to that particular course details page using useNavigate hook
   -->
