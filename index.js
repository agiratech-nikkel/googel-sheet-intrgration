      /* exported gapiLoaded */
      /* exported gisLoaded */
      /* exported handleAuthClick */
      /* exported handleSignoutClick */

      // TODO(developer): Set to client ID and API key from the Developer Console
      const CLIENT_ID = '409325716927-jdbe3uqe4vrcf1e5ebulufk7r845edvi.apps.googleusercontent.com';
      const API_KEY = 'AIzaSyAFRw6fTEvlL2H2myIRtIBw2dexEUTYEcQ';

      // Discovery doc URL for APIs used by the quickstart
      const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

      let tokenClient;
      let gapiInited = false;
      let gisInited = false;

      document.getElementById('authorize_button').style.visibility = 'hidden';
      document.getElementById('signout_button').style.visibility = 'hidden';

      /**
       * Callback after api.js is loaded.
       */
      function gapiLoaded() {
        gapi.load('client', initializeGapiClient);
      }

      /**
       * Callback after the API client is loaded. Loads the
       * discovery doc to initialize the API.
       */
      async function initializeGapiClient() {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        maybeEnableButtons();
      }

      /**
       * Callback after Google Identity Services are loaded.
       */
      function gisLoaded() {
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: '', // defined later
        });
        gisInited = true;
        maybeEnableButtons();
      }

      /**
       * Enables user interaction after all libraries are loaded.
       */
      function maybeEnableButtons() {
        if (gapiInited && gisInited) {
          document.getElementById('authorize_button').style.visibility = 'visible';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick() {
        tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            throw (resp);
          }
          document.getElementById('signout_button').style.visibility = 'visible';
          document.getElementById('authorize_button').innerText = 'Refresh';
          await listMajors();
        };

        if (gapi.client.getToken() === null) {
          // Prompt the user to select a Google Account and ask for consent to share their data
          // when establishing a new session.
          tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
          // Skip display of account chooser and consent dialog for an existing session.
          tokenClient.requestAccessToken({prompt: ''});
        }
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick() {
        const token = gapi.client.getToken();
        if (token !== null) {
          google.accounts.oauth2.revoke(token.access_token);
          gapi.client.setToken('');
          document.getElementById('content').innerText = '';
          document.getElementById('authorize_button').innerText = 'Authorize';
          document.getElementById('signout_button').style.visibility = 'hidden';
        }
      }

      /**
       * Print the names and majors of students in a sample spreadsheet:
       * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
       */
      async function listMajors() {
        let response;
        try {
          // Fetch first 10 files
          response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '10O-QshH9z0CgVTieqr7Ojild5R-dBkhJFK3Cd715wJ0',
            range: 'class data!A3:E',
          });
        } catch (err) {
          document.getElementById('content').innerText = err.message;
          return;
        }
        const range = response.result;
        if (!range || !range.values || range.values.length == 0) {
          document.getElementById('content').innerText = 'No values found.';
          return;
        }
        console.log(response.result,response.result.spreadsheetId)
        // Flatten to string to display
        const output = range.values.reduce(
            (str, row) => `${str}${row[0]}, ${row[4]}\n`,
            'Name, Major:\n');
        document.getElementById('content').innerText = output;
        createData()
      }

      async function createData(){
        let value =[
           
             ["Andrew", "Male", "1. Freshman", "SD", "Math",'Drama Club'],
             ["Student Name","Gender",'Class Level','Home State','Major','Extracurricular Activity']]
       let body = {
        values: value,
       }
 
    try
    {

         gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: '10O-QshH9z0CgVTieqr7Ojild5R-dBkhJFK3Cd715wJ0',
            range: "class data!A3:F",
            valueInputOption:"USER_ENTERED",
            resource: body,
        }).then((response) => {
            const result = response.result;
            console.log(`${result.updates.updatedCells} cells appended.`);
            if (callback) callback(response);
          });
       }
       catch (err) {
        console.log(err)
        return;
      }
    console.log(res)

}