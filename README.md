Hello! This is a complete shopping cart application I built from scratch to practice and demonstrate my skills in backend and frontend development.

The main goal of this project was to build a secure, real-world application, so I focused heavily on getting the user authentication right. For this, I implemented a system using JSON Web Tokens (JWT).

How the JWT Authentication Works in This Project
I wanted to build a modern, stateless security system, which is what JWT is perfect for. Here's a simple breakdown of how it works from the moment a user logs in:

1. User Logs In

A user enters their username and password on the login page.

2. The Server Checks and Creates the JWT

The backend (my Spring Boot app) checks if the credentials are correct.

If they are, it doesn't create a session on the server. Instead, it creates a special, digitally signed "pass" called a JWT.

Inside this JWT, I've stored some useful, non-sensitive information like the user's username and, importantly, their roles (like ROLE_USER or ROLE_ADMIN). The token also has an expiration time.

3. The Browser Stores the JWT

The server sends this JWT back to the user's browser, which stores it safely in Local Storage.

4. Accessing Protected Pages

Now, whenever the user tries to access a page that requires them to be logged in (like their shopping cart, order history, or the admin page), the browser automatically attaches the JWT to the request header.

5. The Server Verifies the JWT

A security filter on my backend acts like a bouncer. It intercepts every request to a protected page and looks for the JWT.

It checks the token's signature to make sure it hasn't been tampered with and also checks that it hasn't expired.

If the token is valid, the filter allows the request to proceed. If the user is trying to access an admin-only page, the filter also checks if the token contains the ROLE_ADMIN role. If not, access is denied.

This whole process happens on every single protected API call, ensuring the application is secure without needing to store session information on the server.

A Deeper Look at JWT (My Rough Notes)
To really understand what's going on, I thought of a JWT as being like a tamper-proof ID card that a user carries. It has three parts separated by dots (.):

HEADER.PAYLOAD.SIGNATURE

Here's my breakdown of what each part does:

The Header (The "What")

This is the first part. It's just a bit of JSON that says, "Hey, this is a JWT, and here's the algorithm I used to sign it." It's just housekeeping info.

The Payload (The "Who" and "What they can do")

This is the interesting part. It contains the "claims" about the user. In my project, this is where I put the username and their roles (ROLE_ADMIN, etc.).

This part is not encrypted, it's just encoded. Anyone can see what's inside. That's why you should never put sensitive information like passwords in the payload.

The Signature (The "Proof of Authenticity")

This is the most important part for security.

To create the signature, the server takes the Header, the Payload, and a secret key that only the server knows. It mashes them all together and signs them with the algorithm from the header.

When the browser sends the JWT back to the server, the server does the exact same process again. If the signature it generates matches the signature on the token, it knows two things:

The token was created by this server (because only it knows the secret key).

The payload has not been changed or tampered with since it was created.

That's the magic of it. Because of the signature, the server can trust the information in the payload without having to store anything about the user's session. It's completely stateless.

Key Features of the Application
Full User Authentication: Secure user registration and login system.

Product Catalog: Users can browse all available products.

Shopping Cart: A fully functional cart where users can add and remove items.

Order History: Users can view a list of their past orders.

Admin Dashboard: A special page for admins to add new products (with image uploads) and delete existing ones.

Role-Based Access: The application has two roles: USER and ADMIN. The admin dashboard is protected and only accessible to users with the admin role.

Technologies Used
Backend: Java, Spring Boot, Spring Security, Spring Data JPA (Hibernate)

Database: MySQL

Security: JSON Web Tokens (JWT)

Frontend: Vanilla JavaScript, HTML, Tailwind CSS

API Documentation: Swagger / OpenAPI

How to Run This Project Locally
If you'd like to run this project on your own machine, here are the steps:

Clone the repository:

git clone https://github.com/braj026/e_cart.git

Set up the database:

Make sure you have MySQL installed and running.

Create a new database named ecommerce_db.

Configure the application:

Open the src/main/resources/application.properties file.

Update the spring.datasource.username and spring.datasource.password fields with your own MySQL credentials.

Run the backend:

Open the project in your IDE (like IntelliJ or VSCode).

Run the main application file EcommerceCartAppApplication.java. The server will start on port 8080.

Access the frontend:

Open your web browser and go to http://localhost:8080.

Admin Login
To access the admin dashboard, you can use the default admin account that is created automatically when the application starts:

Username: admin

Password: admin123

Thanks for checking out my project!
