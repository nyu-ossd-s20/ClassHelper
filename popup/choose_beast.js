/**
 * CSS to hide everything on the page,
 * except for elements that have the "beastify-image" class.
 */
let config = {
  Help:{
      channel:"test-channel",
      username:"A Student In Need",
      icon_emoji:":ghost:",
      text:"Anyone there?",
      shown_text:"Send Help",
      shown_image:"https://i.ytimg.com/vi/8U758F1uLdc/maxresdefault.jpg"
  },
  Symphogear:{
      channel:"test-channel",
      username:"The Symphochoir",
      icon_emoji:":chris_bored:",
      text:"Watch Symphogear.",
      shown_text: "Symphogear",
      shown_image:"https://i.imgur.com/QV5oCPK.png"
  },
  Symphochoir:{
      channel:"test-channel",
      username:"Cola Addict",
      icon_emoji:":laffeydrink:",
      text:"This is definitely Cola.",
      shown_text: "Drink Cola",
      shown_image:"https://images.unsplash.com/photo-1561758033-48d52648ae8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
  },
  Menacing:{
    channel:"test-channel",
    username:"ゴゴゴゴ",
    icon_emoji:":chris_bored:",
    text:"ゴ ゴ ゴ ゴ ゴ ゴ ゴ ゴ ゴ ゴ ゴ ゴ ゴ ゴ",
    shown_text: "Menacing",
    shown_image:"https://images.unsplash.com/photo-1505274664176-44ccaa7969a8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
  },
  HKS2:{
    channel : "test-channel",
    username : "Gordon Ramsey",
    icon_emoji: ":angry:",
    text : "Where is the lambsauce??!?!?!!?",
    shown_text:"HK Season 2",
    shown_image:"https://live.staticflickr.com/2125/2269798293_c744f1bfeb.jpg"
  },
  Rat:{
    channel : "test-channel",
    username : "ratty",
    icon_emoji : ":rat:",
    text : "*rat noises*",
    shown_text:"Talented Rat",
    shown_image:"https://upload.wikimedia.org/wikipedia/commons/c/c1/Rat_agouti.jpg"

  }
}

const hidePage = `body > :not(.beastify-image) {
                    display: none;
                  }`;

async function sendMessage(spec_config){
  // return
  const data = {
    channel:spec_config.channel,
    username:spec_config.username,
    icon_emoji:spec_config.icon_emoji,
    text:spec_config.text
  }
  const response = await fetch("{SECRET_URL}", {
  method: 'POST', // *GET, POST, PUT, DELETE, etc.
  mode: 'no-cors', // no-cors, *cors, same-origin
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  // credentials: 'same-origin', // include, *same-origin, omit
  headers: {
    'Content-Type': 'application/json',
    // 'Content-Type': 'application/x-www-form-urlencoded',
  },
  // redirect: 'follow', // manual, *follow, error
  // referrerPolicy: 'no-referrer', // no-referrer, *client
  body: JSON.stringify(data) // body data type must match "Content-Type" header
});
return // parses JSON response into native JavaScript objects
}

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {

    /**
     * Given the name of a beast, get the URL to the corresponding image.
     */
    function beastNameToURL(beastName) {
      if (beastName in config){
        sendMessage(config[beastName]);
        return browser.extension.getURL(config[beastName].shown_image)
      }
      // switch (beastName) {
      //   case "Frog":
      //     // console.log("FROG")
      //     // return
      //     sendMessage()
      //     // return
      //     return browser.extension.getURL("beasts/frog.jpg");
      //   case "Snake":
      //     return browser.extension.getURL("beasts/snake.jpg");
      //   case "Turtle":
      //     return browser.extension.getURL("beasts/turtle.jpg");
      //   case "Help":
      //     sendMessage(
      //       config.google
      //     )
      //     return browser.extension.getURL(config.google.shown_image)
      // }
    }

    /**
     * Insert the page-hiding CSS into the active tab,
     * then get the beast URL and
     * send a "beastify" message to the content script in the active tab.
     */
    function beastify(tabs) {
      browser.tabs.insertCSS({code: hidePage}).then(() => {
        let url = beastNameToURL(e.target.textContent);
        browser.tabs.sendMessage(tabs[0].id, {
          command: "beastify",
          beastURL: url
        });
      });
    }

    /**
     * Remove the page-hiding CSS from the active tab,
     * send a "reset" message to the content script in the active tab.
     */
    function reset(tabs) {
      browser.tabs.removeCSS({code: hidePage}).then(() => {
        browser.tabs.sendMessage(tabs[0].id, {
          command: "reset",
        });
      });
    }

    /**
     * Just log the error to the console.
     */
    function reportError(error) {
      console.error(`Could not beastify: ${error}`);
    }

    /**
     * Get the active tab,
     * then call "beastify()" or "reset()" as appropriate.
     */
    if (e.target.classList.contains("beast")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(beastify)
        .catch(reportError);
    }
    else if (e.target.classList.contains("reset")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(reset)
        .catch(reportError);
    }
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute beastify content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "/content_scripts/beastify.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);
