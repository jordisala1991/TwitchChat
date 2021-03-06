var ChatHandler = function(chatBox, chatInput) {
    this.messageCount = 1;
    this.chatBox = chatBox;
    this.chatInput = chatInput;
    this.maxChatMessages = 150;
}

ChatHandler.prototype.isScrolledToBottom = function() {
    return (this.chatBox[0].scrollHeight - this.chatBox.scrollTop() - 15) <= this.chatBox.outerHeight();
}

ChatHandler.prototype.scrollDown = function() {
    this.chatBox.scrollTop(this.chatBox[0].scrollHeight);
}

ChatHandler.prototype.deleteFirstMessages = function() {
    while (this.messageCount > this.maxChatMessages) {
        --this.messageCount;
        this.chatBox.find('.chat-line').first().remove();
    }
}

ChatHandler.prototype.addChatLine = function(chatLine) {
    var shouldScroll = this.isScrolledToBottom();

    ++this.messageCount;
    this.chatBox.append(chatLine);
    if (shouldScroll) {
        this.deleteFirstMessages();
        this.scrollDown();
    }
}

ChatHandler.prototype.removeAllChatLines = function() {
    this.chatBox.find('div').remove();
}

ChatHandler.prototype.removeChatLinesFrom = function(userName) {
    var messagesToDelete = this.chatBox.find('span[data-sender="' + userName + '"]');

    messagesToDelete.each(function() {
        $(this).parent().removeClass().addClass('chat-line').addClass('grey');
        $(this).parent().find('span.message').text('<message deleted>');
    });
}

ChatHandler.prototype.clearChatInput = function() {
    this.chatInput.val('');
}

ChatHandler.prototype.trackEvent = function(category, action, label) {
    if (typeof ga !== 'undefined') {
        ga('send', 'event', category, action, label);
    }
}
