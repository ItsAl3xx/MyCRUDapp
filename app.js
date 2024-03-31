// Execute the following code once the document is fully loaded
$(document).ready(function() {
    // Fetch and list all contacts when the page loads
    listContacts();

    // Handle form submission for adding new contacts
    $('#addContactForm').on('submit', function(e) {
        e.preventDefault();
        // Extract contact data from the form
        var contactData = {
            name: $('#name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            company: { name: $('#company').val() }
        };
        // Send a POST request to add the new contact
        $.ajax({
            type: "POST",
            url: "https://jsonplaceholder.typicode.com/users",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(contactData),
            // Handle success response
            success: function(newContact) {
                // Add the new contact to the list and close the modal
                addContactToList(newContact);
                $('#addContactModal').modal('hide');
            },
            // Handle error response
            error: function() {
                alert("Error adding contact");
            }
        });
    });

    // Handle form submission for editing existing contacts
    $('#editContactForm').on('submit', function(e) {
        e.preventDefault();
        // Extract contact data from the form
        var contactId = $('#editContactId').val();
        var contactData = {
            name: $('#editName').val(),
            email: $('#editEmail').val(),
            phone: $('#editPhone').val(),
            company: { name: $('#editCompany').val() }
        };
        // Send a PUT request to update the contact
        $.ajax({
            type: "PUT",
            url: "https://jsonplaceholder.typicode.com/users/" + contactId,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(contactData),
            // Handle success response
            success: function() {
                // Close the modal and refresh the contact list
                $('#editContactModal').modal('hide');
                listContacts();
            },
            // Handle error response
            error: function() {
                alert("Error updating contact");
            }
        });
    });
});

// Function to fetch and list all contacts
function listContacts() {
    $.ajax({
        type: "GET",
        url: "https://jsonplaceholder.typicode.com/users",
        // Handle success response
        success: function(contacts) {
            var contactListHTML = '';
            // Generate HTML for each contact
            $.each(contacts, function(index, contact) {
                contactListHTML += generateContactHTML(contact);
            });
            // Update the contact list in the UI
            $('#contactList').html(contactListHTML);
        },
        // Handle error response
        error: function() {
            alert("Error loading contacts");
        }
    });
}

// Function to generate HTML for a contact
function generateContactHTML(contact) {
    return `
        <div class="card mb-3" id="contact-${contact.id}">
            <div class="card-body">
                <h5 class="card-title">${contact.name}</h5>
                <p class="card-text">${contact.email}</p>
                <p class="card-text">${contact.phone}</p>
                <p class="card-text">${contact.company.name}</p>
                <button onclick="showEditModal(${contact.id})" class="btn btn-primary">Edit</button>
                <button onclick="deleteContact(${contact.id})" class="btn btn-danger">Delete</button>
            </div>
        </div>`;
}

// Function to add a new contact to the list
function addContactToList(contact) {
    // Assign a temporary ID to the new contact for deletion purposes
    contact.id = Math.floor(Math.random() * 10000);
    var contactHTML = generateContactHTML(contact);
    // Append the new contact to the contact list
    $('#contactList').append(contactHTML);
}

// Function to show the edit modal and populate it with contact details
function showEditModal(contactId) {
    // Fetch the contact details from the API
    $.ajax({
        type: "GET",
        url: "https://jsonplaceholder.typicode.com/users/" + contactId,
        // Handle success response
        success: function(contact) {
            // Populate the edit modal with contact details
            $('#editContactId').val(contact.id);
            $('#editName').val(contact.name);
            $('#editEmail').val(contact.email);
            $('#editPhone').val(contact.phone);
            $('#editCompany').val(contact.company.name);
            // Show the edit modal
            $('#editContactModal').modal('show');
        },
        // Handle error response
        error: function() {
            alert("Error retrieving contact details");
        }
    });
}

// Function to delete a contact from the list
function deleteContact(contactId) {
    // Remove the contact HTML element from the DOM
    $("#contact-" + contactId).remove();
}
