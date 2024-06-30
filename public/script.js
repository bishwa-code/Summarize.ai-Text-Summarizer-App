const textArea = document.getElementById("text_to_summarize");
const submitButton = document.getElementById("submit-button");
const summarizedTextArea = document.getElementById("summary");

submitButton.disabled = true;


// Function to fetch random Wikipedia article
async function fetchRandomWikipediaArticle() {
    const responseWiki = await fetch('https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&explaintext&generator=random&grnnamespace=0&exsentences=20');
    const data = await responseWiki.json();
    const pages = data.query.pages;
    const page = pages[Object.keys(pages)[0]];
    return page.extract;
}

// Function to insert sample text into the text area
async function insertSampleText() {
    try {
        const articleContent = await fetchRandomWikipediaArticle();
        textArea.value = articleContent;
        submitButton.disabled = false;
    } catch (error) {
        console.error('Error fetching Wikipedia article:', error);
    }
}

// Add event listener to the button
const buttonTest = document.getElementById('insertTextButton');
buttonTest.addEventListener('click', insertSampleText);





textArea.addEventListener("input", verifyTextLength);
submitButton.addEventListener("click", submitData);

function verifyTextLength(e) {
 // The e.target property gives us the HTML element that triggered the event, which in this case is the textarea. We save this to a variable called 'textarea'
  const textarea = e.target;

  // Verify the TextArea value.
  if (textarea.value.length > 200 && textarea.value.length < 100000) {
    // Enable the button when text area has value.
    submitButton.disabled = false;
  } else {
    // Disable the button when text area is empty.
    submitButton.disabled = true;
  }
}

function submitData(e) {

 // This is used to add animation to the submit button
  submitButton.classList.add("submit-button--loading");

  const text_to_summarize = textArea.value;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "text_to_summarize": text_to_summarize
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  // Send the text to the server using fetch API

 // Note - here we can omit the “baseUrl” we needed in Postman and just use a relative path to “/summarize” because we will be calling the API from our Replit!  
  fetch('/summarize', requestOptions)
    .then(response => response.text()) // Response will be summarized text
    .then(summary => {
      // Do something with the summary response from the back end API!

      // Update the output text area with new summary
      summarizedTextArea.value = summary;

      // Stop the spinning loading animation
      submitButton.classList.remove("submit-button--loading");
    })
    .catch(error => {
      console.log(error.message);
    });
}
