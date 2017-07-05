var Line = {

  send: function(type, data) {
    var response = UrlFetchApp.fetch(
      'https://api.line.me/v2/bot/message/' + type,
      {
        method: 'POST',
        contentType: 'application/json; charset=UTF-8',
        headers: {
          Authorization: 'Bearer ' + LINE_ACCESS_TOKEN,
        },
        payload: JSON.stringify(data)
      }
    )
    Logger.log(response)
    return response
  },
  
  pushMessage: function(to, messages) {
    return Line.send('push', {to: to, messages: (Array.isArray(messages) ? messages : [messages])})
  },
  
  replyMessage: function(replyToken, messages) {
    return Line.send('reply', {replyToken: replyToken, messages: (Array.isArray(messages) ? messages : [messages])})
  },
  
  push: function(to, messages) {
    return Line.pushMessage(
      to,
      Util.array(messages).map(Line._buildMessage)
    )
  },
  
  reply: function(replyToken, messages) {
    return Line.replyMessage(
      replyToken,
      Util.array(messages).map(Line._buildMessage)
    )
  },
  
  _buildMessage: function(args) {
    if (args.text) {
      return {type: 'text', text: args.text}
    } else if (args.imageUrl) {
      return {type: 'image', originalContentUrl: args.imageUrl, previewImageUrl: (args.previewUrl || args.imageUrl)}
    } else if (args.stickerId) {
      return {type: 'sticker', packageId: args.packageId, stickerId: args.stickerId}
    } else {
      var m = JSON.stringify(args)
      Logger.log('unknown message type : ' + m)
      return {type: 'text', text: m}
    }
  },

}
