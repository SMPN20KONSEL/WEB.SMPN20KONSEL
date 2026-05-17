function login(){

  let user =
  document.getElementById("user").value;

  let pass =
  document.getElementById("pass").value;

  if(user === "admin" &&
     pass === "1234"){

    // simpan status login
    localStorage.setItem(
      "isLogin",
      "true"
    );

    // masuk dashboard
    window.location.href =
    "admin/dashboard.html";

  }else{

    alert("Login gagal");

  }

}