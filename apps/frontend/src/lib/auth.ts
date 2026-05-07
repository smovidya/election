/*
 * Create form to request access token from Google's OAuth 2.0 server.
 * @source https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow
 */
export function oauthSignIn() {
  // Google's OAuth 2.0 endpoint for requesting an access token
  var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  var form = document.createElement("form");
  form.setAttribute("method", "GET"); // Send as a GET request.
  form.setAttribute("action", oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  var params = {
    client_id:
      "878635631561-996p9vdbemp1n3r7dcs91i9f0e6i25fi.apps.googleusercontent.com",
    redirect_uri: `${import.meta.env.BASE_URL}/login`,
    response_type: "token",
    hd: "chula.ac.th",
    scope:
      "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly",
    include_granted_scopes: "true",
    state: "pass-through value",
  };

  // Add form parameters as hidden input values.
  for (var p in params) {
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
    form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
  form.submit();
}
