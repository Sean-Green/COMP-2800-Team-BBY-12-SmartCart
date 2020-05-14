// Initialize the FirebaseUI Widget using Firebase.
function splashLogin(){
   $("firebaseui-auth-container").innerHTML = '';
}
function callForLogin(){
   var ui = new firebaseui.auth.AuthUI(firebase.auth());

   var uiConfig = {
      callbacks: {
         signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
         },
         uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            // document.getElementById('loader').style.display = 'none';
         }
      },
      'credentialHelper': firebaseui.auth.CredentialHelper.NONE,


      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'popup',
      signInSuccessUrl: 'main_page.html',
      signInOptions: [
         // Leave the lines as is for the providers you want to offer your users.
         firebase.auth.GoogleAuthProvider.PROVIDER_ID,
         // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
         // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
         // firebase.auth.GithubAuthProvider.PROVIDER_ID,
         // firebase.auth.EmailAuthProvider.PROVIDER_ID,
         //firebase.auth.PhoneAuthProvider.PROVIDER_ID
      ],
      // Terms of service url.
      tosUrl: '<>',
      // Privacy policy url.
      privacyPolicyUrl: '<>'
   };

   // The start method will wait until the DOM is loaded.
   ui.start('#firebaseui-auth-container', uiConfig);
};