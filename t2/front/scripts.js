document.addEventListener("DOMContentLoaded", function() {
    // Retrieve stored username from local storage
    const storedUsername = localStorage.getItem('username');
    const navbarNav = document.querySelector('.navbar-nav');

    if (storedUsername) {
        // Update navbar to show username
        navbarNav.innerHTML = `
            <li class="nav-item">
                <span class="nav-link">${storedUsername}</span>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" id="logoutButton">Выход</a>
            </li>
        `;
    }

    // Logout functionality
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault();
            // Clear localStorage
            localStorage.clear();
            location.reload();
        });
    }

    // Fetch documents GET
    fetch('http://127.0.0.1:8000/api/v1/docs/', {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const documentsContainer = document.getElementById('documentsContainer');
        documentsContainer.innerHTML = '';
        console.log(data);
        const username = localStorage.getItem('username');

        // Create cards for each set of four
        for (let i = 0; i < data.length; i += 4) {
            const row = document.createElement('div');
            row.classList.add('row', 'mb-3');

            // Create cards for each set of four documents
            for (let j = i; j < i + 4 && j < data.length; j++) {
                const doc = data[j];
                const cardCol = document.createElement('div');
                cardCol.classList.add('col-md-3');

                const cardElement = document.createElement('div');
                cardElement.classList.add('card');
                cardElement.setAttribute('data-doc-id', doc.id);
                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');

                cardBody.innerHTML = `
                    <h5 class="card-title">${doc.name}</h5>
                    <p class="text-muted">Автор: ${doc.user.username}</p>
                    <p class="card-text">${doc.description}</p>
                `;

                const viewButton = document.createElement('button');
                viewButton.textContent = 'View';
                viewButton.classList.add('btn', 'btn-primary', 'ms-2');
                viewButton.addEventListener('click', () => {
                    window.location.href = `http://127.0.0.1:8000/api/v1/docs/${doc.id}/view/`; // Redirect to view endpoint
                });

                cardBody.appendChild(viewButton);

                // Add edit button if the author matches the username from local storage
                if (doc.user.username === username) {
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.classList.add('btn', 'btn-secondary', 'ms-2');
                    editButton.addEventListener('click', () => {
                        document.getElementById('updateName').value = doc.name;
                        document.getElementById('updateDescription').value = doc.description;
                        document.getElementById('updateModal').setAttribute('data-doc-id', doc.id);
                        var updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
                        updateModal.show();
                    });

                    
                    cardBody.appendChild(editButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('btn', 'btn-danger', 'ms-2');
                    deleteButton.addEventListener('click', () => {
                        const confirmation = confirm('Are you sure you want to delete this document?');
                        if (confirmation) {
                            deleteDocument(doc.id);
                        }
                    });
                    cardBody.appendChild(deleteButton);
                }

                cardElement.appendChild(cardBody);
                cardCol.appendChild(cardElement);
                row.appendChild(cardCol);
            }

            documentsContainer.appendChild(row);
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

    // View buttons functionality
    const viewButtons = document.querySelectorAll('.view-document');
    viewButtons.forEach(button => {
        button.addEventListener('click', viewDocument);
    });

    // Download buttons functionality
    const downloadButtons = document.querySelectorAll('.download-document');
    downloadButtons.forEach(button => {
        button.addEventListener('click', downloadDocument);
    });

    // Function to view document
    function viewDocument(event) {
        const docId = event.target.getAttribute('data-doc-id');
        fetch(`http://example.com/api/docs/${docId}/view`, { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            console.error('Error viewing document:', error);
        });
    }

    // Function to download document
    function downloadDocument(event) {
        const docId = event.target.getAttribute('data-doc-id');
        window.location.href = `http://example.com/api/docs/${docId}/download`;
    }

    document.addEventListener("DOMContentLoaded", function() {
        const logoutButton = document.getElementById("logoutButton");
        if (logoutButton) {
            logoutButton.addEventListener('click', function(event) {
                event.preventDefault();
                // Clear localStorage
                localStorage.clear();
                
                console.log(123); // Corrected typo
                // Redirect to the login page or any other desired location
                window.location.href = '/login'; // Example: Redirect to the login page
            });
        }
    });

    // Function to delete document
    function deleteDocument(docId) {
        fetch(`http://127.0.0.1:8000/api/v1/docs/${docId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Document deleted successfully:', data);
        })
        .catch(error => {
            console.error('Error deleting document:', error);
        })
        .then(data => {
            console.log('Document deleted successfully:', data);
            location.reload();
        })
    }

    // Update form submission
    document.getElementById('updateForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const cardElement = document.querySelector('.card'); // Get the card element, ensure it's correct for your case

        if (cardElement) {
            const docId = cardElement.getAttribute('data-doc-id');
            
            // Retrieve the file input element
            const fileInput = document.getElementById('fileUpdate');
            // Retrieve the file object
            const file = fileInput.files[0];

            // Construct FormData to include the updated file
            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', document.getElementById('updateName').value);
            formData.append('description', document.getElementById('updateDescription').value);

            fetch(`http://127.0.0.1:8000/api/v1/docs/${docId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                },
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Document updated successfully:', data);
                const modal = bootstrap.Modal.getInstance(document.getElementById('updateModal'));
                modal.hide();

                // Optionally refresh or update UI elements here to reflect the changes
            })
            .catch(error => {
                console.error('Error updating document:', error);
            })
            .then(() => {
                // Reload the page after updating the document
                location.reload();
            });
        } else {
            console.error('cardElement is not defined');
        }
    });



    // Upload form submission
    document.getElementById('uploadForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Check if username is present in local storage
        const storedUsername = localStorage.getItem('username');
        if (!storedUsername) {
            // Display error toast message if username is not present
            const errorToastMessage = document.getElementById('errorToastMessage');
            if (errorToastMessage) {
                errorToastMessage.textContent = 'Ошибка: Не удалось загрузить файл. Пожалуйста, выполните вход.';
                const errorToast = new bootstrap.Toast(document.getElementById('errorToast'));
                errorToast.show();
            }
            return; // Stop further execution
        }
        
        const formData = new FormData(this);
        // Retrieve userId from localStorage
        const userId = localStorage.getItem('userId');

        // Append userId to the formData
        formData.append('user', userId);
        console.log('name',formData.get('name'))
        console.log('description',formData.get('description'))
        console.log('user',formData.get('user'))
        console.log('file',formData.get('file'))

        fetch('http://127.0.0.1:8000/api/v1/docs/', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('File uploaded successfully:', data);
            const modal = new bootstrap.Modal(document.getElementById('uploadModal'));
            modal.hide();
        })
        .catch(error => {
            console.error('Error uploading file:', error);
        })
        .then(data => {
            console.log('File uploaded successfully:', data);
            const modal = new bootstrap.Modal(document.getElementById('uploadModal'));
            modal.hide();
            // Reload the page after uploading the file
            location.reload();
        })
    });



    // Registration form submission
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        fetch('http://127.0.0.1:8000/api/v1/users/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    let errorMessage = '';
                    for (const key in data) {
                        if (Object.hasOwnProperty.call(data, key)) {
                            errorMessage += `${data[key][0]}\n`;
                        }
                    }
                    throw new Error(errorMessage || 'Unknown error occurred.');
                });
            }
            return response.json();
        })
        .then(data => {
            // success registretion
            console.log('Успешная регистрация:', data);
            const registrationToast = document.getElementById('registrationToast');
            if (registrationToast) {
                const toastBody = registrationToast.querySelector('.toast-body');
                if (toastBody) {
                    toastBody.textContent = 'Пользователь зарегистрирован. Теперь можно выполнить вход.';
                    const toast = new bootstrap.Toast(registrationToast);
                    toast.show();
                }
            }
        })
        .catch(error => {
            // error registration
            console.error('Ошибка регистрации:', error);
            const errorToast = document.getElementById('errorToast');
            if (errorToast) {
                const toastBody = errorToast.querySelector('.toast-body');
                if (toastBody) {
                    toastBody.textContent = error;
                    const toast = new bootstrap.Toast(errorToast);
                    toast.show();
                }
            }
        });

    });

    // Login form submission
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        fetch('http://127.0.0.1:8000/api/v1/users/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    let errorMessage = '';
                    for (const key in data) {
                        if (Object.hasOwnProperty.call(data, key)) {
                            errorMessage += `${data[key][0]}\n`;
                        }
                    }
                    throw new Error(errorMessage || 'Unknown error occurred.');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Успешный логин:', data);
            const loginToast = document.getElementById('loginToast');
            if (loginToast) {
                const toastBody = loginToast.querySelector('.toast-body');
                if (toastBody) {
                    toastBody.textContent = 'Успешный логин!';
                    const toast = new bootstrap.Toast(loginToast);
                    toast.show();
                }
            }
            const profileHeader = document.getElementById('profileHeader');
            if (profileHeader) {
                profileHeader.textContent = data.username;
            }
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('username', data.username);
            localStorage.setItem('userId', data.id);
            const navbarNav = document.querySelector('.navbar-nav');
            navbarNav.innerHTML = `
                <li class="nav-item">
                    <span class="nav-link">Привет, ${data.username}</span>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" id="logoutButton">Выход</a>
                </li>
            `;
        })

        .catch(error => {
            console.error('Ошибка логина:', error);
            const errorToast = document.getElementById('errorToast');
            if (errorToast) {
                const toastBody = errorToast.querySelector('.toast-body');
                if (toastBody) {
                    toastBody.textContent = error;
                    const toast = new bootstrap.Toast(errorToast);
                    toast.show();
                }
            }
        });
    });
});