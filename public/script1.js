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

function validateForm() {
  var errorMessage = document.getElementById("error-message");
  errorMessage.innerHTML = "";

  var firstname = document.getElementById("firstname").value;
  var email = document.getElementById("email").value;
  var mobile = document.getElementById("mobile").value;
  var password = document.getElementById("password").value;

  // Validate First Name
  if (firstname.length < 3) {
    errorMessage.innerHTML = "Name must be minimun 3 letters.";
    return false;
  }
  if (firstname.length > 30) {
    errorMessage.innerHTML = "Name should be below 30 letters.";
    return false;
  }

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorMessage.innerHTML = "Invalid Email format.";
    return false;
  }

  var mobileRegex = /^[0-9]+$/;
  if (!mobileRegex.test(mobile)) {
    errorMessage.innerHTML = "Mobile should contain only numbers.";
    return false;
  }
  var jwt = getJwtToken();
  if (jwt) {
    fetch("/api/user/register", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname: firstname,
        email: email,
        mobile: mobile,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.type === "emailExists") {
          errorMessage.innerHTML = "Email Already Exists.";
        } else if (data.type === "phoneExists") {
          errorMessage.innerHTML = "Phone Number Already Exists.";
        } else if (data.redirect == "/dashboard") {
          window.location.href = data.redirect;
        }
      })
      .catch((error) => console.error("Error:", error));

    return false;
  }
}
