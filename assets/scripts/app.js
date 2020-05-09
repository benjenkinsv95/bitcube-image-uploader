'use strict'

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')


$(() => {
  $("#upload-image").on("submit", (event) => {
    event.preventDefault()
    
    const form = event.target;
    const formData = new FormData(form);

    $.ajax({
      url: "http://localhost:4741/uploads",
      method: "POST",
      processData: false,
      contentType: false,
      data: formData
    })
      .then(() => console.log("success"))
      .catch(console.error);
  });
});

