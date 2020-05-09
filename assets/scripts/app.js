'use strict'

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')

const { apiUrl } = require('./config')
$(() => {
  const indexUploads = function () {
    return $.ajax({
      url: `${apiUrl}/uploads`
    });
  }

  const indexUploadsSuccessful = responseData => {
    let allUploadsHtml = ``;
    responseData.uploads.forEach(upload => {
      const uploadHtml = `
        <div class='uploaded-image' style='background-image: url(${upload.path})'>
          <h2>${upload.title}</h2>
        </div>
        `;
      allUploadsHtml += uploadHtml;
    });
    $('.all-images-container').html(allUploadsHtml);
  };

  // Show the grid of all uploads on page load
  indexUploads()
    .then(indexUploadsSuccessful)
    .catch(console.error)

  $("#upload-image").on("submit", (event) => {
    event.preventDefault()
    
    const form = event.target;
    const formData = new FormData(form);

    $.ajax({
      url: `${apiUrl}/uploads`,
      method: "POST",
      processData: false,
      contentType: false,
      data: formData
    })
      .then(responseData => {
        $('.image-container').css('background-image', `url(${responseData.upload.path})`)
        return indexUploads()
      })
      .then(indexUploadsSuccessful)
      .catch(console.error);
  })

  

  

 
});



