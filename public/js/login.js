const loginFormHandler = async (event) => {
    event.preventDefault()

    const userEmail = document.querySelector
    ('#user-email').value
    const userPassword = document.querySelector
    ('#user-password').value
    console.log(userEmail, userPassword);
    const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ email: userEmail, password: userPassword }),
    });

    if (response.ok) {
        console.log('res.ok')
        document.location.replace('/profile');
    } else {
        alert(response.statusText);
    }
};

document.querySelector('#login-form').addEventListener('submit', loginFormHandler)