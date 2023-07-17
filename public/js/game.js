const gameFormHandler = async (event) => {
    event.preventDefault()

    const username = document.querySelector
    ('#username').value   
    const userEmail = document.querySelector
    ('#user-email').value
    const userPassword = document.querySelector
    ('#user-password').value

    const response = await fetch('/api/game/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ username: username, email: userEmail, password: userPassword }),
    });

    if (response.ok) {
        document.location.replace('/');
    } else {
        alert(response.statusText);
    }
};

document.querySelector('#game').addEventListener('submit', gameFormHandler)