function postUrlOnMail() {
  var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);

  var threads = GmailApp.search(ss.getRangeByName("gmail_search_cond"), 0, 10);
  for( var i in threads ) {
    var thread = threads[i];
    var msgs = thread.getMessages();
    for( var j in msgs ) {
      var msg = msgs[j];
      if( msg.isUnread() ) {
        UrlFetchApp.fetch(ss.getRangeByName("gmail_post_url"), {
          method: "post",
          contentType: "application/json",
          payload: JSON.stringify({
            method: "mail",
            subject: msg.getSubject(),
            from: msg.getFrom()
          })
        });
        msg.markRead();
      }
    }
  }
}
