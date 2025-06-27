# E-Cart: 
Hi, thanks for checking out my e-commerce project. I made this to get better at coding and see if I could build a full website from start to finish.

For me, the hardest part was the security. I wanted to know, how does a site remember you are logged in? I learned about something called JWT (JSON Web Tokens) and decided to try it.

# How I Made the Login Secure with JWT
My simple idea for it is like a concert ticket. You show it once at the gate to get a wristband. After that, you can go anywhere inside just by showing the wristband, not the main ticket.

JWT works the same way in my app:

A user logs in with their name and password.

My Java backend checks the password. If it's okay, it creates the JWT "wristband".

The browser gets this JWT and saves it.

When the user visits another page (like the cart), the browser sends the JWT along.

My backend has a security filter that checks if the JWT is real. If it is, the user can see the page.

The best part is, the server doesn't need to keep a list of who is logged in. It just needs to check the wristband each time. This is called "stateless" and it's a very modern way to build apps.

# My Rough Notes on JWT
To really understand it, I wrote down some simple notes for myself. A JWT is just a long string with two dots in it, splitting it into three parts.

PART1.PART2.PART3

Part 1: The Header

This is just some basic info, like "this is a JWT". Not very exciting.

Part 2: The Payload

This is the useful part! It's where I put the user's information. For my project, I stored the username and the user's role (like ROLE_ADMIN or ROLE_USER).

Important: This part is not secret. Anyone can see what's inside. That's why I would never put a password or other private data here.

Part 3: The Signature

This is the magic part that makes it secure.

The server takes the first two parts and signs them with a secret key that only the server knows.

If anyone tries to change the payload (like changing their role from "USER" to "ADMIN"), the signature won't match anymore. The server will know the token is a fake and will block it. This makes the JWT "tamper-proof".

# What This App Can Do
🔐 Secure Login & Sign Up: Users can create an account and log in securely.

🛍️ Product Catalog: You can see all the products for sale.

🛒 Shopping Cart: Add or remove items from your cart.

📜 Order History: See a list of your past purchases.

⚙️ Admin Dashboard: A special page where an admin can add new products and delete old ones.

# Tech I Used
Backend: Java, Spring Boot, Spring Security

Database: MySQL

Security: JSON Web Tokens (JWT)

Frontend: Plain JavaScript, HTML, and Tailwind CSS (for styling)

# How to Run This Project
Want to try it yourself? Here's how:

Clone the project:

git clone https://github.com/braj026/ecomm_cart.git

# Database Setup:

You need MySQL on your computer.

Create a new database and name it ecommerce_db.

# Update Config:

Go to src/main/resources/application.properties.

Change the username and password to your MySQL login details.

Run it:

Open the project in your code editor (like IntelliJ or VSCode).

Find and run the EcommerceCartAppApplication.java file.

Open your browser and go to http://localhost:8080.

# Admin Login
You can log in as an admin to add/delete products with these details:

Username: admin

Password: admin123

# Thanks for looking at my project! I hope my notes help you understand JWT a little better.
