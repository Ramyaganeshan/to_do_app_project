function getJwtToken() {
  const cookies = document.cookie.split("; ");
  console.log("All Cookies:", document.cookie);

  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === "jwt") {
      return value;
    }
  }
}

function validateLoginForm() {
  var errorMessage = document.getElementById("error-message");
  errorMessage.innerHTML = "";

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  var errorMessage = document.getElementById("error-message");
  if (!errorMessage) {
    errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    document.body.appendChild(errorMessage);
  } else {
    errorMessage.innerHTML = "";
  }

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorMessage.innerHTML = "Invalid Email format.";
    return false;
  }

  var jwt = getJwtToken();
  console.log("JS JWT TOKEN : ", jwt);

  if (jwt) {
    fetch("/api/user/login", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.type === "invalid") {
          errorMessage.innerHTML = "Invalid credentials.";
        } else if (data.redirect == "/dashboard") {
          window.location.href = data.redirect;
        }
      })
      .catch((error) => console.error("Error:", error));
    return false;
  }
}
