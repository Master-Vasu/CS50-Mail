# CS50 Mail

CS50 Mail is a web application for managing emails, developed as part of the CS50 Web Programming with Python and JavaScript course. The application is built using Django and Vanilla JS which allows users to send, receive, and manage emails through a modern web interface.


## Features

- **Compose Emails**: Send emails to one or multiple recipients.
- **Inbox**: View all received emails.
- **Sent Mail**: View all sent emails.
- **Archive/Unarchive Emails**: Archive emails for later and unarchive them when needed.
- **Reply to Emails**: Reply to received emails.


## Setup and Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Master-Vasu/CS50-Mail.git
   cd CS50-Mail

2. **Create a virtual environment:**

    ```bash
    python3 -m venv venv
    source venv/bin/activate

3. **Install dependencies:**

    ```bash
    pip install -r requirements.txt

4. **Apply migrations:**

    ```bash
    python manage.py migrate

5. **Run the development server:**

    ```bash
    python manage.py runserver

6. **Access the application:**
    Open your web browser and go to `http://127.0.0.1:8000/`.


## Usage

### Compose Email

- Click the "Compose" button in the navigation bar.
- Fill in the recipient(s), subject, and body of the email.
- Click "Send".

### View Emails

- Navigate to the inbox, sent, or archive views using the navigation bar.
- Click on an email to view its details.

### Archive/Unarchive Email

- While viewing an email, click the "Archive" button to move it to the archive.
- To unarchive an email, click the "Unarchive" button while viewing the email in the archive.

### Reply to Email

- While viewing an email, click the "Reply" button.
- Fill in your response and click "Send".


## API Endpoints

The application provides several API endpoints for managing emails:

- `GET /emails/<str:mailbox>`: Retrieve emails in a specified mailbox (inbox, sent, archive).
- `GET /emails/<int:email_id>`: Retrieve details of a specific email.
- `POST /emails`: Send a new email.
- `PUT /emails/<int:email_id>`: Update an email (mark as read/unread, archive/unarchive).


## Technologies Used

- **Django**: Backend framework.
- **JavaScript**: For dynamic content and API interactions.
- **HTML/CSS**: For structuring and styling the web pages.
- **Bootstrap**: For responsive design.


## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue with your suggestions. Please follow the guidelines below when contributing:

1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Make your changes.
4. Commit your changes (git commit -m 'Add some feature').
5. Push to the branch (git push origin feature-branch).
6. Open a pull request.


## Acknowledgments

- [CS50 Web Programming with Python and JavaScript](https://cs50.harvard.edu/web/2020/) - The course that inspired this project.
- The amazing team and community at Harvard University and CS50.
- [Django](https://www.djangoproject.com/) - For the web framework.


## Contact

If you have any questions or feedback, feel free to reach out:

- GitHub: [Master-Vasu](https://github.com/Master-Vasu)
- Twitter/X: [Vasu_arcR](https://x.com/Vasu_arcR)
- vasumoradiya999@gmail.com
