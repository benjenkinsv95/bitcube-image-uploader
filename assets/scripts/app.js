'use strict'

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')

const { apiUrl } = require('./config')
const copy = require('copy-to-clipboard')

$(() => {
  let uploads = []
  const indexUploads = function () {
    return $.ajax({
      url: `${apiUrl}/uploads`
    })
  }

  const indexUploadsSuccessful = responseData => {
    uploads = responseData.uploads
    let allUploadsHtml = ``
    uploads.forEach(upload => {
      const uploadHtml = `
        <div class='uploaded-image' style='background-image: url(${upload.path})' data-image-url="${upload.path}" data-image-title="${upload.title}">
          <h2>${upload.title}</h2>
        </div>
        `
      allUploadsHtml += uploadHtml
    })
    $('.all-images-container').html(allUploadsHtml)
  }

  // Show the grid of all uploads on page load
  indexUploads()
    .then(indexUploadsSuccessful)
    .catch(console.error)

  $('#upload-image').on('submit', (event) => {
    event.preventDefault()

    const form = event.target
    const formData = new FormData(form)

    $.ajax({
      url: `${apiUrl}/uploads`,
      method: 'POST',
      processData: false,
      contentType: false,
      data: formData
    })
      .then(responseData => {
        $('.image-container').css('background-image', `url(${responseData.upload.path})`)
        return indexUploads()
      })
      .then(indexUploadsSuccessful)
      .catch(console.error)
  })

  $('#file-upload').on('change', () => {
    const form = $('#upload-image')[0]
    const formData = new FormData(form)

    if (formData.get('title').trim() === '') {
      const image = formData.get('image')
      formData.set('title', image.name)
    }

    $.ajax({
      url: `${apiUrl}/uploads`,
      method: 'POST',
      processData: false,
      contentType: false,
      data: formData
    })
      .then(responseData => {
        $('.image-container').css('background-image', `url(${responseData.upload.path})`)
        return indexUploads()
      })
      .then(indexUploadsSuccessful)
      .catch(console.error)
  })

  $('.all-images-container').on('click', '.uploaded-image', event => {
    const imageUrl = $(event.target).data('image-url')
    const imageTitle = $(event.target).data('image-title')

    $("input[name='image-url']").val(imageUrl)
    $('#selected-img').attr('src', imageUrl)
    $('#selected-img-title').text(imageTitle)

    $('#image-modal').modal('show')
  })

  $('#copy-to-clipboard').on('click', event => {
    const imageUrl =  $("input[name='image-url']").val()
    copy(imageUrl)
  })
})
