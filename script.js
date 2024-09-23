// Get the modal
var modal = document.getElementById("image-modal");

// Get the full image inside the modal
var fullImage = document.getElementById("full-image");

// Get the close button
var closeButton = document.querySelector(".close");

// Get the download button
var downloadBtn = document.getElementById("download-btn");

// Loop through all images in the gallery
var images = document.querySelectorAll(".gallery img");

images.forEach(function(img) {
  img.addEventListener("click", function() {
    modal.style.display = "block";
    fullImage.src = this.src; // Set the modal image source to the clicked image's source
    downloadBtn.href = this.src; // Set the download link to the same image
  });
});

// Close the modal when the close button is clicked
closeButton.addEventListener("click", function() {
  modal.style.display = "none";
});

// Close the modal when clicking outside the image
window.addEventListener("click", function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
