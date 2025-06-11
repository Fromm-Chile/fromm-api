# Fromm API

## Technologies Used

- **Node.js** (v20 recommended): JavaScript runtime for server-side code.
- **NestJS**: Framework for building scalable Node.js server-side applications.
- **TypeScript**: Strongly typed programming language that builds on JavaScript.
- **Prisma ORM**: Database toolkit for TypeScript and Node.js.
- **SQL Server**: Main database used for development and production.
- **Multer**: Middleware for handling file uploads.
- **bcrypt**: Library for hashing passwords.
- **Nodemailer**: Library for sending emails.
- **Docker** (optional): For containerized deployments.

---

## How to Run the Project Locally

### 1. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/your-username/fromm-api.git
cd fromm-api
```

### 2. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) (version 20 or higher) and [npm](https://www.npmjs.com/) installed.

```bash
npm install
```

### 3. Set Up Environment Variables

Create a .env file in the root directory. You can copy the example below and fill in your own values:

```properties
# Database connection
DATABASE_URL="sqlserver://<host>;database=<db>;user=<user>;password=<password>;encrypt=true;poolTimeout=0"
SHADOW_DATABASE_URL="sqlserver://localhost:1433;database=master;user=sa;password=<password>;encrypt=true;trustServerCertificate=true"

# Email configuration for notifications
EMAIL_HOST_1=mail.fromm-pack.cl
EMAIL_PORT_1=587
EMAIL_USER_1=notificaciones@fromm-pack.cl
EMAIL_PASSWORD_1=your-email-password

EMAIL_HOST_2=mail.fromm-pack.cl
EMAIL_PORT_2=587
EMAIL_USER_2=notificaciones@fromm-pack.cl
EMAIL_PASSWORD_2=your-email-password

# Add any other environment variables your project needs
```

> **Note:** Never commit your .env file to version control.

### 4. Generate Prisma Client

After setting up your .env, run:

```bash
npx prisma generate
```

### 5. Run the Application

```bash
npm run start:dev
```

The API should now be running at `http://localhost:3000`.

---

## Environmental Variables

Here are the main environment variables used in this project:

| Variable             | Description                                 |
|----------------------|---------------------------------------------|
| DATABASE_URL         | Connection string for the main database     |
| SHADOW_DATABASE_URL  | Connection string for Prisma shadow DB      |
| EMAIL_HOST_1         | SMTP host for email notifications           |
| EMAIL_PORT_1         | SMTP port                                   |
| EMAIL_USER_1         | Email user                                  |
| EMAIL_PASSWORD_1     | Email password                              |
| EMAIL_HOST_2         | (Optional) Second SMTP host                 |
| EMAIL_PORT_2         | (Optional) Second SMTP port                 |
| EMAIL_USER_2         | (Optional) Second email user                |
| EMAIL_PASSWORD_2     | (Optional) Second email password            |

You may need to add more variables depending on your deployment or features.

---

## Additional Notes

- For file uploads, only certain file types and sizes are allowed (see `FileTypeValidationPipe` and `FileSizeValidationPipe`).
- Make sure your database is running and accessible before starting the API.
- If you use Docker, check the provided Dockerfile and adjust as needed.

---

Feel free to copy and adapt this for your README!
