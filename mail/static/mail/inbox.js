document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#submit').addEventListener('click', send_email)

  // By default, load the inbox
  load_mailbox('inbox');
});

function send_email(event) {
  event.preventDefault();

  // Sending the mail
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  console.log(recipients, subject, body);

  fetch('/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body,
    }),
  })
    .then(response => response.json())
    .then(result => {
      const alertContainer = document.querySelector('.alertContainer');
      const alertDiv = document.createElement('div');
      alertDiv.classList.add('alert', 'alert-dismissible', 'fade', 'show');

      if (result.message === 'Email sent successfully.') {
        alertDiv.classList.add('alert-success');
        alertDiv.innerHTML = result.message;
      } else {
        alertDiv.classList.add('alert-danger');
        alertDiv.innerHTML = result.error;
      }
      alertContainer.appendChild(alertDiv);

      setTimeout(() => {
        alertDiv.remove();
      }, 2000);

      load_mailbox('sent');
    })
    .catch(error => {
      console.error('Error sending email:', error);
      
      const alertContainer = document.querySelector('.alertContainer');
      const alertDiv = document.createElement('div');
      alertDiv.classList.add('alert', 'alert-danger', 'alert-dismissible', 'fade', 'show');
      alertDiv.innerHTML = 'Error sending email. Please try again later.';
      alertContainer.appendChild(alertDiv);

      setTimeout(() => {
        alertDiv.remove();
      }, 2000);
    });
};

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-content-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  document.querySelector('#email-type').innerText = "New Email";

  // Clear the form
  document.querySelector('#compose-form').reset();
};

function reply(emailId) {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-content-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  document.querySelector('#email-type').innerText = "Reply";

  fetch(`/emails/${emailId}`)
    .then(response => {
      if(!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(email => {
      document.querySelector('#compose-recipients').value = email.sender;
      document.querySelector('#compose-subject').value = 'Re: ' + email.subject;
      document.querySelector('#compose-body').value = `\n...........................................................................................................................\n\nOn ${email.timestamp} ${email.sender} wrote:\n\n"${email.body}"`;
    })

  document.querySelector('#compose-recipients').value = 'hello';
  document.querySelector('#compose-subject').value = 'mf';
  document.querySelector('#compose-body').value = 'fu';

  console.log(emailId);
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-content-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `
    <p class="text-center fs-1 fw-medium p-2">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</p>
  `;

  fetch(`/emails/${mailbox}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(emails => {
      // Print emails to console for debugging
      console.log(emails);

      // Clear out any existing emails in the view
      document.querySelector('#emails-view').innerHTML += '<div id="email-list"></div>';
      const emailList = document.querySelector('#email-list');

      // Display each email
      emails.forEach(email => {
        const mailElement = document.createElement('div');
        mailElement.dataset.emailId = email.id;
        mailElement.className =  `d-flex justify-content-between mailbox${email.read ? '-read' : ''}`
        mailElement.innerHTML = `
          <div style="display: none;">${email.id}</div>
          <div class="mail-content${email.read ? '-read' : ''}">${mailbox === 'sent' ? `${email.recipients}</div>` : `${email.sender}</div>`}
          <div class="mail-content${email.read ? '-read' : ''}">${email.subject}</div>
          <div class="mail-content${email.read ? '-read' : ''}">${email.timestamp}</div>
        `;
        emailList.appendChild(mailElement);

        mailElement.addEventListener('click', () => {
          const emailId = mailElement.dataset.emailId;
          console.log(`Email ID: ${emailId}`);

          loadEmail(emailId, mailbox);
        });
      });
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      document.querySelector('#emails-view').innerHTML += '<p>Failed to load emails.</p>';
    });
}

function loadEmail(emailId, mailbox) {
  fetch(`/emails/${emailId}`)
    .then(response => response.json())
    .then(email => {

      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';

      console.log(email);
      // Display email details in the UI
      const emailContentViewContainer = document.querySelector('#email-content-view');
      emailContentViewContainer.innerHTML = '';

      const emailContentView = document.createElement('div');
      emailContentView.className = 'd-flex emailbox flex-column p-2 mt-3';
      emailContentView.innerHTML = `
        <p> <strong>From:</strong> ${email.sender}</p>
        <p> <strong>To:</strong> ${email.recipients}</p>
        <div class="d-flex justify-content-between">
          <span><strong>Subject:</strong> ${email.subject}</span>
          <span class="px-2"><strong>${email.timestamp}</strong></span>
        </div>
        <br>
        <p>${email.body.replace(/\n/g, '<br>')}</p>
      `;

      const reply_archive = document.createElement('div');
      reply_archive.innerHTML = `
        <button type="button" class="my-2 me-2 px-5 btn btn-success" onclick="reply(${email.id})">Reply</button>
        ${mailbox !== 'sent' ? 
          `<button type="button" class="my-2 px-5 btn btn-${email.archived ? `danger" onclick="toggleArchive(${email.id}, false)">Unarchive</button>` : 
            `secondary" onclick="toggleArchive(${email.id}, true)">Archive</button>`}` : '' }
      `;
      emailContentViewContainer.appendChild(emailContentView);
      emailContentViewContainer.appendChild(reply_archive);
      emailContentViewContainer.style.display = 'block';

      if (!email.read) {
        markEmailAsRead(emailId);
      }
      
    })
    .catch(error => {
      console.error('Error loading email:', error);
    });
}

function toggleArchive(emailId, archive) {
  console.log(emailId);
  fetch(`/emails/${emailId}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: archive
    })
  })
  .then(response => {
    if (!response.ok) throw new Error(`Failed to update email archive status: ${response.statusText}`);
    load_mailbox('inbox');
  })
  .catch(error => {
    console.error('Error updating email archive status:', error);
  });
}

function markEmailAsRead(emailId) {
  fetch(`/emails/${emailId}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
  .then(response => {
    if (!response.ok) throw new Error(`Failed to mark email as read: ${response.statusText}`);
  })
  .catch(error => {
    console.error('Error marking email as read:', error);
  });
}